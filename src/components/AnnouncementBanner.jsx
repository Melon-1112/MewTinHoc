import React, { useEffect, useRef, useState } from 'react';
import { Megaphone, PartyPopper, BellRing, CalendarHeart, X, Check, Star } from 'lucide-react';
import {
  fetchActiveAnnouncements,
  getDismissedIds,
  dismissAnnouncementForever
} from '../lib/announcementService.js';
import './announcement-banner.css';

const TYPE_ICONS = {
  info: Megaphone,
  success: PartyPopper,
  important: BellRing,
  event: CalendarHeart
};

const MAX_VISIBLE = 3;
// Phải >= thời lượng exit trong announcement-banner.css (200ms)
const LEAVE_MS = 210;
// Thông báo QUAN TRỌNG: phải chờ bấy nhiêu giây mới được tick "Không hiển thị lại"
const LOCK_SECONDS = 4;

/**
 * Hộp thông báo của Admin gửi tới mọi người truy cập web.
 * - Thông báo thường: xếp ở góc dưới trái.
 * - Thông báo gắn tag QUAN TRỌNG: hiện giữa màn hình, làm mờ nền; hiện lần lượt từng cái.
 * - Nút X: ẩn trong phiên hiện tại (tải lại trang sẽ hiện lại).
 * - Tick "Không hiển thị lại": ghi nhớ trên trình duyệt, thông báo này sẽ không bao giờ hiện lại.
 */
export default function AnnouncementBanner() {
  const [items, setItems] = useState([]);
  const [hiddenIds, setHiddenIds] = useState(() => new Set(getDismissedIds()));
  const [leavingIds, setLeavingIds] = useState(() => new Set());
  // Đếm ngược mở khoá ô "Không hiển thị lại" của thông báo QUAN TRỌNG (gắn theo id để mỗi thông báo tự đếm lại)
  const [countdown, setCountdown] = useState({ id: null, left: LOCK_SECONDS });
  const modalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchActiveAnnouncements().then((rows) => {
      if (!cancelled) setItems(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const hide = (id) => {
    setLeavingIds((prev) => new Set(prev).add(id));
    // Chờ animation thoát xong rồi mới gỡ khỏi DOM
    setTimeout(() => {
      setHiddenIds((prev) => new Set(prev).add(id));
      setLeavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, LEAVE_MS);
  };

  const handleNeverShow = (id, checked, locked) => {
    if (!checked || locked) return;
    dismissAnnouncementForever(id);
    hide(id);
  };

  const remaining = items.filter((a) => !hiddenIds.has(a.id));
  const modalItem = remaining.find((a) => a.is_important) || null;
  const toastItems = remaining.filter((a) => !a.is_important).slice(0, MAX_VISIBLE);
  const modalId = modalItem?.id;
  const modalLeaving = modalId ? leavingIds.has(modalId) : false;

  // Dựa trên mốc thời gian thay vì đếm tick để không lệch khi tab bị trình duyệt làm chậm
  useEffect(() => {
    if (!modalId) return undefined;
    const endAt = Date.now() + LOCK_SECONDS * 1000;
    setCountdown({ id: modalId, left: LOCK_SECONDS });

    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setCountdown({ id: modalId, left });
      if (left === 0) clearInterval(timer);
    }, 250);

    return () => clearInterval(timer);
  }, [modalId]);

  // Hộp giữa màn hình: khoá cuộn trang, nhận focus, đóng bằng Escape, trả focus khi xong
  useEffect(() => {
    if (!modalId) return undefined;
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') hide(modalId);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalId]);

  const renderCard = (a, { isModal = false, index = 0 } = {}) => {
    const type = TYPE_ICONS[a.type] ? a.type : 'info';
    const Icon = TYPE_ICONS[type];
    const checkId = `ann-never-${a.id}`;
    const titleId = `ann-title-${a.id}`;
    const leaving = leavingIds.has(a.id);
    // Chỉ thông báo QUAN TRỌNG bị khoá; id khác với đang đếm thì coi như chưa đếm xong (tránh nháy mở khoá ở frame đầu)
    const secondsLeft = isModal ? (countdown.id === a.id ? countdown.left : LOCK_SECONDS) : 0;
    const locked = secondsLeft > 0;

    return (
      <article
        key={a.id}
        ref={isModal ? modalRef : undefined}
        tabIndex={isModal ? -1 : undefined}
        role={isModal ? 'alertdialog' : undefined}
        aria-modal={isModal ? 'true' : undefined}
        aria-labelledby={isModal ? titleId : undefined}
        className={`ann-card ann-${type}${isModal ? ' ann-card-modal' : ''}${leaving ? ' ann-leaving' : ''}`}
        style={{ '--i': index }}
      >
        {isModal && (
          <span className="ann-badge">
            <Star size={11} fill="currentColor" aria-hidden="true" />
            Quan trọng
          </span>
        )}

        <div className="ann-head">
          <span className="ann-icon" aria-hidden="true">
            <Icon size={isModal ? 22 : 18} />
          </span>
          <h3 id={titleId} className="ann-title">{a.title}</h3>
          <button
            type="button"
            className="ann-close"
            onClick={() => hide(a.id)}
            aria-label="Đóng thông báo"
            title="Đóng (sẽ hiện lại khi tải lại trang)"
          >
            <X size={16} />
          </button>
        </div>

        <p className="ann-message">{a.message}</p>

        <div className="ann-foot">
          <input
            id={checkId}
            type="checkbox"
            className="ann-check-input"
            disabled={locked}
            onChange={(e) => handleNeverShow(a.id, e.target.checked, locked)}
          />
          <label
            htmlFor={checkId}
            className="ann-check-label"
            title={locked ? `Vui lòng đọc thông báo, có thể chọn sau ${secondsLeft} giây` : undefined}
          >
            <span className="ann-check-box" aria-hidden="true">
              <Check size={12} strokeWidth={3.5} />
            </span>
            Không hiển thị lại
            {locked && (
              <span className="ann-lock-count" aria-hidden="true">{secondsLeft}s</span>
            )}
          </label>
          {isModal && (
            <button type="button" className="ann-ok" onClick={() => hide(a.id)}>
              Đã hiểu
            </button>
          )}
        </div>
      </article>
    );
  };

  if (!modalItem && toastItems.length === 0) return null;

  return (
    <>
      {modalItem && (
        <div
          className={`ann-overlay${modalLeaving ? ' ann-overlay-leaving' : ''}`}
          onMouseDown={(e) => {
            // Bấm ra vùng mờ bên ngoài thì đóng (chỉ ẩn trong phiên)
            if (e.target === e.currentTarget) hide(modalItem.id);
          }}
        >
          {renderCard(modalItem, { isModal: true })}
        </div>
      )}

      {toastItems.length > 0 && (
        <section className="ann-stack" aria-label="Thông báo từ MewTinHoc" aria-live="polite">
          {toastItems.map((a, i) => renderCard(a, { index: i }))}
        </section>
      )}
    </>
  );
}
