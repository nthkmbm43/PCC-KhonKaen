'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Send client error to the central observability API
    fetch('/api/internal/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-log-secret': process.env.NEXT_PUBLIC_LOG_INTERNAL_SECRET || '',
      },
      body: JSON.stringify({
        message: error.message,
        name: error.name,
        digest: error.digest,
        url: window.location.href,
        global: true,
      }),
    }).catch(console.error);
  }, [error]);

  return (
    <html lang="th">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9fafb' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#dc2626', margin: '0' }}>500</h1>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginTop: '1rem' }}>
              ข้อผิดพลาดร้ายแรงของระบบ
            </h2>
            <p style={{ marginTop: '0.5rem', fontSize: '1.125rem', color: '#4b5563' }}>
              ขออภัย ระบบหลักทำงานผิดพลาด ไม่สามารถแสดงผลหน้าเว็บได้
            </p>
            <div style={{ marginTop: '2rem' }}>
              <button
                onClick={() => reset()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderRadius: '0.375rem',
                  color: '#fff',
                  backgroundColor: '#dc2626',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
              >
                ลองโหลดหน้าเว็บอีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
