import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { requireBearerSecret } from "@/lib/auth/api";

export async function POST(request: NextRequest) {
  try {
    const secretResponse = requireBearerSecret(request, "REVALIDATION_SECRET");
    if (secretResponse) return secretResponse;

    const body = await request.json();
    const { collection, slug } = body;

    if (!collection) {
      return NextResponse.json({ message: "Missing collection" }, { status: 400 });
    }

    // Determine paths to revalidate based on collection and slug
    const pathsToRevalidate: string[] = [];

    if (collection === "pages") {
      if (slug === "home") {
        pathsToRevalidate.push("/");
      } else if (slug) {
        pathsToRevalidate.push(`/${slug}`);
      }
    } else if (collection === "products") {
      pathsToRevalidate.push("/products");
      if (slug) {
        pathsToRevalidate.push(`/products/${slug}`);
      }
    }

    if (pathsToRevalidate.length === 0) {
      return NextResponse.json({ message: "No valid paths to revalidate" }, { status: 400 });
    }

    // Revalidate each targeted path
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
      console.log(`[Revalidate] Purged cache for: ${path}`);
    }

    return NextResponse.json({ revalidated: true, paths: pathsToRevalidate });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
