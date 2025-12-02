"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Props {
  onUpload: (url: string) => void;
  label?: string;
  accept?: string;
}

export default function FileUploader({ onUpload, label = "آپلود فایل", accept = ".pdf" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file); // نام فیلد در بک‌اند همان 'image' است

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (res.data.success) {
        setFileUrl(res.data.url);
        onUpload(res.data.url);
        toast.success("فایل با موفقیت آپلود شد 📄");
      }
    } catch (error) {
      toast.error("خطا در آپلود فایل.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm text-gray-400">{label}</label>
      
      {fileUrl ? (
        <div className="flex items-center justify-between p-4 rounded-xl border border-green-500/30 bg-green-900/10">
          <div className="flex items-center gap-3 text-green-400">
            <FileText className="h-6 w-6" />
            <span className="text-sm font-bold">فایل آپلود شد</span>
          </div>
          <button type="button" onClick={() => { setFileUrl(""); onUpload(""); }} className="text-red-400 hover:text-red-300"><X/></button>
        </div>
      ) : (
        <label className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-white/5 transition hover:border-blue-500 ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? (
            <div className="flex flex-col items-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /><span className="text-xs text-gray-400">در حال آپلود...</span></div>
          ) : (
            <><UploadCloud className="mb-2 h-8 w-8 text-gray-400" /><span className="text-sm text-gray-400">برای انتخاب PDF کلیک کنید</span></>
          )}
          <input type="file" accept={accept} onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  );
}