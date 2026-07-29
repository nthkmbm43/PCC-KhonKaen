'use client';

import { Download } from 'lucide-react';
import { trackLeadEvent } from '@/lib/lead-attribution';

export function TrackedDownloadLink({ slug, title, compact = false }: { slug: string; title: string; compact?: boolean }) {
  return (
    <a
      href={`/api/documents/${slug}/download`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLeadEvent('download_document', {
        document_slug: slug,
        document_title: title,
        page_path: window.location.pathname,
        lead_team: 'khon-kaen-new-team',
        source_site: window.location.hostname,
      })}
      className={compact
        ? 'inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline'
        : 'inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md sm:w-auto'}
    >
      <Download className="h-4 w-4" />
      {compact ? 'ดาวน์โหลด PDF' : 'เปิดหรือดาวน์โหลด PDF'}
    </a>
  );
}
