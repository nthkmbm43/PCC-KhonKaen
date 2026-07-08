'use client';

export default function ExitPreviewButton() {
  return (
    <button
      onClick={() => { window.location.href = '/api/exit-preview'; }}
      className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded-full transition-colors underline-none cursor-pointer"
    >
      Exit Preview
    </button>
  );
}
