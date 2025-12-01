"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Loader2, FileText, Plus, XCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. دریافت لیست پست‌ها
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);
      if (res.data.success) {
          setPosts(res.data.data);
      }
    } catch (error) {
      toast.error("خطا در دریافت لیست اخبار");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // 2. تابع نمایش پاپ‌آپ تأیید (Pop-up Confirm)
  const confirmDelete = (id: string) => {
    toast((t) => (
        <div className="flex flex-col gap-4 items-center bg-slate-800 p-2 rounded-lg min-w-[300px]">
            <div className="flex items-center gap-2 text-white font-bold">
                <XCircle className="text-red-500 h-6 w-6" />
                <span>آیا این خبر حذف شود؟</span>
            </div>
            <p className="text-xs text-gray-400">این عملیات غیرقابل بازگشت است.</p>
            
            <div className="flex gap-3 w-full mt-2">
                <button
                    onClick={() => {
                        handleDelete(id); 
                        toast.dismiss(t.id); 
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm transition flex items-center justify-center gap-1"
                >
                    <Trash2 className="h-4 w-4"/> بله، حذف
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition"
                >
                    انصراف
                </button>
            </div>
        </div>
    ), { 
        duration: Infinity, // تا وقتی کلیک نکند نمی‌رود
        style: { 
            background: 'transparent', 
            boxShadow: 'none',
            padding: 0 
        } 
    });
  };

  // 3. تابع حذف واقعی (ارسال به بک‌اند)
  const handleDelete = async (id: string) => {
    const loadingToast = toast.loading("در حال حذف...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("خبر با موفقیت حذف شد.", { id: loadingToast });
      fetchPosts(); // رفرش لیست

    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف خبر.", { id: loadingToast });
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
        
        <Link href="/admin/create-post" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-600/20 font-bold">
            <Plus className="h-5 w-5"/> نوشتن مقاله جدید
        </Link>
      </div>

      <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-xl">
        {posts.length === 0 ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                <FileText className="h-12 w-12 mb-4 opacity-20"/>
                <p>هیچ مقاله‌ای موجود نیست.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-slate-950/50">
                        <tr>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">تصویر</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">عنوان</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">نویسنده</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">تاریخ</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-white/5 transition duration-200">
                                
                                {/* تصویر کوچک */}
                                <td className="px-6 py-4 whitespace-nowrap w-24">
                                    <div className="h-14 w-20 rounded-lg overflow-hidden bg-slate-800 border border-white/10 relative shadow-md">
                                        <img 
                                            src={post.thumbnail || "https://picsum.photos/200/100"} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                </td>

                                {/* عنوان */}
                                <td className="px-6 py-4 text-white font-medium max-w-xs truncate" title={post.title}>
                                    {post.title}
                                </td>

                                {/* نویسنده */}
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {post.author?.name || <span className="text-red-400 text-xs">نامشخص</span>}
                                </td>

                                {/* تاریخ */}
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                                </td>

                                {/* دکمه‌ها */}
                                <td className="px-6 py-4 flex gap-2">
                                    {/* مشاهده */}
                                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition" title="مشاهده در سایت">
                                        <Eye className="h-4 w-4"/>
                                    </Link>
                                    
                                    {/* ویرایش */}
                                    <Link href={`/admin/edit-post/${post._id}`} className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-600 hover:text-white rounded-lg transition" title="ویرایش خبر">
                                        <Edit className="h-4 w-4"/>
                                    </Link>
                                    
                                    {/* حذف (با Pop-up) */}
                                    <button onClick={() => confirmDelete(post._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition" title="حذف خبر">
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