import { auth } from "@/auth";
import { canAccessRoute } from "@/lib/auth/rbac";
import { NextResponse } from "next/server";

export async function requireApiPermission(pathname: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!canAccessRoute(session.user.role, pathname)) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return { session, response: null };
}

export function requireBearerSecret(request: Request, envName: string) {
  const secret = process.env[envName];

  if (!secret) {
    return NextResponse.json(
      { error: `${envName} is not configured.` },
      { status: 503 }
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
