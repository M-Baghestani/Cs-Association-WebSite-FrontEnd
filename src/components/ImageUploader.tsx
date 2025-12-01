"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Props {
  onUpload: (url: string) => void;
  defaultImage?: string;
  label?: string;
}

export default function ImageUploader({ onUpload, defaultImage = "", label = "آپلود تصویر" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImage);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("خطا: برای آپلود باید وارد سیستم شوید.");
        return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        // 🚨 FIX: ارسال هدر Authorization با توکن
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
        body: formData,
      });

      // بررسی دقیق وضعیت پاسخ
      if (res.status === 401) {
         toast.error("توکن منقضی یا نامعتبر است. لطفاً مجدداً وارد شوید.");
         return;
      }
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      setPreview(json.url);
      onUpload(json.url);
      toast.success("تصویر با موفقیت آپلود شد 🖼️");

    } catch (error: any) {
      toast.error(error.message || "خطا در آپلود تصویر");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview("");
    onUpload("");
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm text-gray-400">{label}</label>
      
      {preview ? (
        <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <Image 
            src={preview} 
            alt="Uploaded" 
            fill 
            className="object-contain" 
            unoptimized 
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 rounded-full bg-red-600/80 p-1.5 text-white hover:bg-red-500 transition backdrop-blur-sm"
            title="حذف تصویر"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-white/5 transition hover:border-blue-500 hover:bg-white/10 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-xs text-gray-400">در حال آپلود...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-400">برای آپلود کلیک کنید</span>
              <span className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP (Max 5MB)</span>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="hidden" 
            disabled={uploading} 
          />
        </label>
      )}
    </div>
  );
}