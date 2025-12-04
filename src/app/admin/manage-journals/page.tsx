"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, BookOpen, Trash2, Plus, FileText, Eye, AlertTriangle } from "lucide-react";
import { toShamsiDate } from "../../../utils/date"
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManageJournalsPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // States for Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchJournals = async () => {
    try {
      const res = await axios.get(`${API_URL}/journals`);
      if (res.data.success) setJournals(res.data.data);
    } catch (error) {
      toast.error("خطا در دریافت لیست.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJournals(); }, []);

  // باز کردن مودال
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // هندلر حذف نهایی
  const handleDelete = async () => {
    const id = deleteId;
    if (!id) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("نشریه حذف شد.");
      fetchJournals();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      toast.error("خطا در حذف.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-5xl">
      
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 gap-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-cyan-500"/>
            مدیریت نشریات
        </h1>
        <Link href="/admin/create-journal" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-600/20 font-bold">
            <Plus className="h-5 w-5"/> نشریه جدید
        </Link>
      </div>

      <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {journals.length === 0 ? (
            <div className="p-12 text-center text-gray-500">هیچ نشریه‌ای منتشر نشده است.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">جلد</th>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">عنوان</th>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">شماره</th>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">تاریخ انتشار</th>
                            <th className="px-6 py-4 text-right text-xs text-gray-400">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {journals.map((journal) => (
                            <tr key={journal._id} className="hover:bg-white/5 transition">
                                <td className="px-6 py-4 whitespace-nowrap w-24">
                                    <div className="h-16 w-12 rounded-lg overflow-hidden bg-slate-800 border border-white/10 relative shadow-md">
                                        <img src={journal.coverImage} alt={journal.title} className="w-full h-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-medium">{journal.title}</td>
                                <td className="px-6 py-4 text-cyan-400 font-bold">#{journal.editionNumber}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm">{toShamsiDate(journal.publishedAt)}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <a href={journal.pdfUrl} target="_blank" className="p-2 bg-green-500/10 text-green-400 hover:bg-green-600 hover:text-white rounded-lg transition" title="دانلود فایل">
                                        <FileText className="h-4 w-4"/>
                                    </a>
                                    <button onClick={() => confirmDelete(journal._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600/50 rounded-lg transition" title="حذف">
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
      
      {/* 🚨 MODAL: پنجره مودال حذف */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
                
                <div className="flex justify-center mb-4">
                    <div className="bg-red-500/20 p-3 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white text-center mb-2">حذف نشریه؟</h3>
                <p className="text-gray-400 text-center text-sm mb-6 leading-relaxed">
                    آیا از حذف این نشریه مطمئن هستید؟ این عملیات غیرقابل بازگشت است.
                </p>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white transition font-medium"
                    >
                        انصراف
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-bold flex items-center justify-center gap-2"
                    >
                        بله، حذف شود
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}