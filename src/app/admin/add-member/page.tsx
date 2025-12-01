"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Briefcase, Linkedin, Github, FileText } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "../../../components/ImageUploader"; // 👈 ایمپورت

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(""); // 👈 استیت عکس

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr || JSON.parse(userStr).role !== "admin") {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // ساخت دیتای نهایی
    const data = {
        name: formData.get("name"),
        role: formData.get("role"),
        bio: formData.get("bio"),
        linkedin: formData.get("linkedin"),
        github: formData.get("github"),
        image: image, // 👈 استفاده از لینک آپلود شده
    }
    
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("خطا در افزودن عضو");

      toast.success("✅ عضو جدید با موفقیت اضافه شد!");
      router.push("/team");

    } catch (error) {
      toast.error("مشکلی پیش آمد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-24">
      <h1 className="mb-8 text-3xl font-bold text-white text-center">افزودن عضو جدید 👤</h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-md">
        
        {/* آپلودر عکس پروفایل */}
        <div className="mx-auto w-40">
            <ImageUploader onUpload={(url) => setImage(url)} label="عکس پروفایل" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">نام و نام خانوادگی</label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="name" required className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">سمت در انجمن</label>
            <div className="relative">
              <Briefcase className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="role" required className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">بیوگرافی کوتاه</label>
          <div className="relative">
            <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
            <textarea name="bio" rows={3} className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">لینک لینکدین</label>
            <div className="relative">
              <Linkedin className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="linkedin" className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm text-gray-400">لینک گیت‌هاب</label>
            <div className="relative">
              <Github className="absolute right-3 top-3 h-5 w-5 text-gray-500" />
              <input name="github" className="w-full rounded-xl bg-white/5 py-3 pr-10 pl-4 text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <button disabled={loading} type="submit" className="mt-4 flex w-full justify-center rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" /> : "افزودن عضو جدید"}
        </button>
      </form>
    </div>
  );
}