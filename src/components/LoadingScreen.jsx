import React, { useEffect, useState } from 'react';
import catCamWebp from '../assets/cat-cam-loading.webp';
import catCamGif from '../assets/cat-cam-loading-transparent.gif';

const SIZE_PRESETS = {
  sm: { box: 200, msg: '11px', bar: 6, hint: '0.85rem' },
  md: { box: 280, msg: '12px', bar: 8, hint: '0.95rem' },
  lg: { box: 420, msg: '13px', bar: 10, hint: '1.05rem' }
};

/**
 * Màn hình Loading toàn trang / dạng box nhỏ.
 *
 * - @ThanhNhi nằm ở góc trên bên trái
 * - Animation con mèo cam ở chính giữa
 * - 3 chấm nhịp + thanh progress + dòng trạng thái bên dưới
 *
 * Về animation: file WebP được dùng làm chính vì GIF chỉ hỗ trợ alpha 1-bit
 * theo palette và dùng frame disposal, khiến một số trình duyệt nháy nền đen
 * quanh mèo. WebP có alpha 8-bit đầy đủ nên không còn hiện tượng này.
 */
export default function LoadingScreen({
  text = 'Đang tải',
  size = 'lg',
  showHint = true,
  showCredit = true,
  fullScreen = true
}) {
  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.lg;
  const [src, setSrc] = useState(catCamWebp);

  // Nếu trình duyệt quá cũ không hỗ trợ WebP thì dùng GIF
  useEffect(() => {
    setSrc(catCamWebp);
  }, []);

  const handleError = () => {
    setSrc((prev) => (prev === catCamGif ? prev : catCamGif));
  };

  const wrapperStyle = fullScreen
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        background:
          'radial-gradient(circle at 20% 20%, rgba(251,191,36,0.22), transparent 55%),' +
          'radial-gradient(circle at 85% 80%, rgba(234,88,12,0.22), transparent 55%),' +
          'linear-gradient(180deg, #FFFCF7 0%, #FFE8B8 100%)',
        backgroundColor: '#FFFCF7',
        colorScheme: 'light',
        color: '#7C2D12',
        fontFamily:
          "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        textAlign: 'center',
        padding: '1.5rem',
        overflow: 'hidden'
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        padding: '1rem',
        fontFamily: 'inherit',
        background: 'transparent',
        color: '#7C2D12'
      };

  return (
    <div style={wrapperStyle} role="status" aria-live="polite" aria-label="Đang tải">
      {showCredit && (
        <div
          style={{
            position: fullScreen ? 'absolute' : 'static',
            top: fullScreen ? '14px' : undefined,
            left: fullScreen ? '16px' : undefined,
            fontSize: preset.msg,
            color: '#7C2D12',
            fontWeight: 600,
            letterSpacing: '0.02em',
            opacity: 0.8,
            fontStyle: 'italic',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: fullScreen ? 'rgba(255,252,247,0.7)' : 'transparent',
            padding: fullScreen ? '4px 10px' : 0,
            borderRadius: fullScreen ? '999px' : 0,
            border: fullScreen ? '1px solid rgba(124,45,18,0.18)' : 'none',
            WebkitBackdropFilter: fullScreen ? 'blur(6px)' : undefined
          }}
        >
          <span
            aria-hidden
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#EA580C',
              boxShadow: '0 0 0 0 rgba(234,88,12, 0.7)',
              animation: 'loading-credit-pulse 1.6s infinite'
            }}
          />
          @ThanhNhi
        </div>
      )}

      {/* Animation con mèo: đã crop sát nội dung, không có vùng đệm nào để nháy nền */}
      <img
        src={src}
        alt="Đang tải..."
        draggable={false}
        decoding="async"
        onError={handleError}
        style={{
          width: `${preset.box}px`,
          maxWidth: '82vw',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
          background: 'transparent',
          border: 'none',
          marginTop: '-10px'
        }}
      />

      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          width: 'min(320px, 80vw)'
        }}
      >
        <div style={{ display: 'inline-flex', gap: '7px' }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: `${preset.bar}px`,
                height: `${preset.bar}px`,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EA580C, #C2410C)',
                display: 'inline-block',
                animation: `loading-dot-bounce 1s ${i * 0.18}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        <div
          style={{
            width: '100%',
            height: '5px',
            borderRadius: '999px',
            background: 'rgba(124,45,18,0.12)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '45%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #EA580C, #FBBF24)',
              animation: 'loading-bar-slide 1.4s infinite ease-in-out'
            }}
          />
        </div>

        {showHint && text && (
          <div
            style={{
              fontSize: preset.hint,
              color: '#7C2D12',
              fontWeight: 700,
              opacity: 0.9,
              marginTop: '2px'
            }}
          >
            {text}
            <span style={{ marginLeft: 2 }}>...</span>
          </div>
        )}
      </div>
    </div>
  );
}