import { NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireApiPermission } from "@/lib/auth/api";
import { revalidateTag } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().trim().min(2, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร").max(100),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง").max(255),
  role: z.enum(["admin", "superuser"]),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร").max(128).optional().or(z.literal("")),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const { id } = await params;
    const parsed = updateUserSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const [currentUser] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
    if (!currentUser) {
      return NextResponse.json({ error: "ไม่พบบัญชีผู้ดูแลระบบ" }, { status: 404 });
    }

    const email = parsed.data.email.toLowerCase();
    const [emailOwner] = await db.select({ id: admins.id }).from(admins).where(eq(admins.email, email)).limit(1);
    if (emailOwner && emailOwner.id !== id) {
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 409 });
    }

    if (session?.user?.id === id && parsed.data.role !== currentUser.role) {
      return NextResponse.json({ error: "ไม่สามารถเปลี่ยนบทบาทของบัญชีที่กำลังใช้งานอยู่" }, { status: 400 });
    }

    const values: Partial<typeof admins.$inferInsert> = {
      name: parsed.data.name,
      email,
      role: parsed.data.role,
    };
    if (parsed.data.password) {
      values.password = await bcrypt.hash(parsed.data.password, 10);
    }

    const [updatedUser] = await db.update(admins).set(values).where(eq(admins.id, id)).returning({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      role: admins.role,
      createdAt: admins.createdAt,
    });

    revalidateTag("admin-users", { expire: 0 });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "ไม่สามารถแก้ไขผู้ดูแลระบบได้" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    if (session?.user?.id === id) {
      return NextResponse.json({ error: "ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่" }, { status: 400 });
    }

    await db.delete(admins).where(eq(admins.id, id));
    revalidateTag("admin-users", { expire: 0 });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
