"use client";

import { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Trash2, Mail, Lock, User as UserIcon, Pencil, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  createdAt: Date | null;
};

export function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "superuser">("admin");
  const [editPassword, setEditPassword] = useState("");

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role === "superuser" ? "superuser" : "admin");
    setEditPassword("");
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsEditing(true);

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          password: editPassword,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "แก้ไขผู้ดูแลระบบไม่สำเร็จ");

      setUsers((current) => current.map((user) => user.id === result.id
        ? { ...user, ...result, createdAt: result.createdAt ? new Date(result.createdAt) : user.createdAt }
        : user));
      setEditingUser(null);
      setEditPassword("");
      toast.success("แก้ไขข้อมูลผู้ดูแลระบบเรียบร้อยแล้ว");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "แก้ไขผู้ดูแลระบบไม่สำเร็จ");
    } finally {
      setIsEditing(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add user");
      }

      const newUser = await res.json();
      setUsers([...users, { ...newUser, createdAt: new Date() }]);
      
      toast.success("เพิ่มผู้ดูแลระบบสำเร็จ");
      setIsOpen(false);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete user");
      }

      setUsers(users.filter((u) => u.id !== id));
      toast.success("ลบผู้ดูแลระบบสำเร็จ");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">รายชื่อผู้ดูแลระบบ</h2>
          <p className="text-sm text-slate-500">บัญชีหลัก (Master Admin) จะไม่แสดงในตารางนี้</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={(props) => (
            <Button {...props} className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700 sm:w-auto">
              <UserPlus className="w-4 h-4" />
              เพิ่มผู้ดูแล
            </Button>
          )} />
          <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[425px]">
            <form onSubmit={handleAddUser}>
              <DialogHeader>
                <DialogTitle>เพิ่มผู้ดูแลระบบใหม่</DialogTitle>
                <DialogDescription>
                  ผู้ใช้นี้จะสามารถล็อกอินเข้ามาแก้ไขและจัดการเนื้อหาเว็บไซต์ได้
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      className="pl-9"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล (ใช้สำหรับล็อกอิน)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="admin@example.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "กำลังบันทึก..." : "เพิ่มบัญชี"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">ชื่อ</th>
              <th className="px-6 py-4">อีเมล</th>
              <th className="px-6 py-4">บทบาท</th>
              <th className="px-6 py-4">วันที่เพิ่ม</th>
              <th className="px-6 py-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  ไม่มีผู้ดูแลระบบเพิ่มเติม (ใช้งานผ่านบัญชีหลัก)
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy", { locale: th }) : "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                      onClick={() => openEditDialog(user)}
                      aria-label={`แก้ไขข้อมูล ${user.name}`}
                    >
                      <Pencil className="mr-1.5 h-4 w-4" />
                      แก้ไข
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger render={(props) => (
                        <Button 
                          {...props}
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          ลบ
                        </Button>
                      )} />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการลบบัญชี?</AlertDialogTitle>
                          <AlertDialogDescription>
                            คุณกำลังจะลบบัญชี <strong>{user.name}</strong> ออกจากระบบ พวกเขาจะไม่สามารถล็อกอินได้อีกต่อไป
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            ยืนยันการลบ
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={editingUser !== null} onOpenChange={(open) => {
        if (!open && !isEditing) setEditingUser(null);
      }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[460px]">
          <form onSubmit={handleEditUser}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-blue-600" />
                แก้ไขข้อมูลผู้ดูแลระบบ
              </DialogTitle>
              <DialogDescription>
                แก้ไขชื่อ อีเมล บทบาท หรือกำหนดรหัสผ่านใหม่ หากไม่ต้องการเปลี่ยนรหัสผ่านให้เว้นช่องไว้
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name">ชื่อ-นามสกุล</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="edit-name"
                    required
                    minLength={2}
                    maxLength={100}
                    className="pl-9"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    disabled={isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">อีเมลสำหรับเข้าสู่ระบบ</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="edit-email"
                    type="email"
                    required
                    maxLength={255}
                    className="pl-9"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    disabled={isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">บทบาทและสิทธิ์</Label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <select
                    id="edit-role"
                    value={editRole}
                    onChange={(event) => setEditRole(event.target.value as "admin" | "superuser")}
                    disabled={isEditing}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                  >
                    <option value="admin">Admin — จัดการเนื้อหาและลูกค้า</option>
                    <option value="superuser">Superuser — เข้าถึงทุกส่วน</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-password">รหัสผ่านใหม่ (ไม่บังคับ)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="edit-password"
                    type="password"
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    placeholder="เว้นว่างเพื่อใช้รหัสผ่านเดิม"
                    className="pl-9"
                    value={editPassword}
                    onChange={(event) => setEditPassword(event.target.value)}
                    disabled={isEditing}
                  />
                </div>
                <p className="text-xs text-slate-500">กรอกรหัสผ่านใหม่อย่างน้อย 8 ตัวอักษร เฉพาะเมื่อต้องการเปลี่ยน</p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingUser(null)} disabled={isEditing}>
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isEditing} className="bg-blue-600 text-white hover:bg-blue-700">
                {isEditing ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
