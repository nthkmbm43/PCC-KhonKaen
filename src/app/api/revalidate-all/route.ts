import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  revalidateTag('products');
  revalidateTag('pages');
  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true, message: 'All caches purged.' });
}
