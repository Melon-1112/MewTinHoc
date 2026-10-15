import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ShieldCheck, Search, RotateCw, ArrowLeft, Users, CheckCircle, Clock } from 'lucide-react';

export default function AdminPage() {
    const [rows, setRows] = useState([]);
    const [q, setQ] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState('Đang tải danh sách tài khoản...');

    const load = async () => {
        setIsLoading(true);
        setMsg('Đang tải...');
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('userid, username, email, is_admin, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                setMsg('Lỗi truy vấn bảng profiles: ' + error.message);
                setRows([]);
                return;
            }

            setRows(data || []);
            setMsg(data && data.length === 0 ? 'Chưa có tài khoản nào trong bảng profiles.' : '');
        } catch (err) {
            setMsg('Lỗi kết nối Supabase: ' + (err?.message || 'Không xác định'));
            setRows([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { 
        load(); 
    }, []);

    const shown = (rows || []).filter((r) =>
        `${r?.userid || ''} ${r?.username || ''} ${r?.email || ''}`.toLowerCase().includes(q.toLowerCase())
    );

    const handleBackHome = () => {
        const baseUrl = import.meta.env.BASE_URL || '/';
        window.location.href = baseUrl;
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#F9FAFB',
            color: '#1F2937',
            padding: '2rem 1.5rem',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #E5E7EB'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: '#EA580C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFF'
                        }}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                                Trang Quản Trị Hệ Thống
                            </h1>
                            <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '2px 0 0 0' }}>
                                Quản lý danh sách tài khoản học viên và phân quyền
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleBackHome}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.6rem 1rem',
                            background: '#FFFFFF',
                            border: '1.5px solid #D1D5DB',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ArrowLeft size={16} />
                        Quay lại Trang Chủ
                    </button>
                </div>

                {/* Filter and stats bar */}
                <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo User ID, họ tên, email..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                                border: '1.5px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4B5563', fontSize: '0.875rem', fontWeight: 600 }}>
                            <Users size={18} color="#EA580C" />
                            <span>Tổng số: <strong>{rows.length}</strong></span>
                            {q && <span style={{ color: '#6B7280' }}>(Khớp: {shown.length})</span>}
                        </div>

                        <button
                            onClick={load}
                            disabled={isLoading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.6rem 1rem',
                                background: '#EA580C',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            <RotateCw size={16} className={isLoading ? 'spin-icon' : ''} />
                            Tải lại
                        </button>
                    </div>
                </div>

                {/* Status Notice */}
                {msg && (
                    <div style={{
                        padding: '0.85rem 1.25rem',
                        borderRadius: '8px',
                        background: msg.includes('Lỗi') ? '#FEE2E2' : '#EFF6FF',
                        color: msg.includes('Lỗi') ? '#B91C1C' : '#1D4ED8',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        border: `1px solid ${msg.includes('Lỗi') ? '#FCA5A5' : '#BFDBFE'}`
                    }}>
                        {msg}
                    </div>
                )}

                {/* Table */}
                <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151', width: '50px' }}>#</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151' }}>User ID</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151' }}>Họ và tên</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151' }}>Email</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151', textAlign: 'center' }}>Admin</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#374151' }}>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shown.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#9CA3AF' }}>
                                        {isLoading ? 'Đang lấy dữ liệu...' : 'Không tìm thấy tài khoản nào.'}
                                    </td>
                                </tr>
                            ) : (
                                shown.map((r, i) => (
                                    <tr
                                        key={r.userid || i}
                                        style={{
                                            borderBottom: '1px solid #F3F4F6',
                                            transition: 'background 0.15s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '0.85rem 1rem', color: '#6B7280', fontWeight: 500 }}>{i + 1}</td>
                                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#111827' }}>
                                            <code>{r.userid}</code>
                                        </td>
                                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1F2937' }}>{r.username || '—'}</td>
                                        <td style={{ padding: '0.85rem 1rem', color: '#4B5563' }}>{r.email || '—'}</td>
                                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                                            {r.is_admin ? (
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.2rem',
                                                    background: '#DCFCE7',
                                                    color: '#166534',
                                                    padding: '2px 8px',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700
                                                }}>
                                                    <CheckCircle size={12} /> Admin
                                                </span>
                                            ) : (
                                                <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>Học viên</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.85rem 1rem', color: '#6B7280', fontSize: '0.8rem' }}>
                                            {r.created_at ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <Clock size={13} />
                                                    {new Date(r.created_at).toLocaleString('vi-VN')}
                                                </span>
                                            ) : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}