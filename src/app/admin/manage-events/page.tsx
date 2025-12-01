"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Loader2, Ticket, Plus, AlertTriangle, Users, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManageEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // استیت‌های مودال حذف
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. دریافت لیست رویدادها
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      if (res.data.success) {
          setEvents(res.data.data);
      }
    } catch (error) {
      toast.error("خطا در دریافت لیست رویدادها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // 2. مدیریت مودال حذف
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  // 3. عملیات حذف نهایی
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/events/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("رویداد با موفقیت حذف شد ✅");
      fetchEvents(); // رفرش لیست
      closeDeleteModal();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف رویداد.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-6xl relative">
      
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/10 pb-4 gap-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Ticket className="h-8 w-8 text-indigo-500"/>
            مدیریت رویدادها
            <span className="text-sm font-normal text-gray-500 mt-1">({events.length})</span>
        </h1>
        
        <Link href="/admin/create-event" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-600/20 font-bold">
            <Plus className="h-5 w-5"/> رویداد جدید
        </Link>
      </div>

      {/* جدول رویدادها */}
      <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-xl">
        {events.length === 0 ? (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center">
                <Ticket className="h-16 w-16 mb-4 opacity-20"/>
                <p>هیچ رویدادی تعریف نشده است.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-slate-950/50">
                        <tr>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">تصویر</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">عنوان</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">زمان برگزاری</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">وضعیت ثبت‌نام</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {events.map((event) => (
                            <tr key={event._id} className="hover:bg-white/5 transition duration-200 group">
                                
                                {/* تصویر کوچک */}
                                <td className="px-6 py-4 whitespace-nowrap w-24">
                                    <div className="h-14 w-24 rounded-lg overflow-hidden bg-slate-800 border border-white/10 relative shadow-md group-hover:border-blue-500/30 transition">
                                        <img 
                                            src={event.thumbnail || "https://picsum.photos/200/100"} 
                                            alt={event.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                </td>

                                {/* عنوان */}
                                <td className="px-6 py-4 text-white font-medium max-w-xs truncate" title={event.title}>
                                    {event.title}
                                </td>

                                {/* تاریخ */}
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-blue-400"/>
                                        {new Date(event.date).toLocaleDateString('fa-IR')}
                                    </div>
                                </td>

                                {/* وضعیت ثبت‌نام */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 text-sm text-gray-300">
                                            <Users className="h-3 w-3 text-gray-500"/>
                                            <span>{event.registeredCount} / {event.capacity}</span>
                                        </div>
                                        {/* نوار پیشرفت کوچک */}
                                        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${event.registeredCount >= event.capacity ? 'bg-red-500' : 'bg-green-500'}`} 
                                                style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                {/* دکمه‌ها */}
                                <td className="px-6 py-4 flex gap-2">
                                    {/* مشاهده */}
                                    <Link href={`/events/${event.slug}`} target="_blank" className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition shadow-sm" title="مشاهده در سایت">
                                        <Eye className="h-4 w-4"/>
                                    </Link>
                                    
                                    {/* ویرایش */}
                                    <Link href={`/admin/edit-event/${event._id}`} className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-600 hover:text-white rounded-lg transition shadow-sm" title="ویرایش رویداد">
                                        <Edit className="h-4 w-4"/>
                                    </Link>
                                    
                                    {/* حذف (باز کردن مودال) */}
                                    <button 
                                        onClick={() => openDeleteModal(event._id)} 
                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition shadow-sm" 
                                        title="حذف رویداد"
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

      {/* 🚨 MODAL: پنجره مودال اختصاصی برای حذف */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
                
                <div className="flex justify-center mb-4">
                    <div className="bg-red-500/20 p-3 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white text-center mb-2">حذف رویداد؟</h3>
                <p className="text-gray-400 text-center text-sm mb-6 leading-relaxed">
                    آیا مطمئن هستید؟ با حذف این رویداد، <span className="text-red-400 font-bold">تمام ثبت‌نام‌ها و رسیدهای پرداخت</span> مربوط به آن نیز حذف خواهند شد و قابل برگشت نیستند.
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