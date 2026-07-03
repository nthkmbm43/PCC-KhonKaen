import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.REVALIDATION_SECRET;

    // Secure the webhook if a secret is configured in env
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
