"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Eye,
  Loader2,
  Edit,
  Ticket,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";
import { toShamsiDate } from "../../../utils/date";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // استیت‌های مودال حذف
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      if (res.data.success) setEvents(res.data.data);
    } catch (error) {
      toast.error("خطا در دریافت لیست رویدادها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // باز کردن مودال
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  // 🚨 FIX: عملیات حذف نهایی
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("رویداد حذف شد.");
      fetchEvents(); // رفرش لیست
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در حذف.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-6xl relative">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
        <Ticket className="h-8 w-8 text-indigo-500" /> مدیریت رویدادها
      </h1>

      <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden shadow-lg">
        {events.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            هیچ رویدادی وجود ندارد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-300">
                    تصویر
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-300">
                    عنوان
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 hidden sm:table-cell">
                    تاریخ
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-300 hidden sm:table-cell">
                    ثبت‌نام
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-300">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-white/5 transition duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap w-24">
                      <div className="h-12 w-20 rounded-lg overflow-hidden bg-slate-800 border border-white/10 relative">
                        <img
                          src={
                            event.thumbnail || "https://picsum.photos/200/100"
                          }
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {toShamsiDate(event.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden sm:table-cell">
                      {event.registeredCount} / {event.capacity}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        href={`/events/${event._id}`}
                        target="_blank"
                        className="p-2 text-blue-400 bg-blue-500/10 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/edit-event/${event._id}`}
                        className="p-2 text-yellow-400 bg-yellow-500/10 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>{" "}
                      {/* فراخوانی مودال - FIX: تغییر رنگ هاور برای consistency */}{" "}
                      <button
                        onClick={() => openDeleteModal(event._id)}
                        className="p-2 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-600/50"
                      >
                        <Trash2 className="h-4 w-4" />
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

            <h3 className="text-xl font-bold text-white text-center mb-2">
              حذف رویداد؟
            </h3>
            <p className="text-gray-400 text-center text-sm mb-6 leading-relaxed">
              با حذف این رویداد،{" "}
              <span className="text-red-400 font-bold">
                تمام ثبت‌نام‌ها و رسیدهای پرداخت
              </span>{" "}
              مربوط به آن نیز حذف خواهند شد. آیا مطمئن هستید؟
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
                onClick={() => handleDelete(deleteId!)} // 🚨 ارسال ID
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-bold flex items-center justify-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "بله، حذف شود"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
