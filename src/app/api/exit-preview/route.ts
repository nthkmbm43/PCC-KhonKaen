import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  // Disable draft mode to clear the preview cookie
  (await draftMode()).disable();

  // Redirect back to the page the user was on, or home if unknown
  const referer = request.headers.get('referer');
  if (referer) {
    redirect(referer);
  } else {
    redirect('/');
  }
}
