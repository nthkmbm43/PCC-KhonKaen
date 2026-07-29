import { DocumentForm } from '@/components/admin/DocumentForm';
import { requireAdminPagePermission } from '@/lib/auth/page';

export default async function NewDocumentPage() {
  await requireAdminPagePermission('/admin/documents');
  return <DocumentForm />;
}
