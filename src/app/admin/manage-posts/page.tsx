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
      setPosts(res.data.data);
    } catch (error) {
      toast.error("خطا در دریافت لیست اخبار");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Toast Confirm
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
      toast.success("خبر حذف شد.");
      fetchPosts();
    } catch (error: any) {
      toast.error("خطا در حذف.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-5xl">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-orange-500"/> مدیریت وبلاگ
        </h1>
        <Link href="/admin/create-post" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition">
            <Plus className="h-5 w-5"/> نوشته جدید
        </Link>
      </div>

      <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {posts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">هیچ مقاله‌ای موجود نیست.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">تصویر</th>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">عنوان</th>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">نویسنده</th>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-white/5 transition">
                                {/* نمایش تصویر */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-12 w-20 rounded-lg overflow-hidden bg-slate-800 border border-white/10 relative">
                                        <img src={post.thumbnail || "https://picsum.photos/200/100"} alt={post.title} className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-medium">{post.title}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{post.author?.name || "نامشخص"}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-blue-400 bg-blue-500/10 rounded-lg"><Eye className="h-4 w-4"/></Link>
                                    <Link href={`/admin/edit-post/${post._id}`} className="p-2 text-yellow-400 bg-yellow-500/10 rounded-lg"><Edit className="h-4 w-4"/></Link>
                                    <button onClick={() => confirmDelete(post._id)} className="p-2 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 className="h-4 w-4"/></button>
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