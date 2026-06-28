"use client";

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    // Optional: limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      
      onChange(newBlob.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      // Failsafe: if Vercel Blob fails (e.g. no token configured yet), show friendly error
      if (err.message?.includes("token") || err.message?.includes("credentials")) {
         setError("ไม่สามารถอัปโหลดได้ (กรุณาตั้งค่า Vercel Blob ใน Environment Variables)");
      } else {
         setError(err.message || "เกิดข้อผิดพลาดในการอัปโหลด");
      }
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4">
        <Input 
          type="text" 
          placeholder="https://... หรืออัปโหลดไฟล์" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isUploading}
          className="flex-1 bg-white"
        />
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button 
          type="button" 
          variant="secondary" 
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4 mr-2" />
          )}
          {isUploading ? "Uploading..." : "อัปโหลดภาพ"}
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      {value && (
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={value} 
            alt="Uploaded Preview" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Hide broken image icon
              (e.target as HTMLImageElement).style.display = 'none';
              e.currentTarget.parentElement?.classList.add('broken-image');
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="rounded-full"
              onClick={() => onChange("")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            .broken-image::after {
              content: 'Invalid Image URL';
              font-size: 0.75rem;
              color: #94a3b8;
              position: absolute;
            }
          `}} />
        </div>
      )}
    </div>
  );
}
