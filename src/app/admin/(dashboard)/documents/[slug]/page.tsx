import { notFound } from 'next/navigation';
import { DocumentForm } from '@/components/admin/DocumentForm';
import { requireAdminPagePermission } from '@/lib/auth/page';
import { getEditableDocument } from '@/lib/repositories/document';

export default async function EditDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminPagePermission('/admin/documents');
  const { slug } = await params;
  const document = await getEditableDocument(slug);
  if (!document) notFound();
  return <DocumentForm initialData={document} />;
}
