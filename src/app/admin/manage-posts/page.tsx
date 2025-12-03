"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Loader2, FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);
      if (res.data.success) {
          setPosts(res.data.data);
      }
    } catch (error) {
      toast.error("خطا در دریافت لیست مقالات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // 🚨 FIX: Toast Confirm برای حذف
  const confirmDelete = (id: string) => {
    toast((t) => (
        <div className="flex flex-col gap-3 items-center bg-slate-800 p-4 rounded-lg shadow-2xl border border-red-600">
            <span className="font-bold text-sm text-white">آیا از حذف این مقاله مطمئن هستید؟</span>
            <div className="flex justify-center gap-3 w-full">
                <button onClick={() => { handleDelete(id); toast.dismiss(t.id); }} className="flex-1 rounded bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-500 transition">بله، حذف کن</button>
                <button onClick={() => toast.dismiss(t.id)} className="flex-1 rounded bg-gray-600 px-3 py-1.5 text-xs text-white hover:bg-gray-500 transition">انصراف</button>
            </div>
        </div>
    ), { duration: Infinity, style: { padding: '0px', background: 'transparent' } });
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("مقاله حذف شد.");
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-6xl">
      
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-orange-500"/>
            مدیریت وبلاگ
        </h1>
        <Link href="/admin/create-post" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition font-bold shadow-lg shadow-blue-600/20">
            <Plus className="h-5 w-5"/> نوشته جدید
        </Link>
      </div>

      <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {posts.length === 0 ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                <FileText className="h-16 w-16 mb-4 opacity-20"/>
                <p>هیچ مقاله‌ای منتشر نشده است.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-slate-950/50">
                        <tr>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">تصویر</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">عنوان</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">نویسنده</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">تاریخ</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-white/5 transition duration-200">
                                
                                {/* تصویر کوچک */}
                                <td className="px-6 py-4 whitespace-nowrap w-24">
                                    <div className="h-14 w-20 rounded-lg overflow-hidden bg-slate-800 border border-white/10 relative shadow-md">
                                        <img src={post.thumbnail || "https://picsum.photos/200/100"} alt={post.title} className="w-full h-full object-cover" />
                                    </div>
                                </td>

                                {/* عنوان */}
                                <td className="px-6 py-4 text-white font-medium max-w-xs truncate" title={post.title}>
                                    {post.title}
                                </td>

                                {/* نویسنده */}
                                {/* 🚨 FIX: استفاده از ?. برای جلوگیری از کرش (Null Safety) */}
                                <td className="px-6 py-4 text-gray-400 text-sm hidden sm:table-cell">{post.author?.name || "نامشخص"}</td>

                                {/* تاریخ */}
                                <td className="px-6 py-4 text-gray-500 text-xs hidden sm:table-cell">{new Date(post.createdAt).toLocaleDateString('fa-IR')}</td>

                                {/* دکمه‌ها */}
                                <td className="px-6 py-4 flex gap-2">
                                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition shadow-sm" title="مشاهده">
                                        <Eye className="h-4 w-4"/>
                                    </Link>
                                    <Link href={`/admin/edit-post/${post._id}`} className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-600 hover:text-white rounded-lg transition shadow-sm" title="ویرایش">
                                        <Edit className="h-4 w-4"/>
                                    </Link>
                                    <button onClick={() => confirmDelete(post._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition shadow-sm" title="حذف">
                                        <Trash2 className="h-4 w-4"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}