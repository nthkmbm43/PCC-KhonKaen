'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
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
      }),
    }).catch(console.error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-red-600">500</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">
            เกิดข้อผิดพลาดในระบบ
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            ขออภัย มีบางอย่างทำงานผิดพลาด โปรดลองอีกครั้งหรือกลับสู่หน้าหลัก
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-150 ease-in-out shadow-sm"
          >
            ลองใหม่อีกครั้ง
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out shadow-sm"
          >
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
