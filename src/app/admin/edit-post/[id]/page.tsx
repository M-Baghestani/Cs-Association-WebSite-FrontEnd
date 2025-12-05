// src/app/admin/edit-post/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, FileText, Type, Save, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import ImageUploader from "../../../../components/ImageUploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🚨 FIX: افزودن publishedAt به State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail: "",
    category: "ARTICLE",
    publishedAt: new Date().toISOString().split('T')[0], // مقدار پیشفرض موقت
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts/${params.id}`);
        const data = res.data.data;
        
        // 🚨 FIX: تبدیل تاریخ ISO به YYYY-MM-DD برای فیلد input type="date"
        if (data.publishedAt) {
            data.publishedAt = new Date(data.publishedAt).toISOString().split('T')[0];
        } else {
            data.publishedAt = new Date().toISOString().split('T')[0];
        }

        setFormData(data);
      } catch (error) {
        toast.error("خبر یافت نشد.");
        router.push("/admin/manage-posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/posts/${params.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("خبر با موفقیت ویرایش شد ✅");
      router.push("/admin/manage-posts");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ویرایش.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-white">
        در حال دریافت اطلاعات...
      </div>
    );

  return (
    <div className="container mx-auto max-w-2xl px-4 py-24">
      <h1 className="mb-8 text-3xl font-bold text-white text-center">
        ویرایش خبر ✏️
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-md"
      >
        <ImageUploader
          onUpload={(url) => setFormData({ ...formData, thumbnail: url })}
          defaultImage={formData.thumbnail}
          label="تصویر شاخص خبر"
        />

        <div className="grid md:grid-cols-3 gap-6">
            {/* عنوان خبر */}
            <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-400">عنوان خبر</label>
                <div className="relative">
                    <Type className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
                    <input
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            
            {/* 🚨 FIX: فیلد تاریخ انتشار */}
            <div>
                <label className="mb-2 block text-sm text-gray-400">تاریخ انتشار</label>
                <div className="relative">
                    <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-gray-500" />
                    <input 
                        type="date"
                        value={formData.publishedAt}
                        onChange={e => setFormData({ ...formData, publishedAt: e.target.value })}
                        required
                        className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white focus:ring-2 focus:ring-blue-500 ltr-text" 
                    />
                </div>
            </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            آدرس یکتا (Slug)
          </label>
          <input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full rounded-xl bg-white/5 py-3 px-4 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">متن خبر</label>
          <div className="relative">
            <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={10}
              required
              className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          disabled={saving}
          type="submit"
          className="w-full flex justify-center rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-500 gap-2"
        >
          {saving ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Save className="h-5 w-5" /> ذخیره تغییرات
            </>
          )}
        </button>
      </form>
    </div>
  );
}