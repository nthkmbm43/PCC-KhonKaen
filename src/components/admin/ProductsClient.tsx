"use client";

import { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ExternalLink, Edit, Trash2, Tag, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
import Image from "next/image";

export function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredProducts = initialProducts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteProduct(id: string) {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("ลบสินค้าเรียบร้อยแล้ว");
        router.refresh();
      } else {
        toast.error("ลบสินค้าไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="ค้นหาสินค้าจากชื่อ หรือ URL..." 
            className="pl-9 bg-white border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2">
            <Plus className="w-4 h-4" />
            สร้างสินค้าใหม่
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">สินค้า</th>
                <th className="px-6 py-4 font-semibold">หมวดหมู่</th>
                <th className="px-6 py-4 font-semibold">URL Slug</th>
                <th className="px-6 py-4 font-semibold">สถานะ</th>
                <th className="px-6 py-4 font-semibold">อัปเดตล่าสุด</th>
                <th className="px-6 py-4 font-semibold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Tag className="w-12 h-12 mb-3 opacity-20" />
                      <p>ไม่พบสินค้าที่ค้นหา</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                          {product.image ? (
                            <Image src={product.image} alt={product.title} width={40} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <Tag className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 flex items-center gap-2">
                            {product.title}
                            {product.isFeatured === 'true' && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{product.shortTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                        {product.category || 'ทั่วไป'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      /{product.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' 
                          : 'bg-amber-50 text-amber-600 border border-amber-200/50'
                      }`}>
                        {product.status === 'published' ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {format(new Date(product.updatedAt || product.createdAt), 'dd MMM yyyy', { locale: th })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products/${product.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger render={
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              disabled={isDeleting === product.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          } />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>ยืนยันการลบสินค้า?</AlertDialogTitle>
                              <AlertDialogDescription>
                                คุณกำลังจะลบสินค้า "{product.title}" การกระทำนี้ไม่สามารถย้อนกลับได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-600 hover:bg-red-700"
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
      </div>
    </div>
  );
}
