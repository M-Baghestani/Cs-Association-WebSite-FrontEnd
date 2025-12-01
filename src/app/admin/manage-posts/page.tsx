"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Loader2, FileText, Plus, X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // استیت برای مدیریت مودال حذف
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // باز کردن مودال
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // بستن مودال
  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  // 2. تابع حذف نهایی
  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/posts/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("خبر با موفقیت حذف شد ✅");
      fetchPosts(); // رفرش لیست
      closeDeleteModal();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف خبر.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-5xl relative">
      
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-orange-500"/>
            مدیریت وبلاگ
        </h1>
        
        <Link href="/admin/create-post" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition font-bold shadow-lg shadow-blue-600/20">
            <Plus className="h-5 w-5"/> نوشته جدید
        </Link>
      </div>

      <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {posts.length === 0 ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                <FileText className="h-16 w-16 mb-4 opacity-20"/>
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
                    <tbody className="divide-y divide-gray-800">
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-white/5 transition duration-200 group">
                                
                                {/* تصویر کوچک */}
                                <td className="px-6 py-4 whitespace-nowrap w-24">
                                    <div className="h-14 w-24 rounded-lg overflow-hidden bg-slate-800 border border-white/10 relative shadow-md group-hover:border-blue-500/30 transition">
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
                                <td className="px-6 py-4 text-gray-500 text-xs font-mono">
                                    {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                                </td>

                                {/* دکمه‌ها */}
                                <td className="px-6 py-4 flex gap-2">
                                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition shadow-sm" title="مشاهده">
                                        <Eye className="h-4 w-4"/>
                                    </Link>
                                    
                                    <Link href={`/admin/edit-post/${post._id}`} className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-600 hover:text-white rounded-lg transition shadow-sm" title="ویرایش">
                                        <Edit className="h-4 w-4"/>
                                    </Link>
                                    
                                    {/* دکمه حذف (باز کردن مودال) */}
                                    <button 
                                        onClick={() => openDeleteModal(post._id)} 
                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition shadow-sm" 
                                        title="حذف"
                                    >
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

      {/* 🚨 MODAL: مودال حذف سفارشی */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
                
                <div className="flex justify-center mb-4">
                    <div className="bg-red-500/20 p-3 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white text-center mb-2">حذف خبر؟</h3>
                <p className="text-gray-400 text-center text-sm mb-6">
                    آیا مطمئن هستید که می‌خواهید این خبر را حذف کنید؟ این عملیات غیرقابل بازگشت است.
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={closeDeleteModal}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white transition font-medium"
                        disabled={isDeleting}
                    >
                        انصراف
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-bold flex items-center justify-center gap-2"
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : "بله، حذف شود"}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}