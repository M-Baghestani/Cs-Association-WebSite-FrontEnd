// src/app/admin/registrations/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Check, X, Search } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Registration {
  _id: string;
  user: {
    name: string;
    studentId: string;
  };
  event: {
    title: string;
  };
  status: string;
  mobile: string;
  telegram?: string;
  questions?: string[];
  createdAt: string;
  receiptImage?: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/registrations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(res.data.data);
    } catch (error) {
      toast.error("خطا در دریافت لیست ثبت‌نام‌ها");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ اضافه شدن تابع تغییر وضعیت
  const handleStatusChange = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    // Optimistic Update: ابتدا در ظاهر تغییر می‌دهیم
    setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));

    try {
      await axios.put(
        `${API_URL}/admin/registrations/${id}/verify`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(newStatus === "APPROVED" ? "تایید شد ✅" : "رد شد ❌");
    } catch (error) {
        // Revert if failed
        fetchRegistrations();
        toast.error("خطا در تغییر وضعیت");
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">مدیریت ثبت‌نام‌ها</h2>
        <button onClick={fetchRegistrations} className="text-sm text-blue-400 hover:text-blue-300">
            بروزرسانی لیست ↻
        </button>
      </div>

      <div className="overflow-x-auto pb-20"> {/* pb-20 برای اسکرول بهتر */}
        <table className="w-full text-right text-gray-300 border-collapse">
          <thead className="bg-slate-800 text-gray-400 uppercase text-sm">
            <tr>
              <th className="p-4 rounded-tr-xl">دانشجو</th>
              <th className="p-4">رویداد</th>
              <th className="p-4">تماس</th>
              <th className="p-4">رسید</th>
              <th className="p-4">سوالات</th>
              <th className="p-4">وضعیت</th>
              <th className="p-4 text-center rounded-tl-xl">عملیات</th> {/* ✅ ستون عملیات */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {registrations.map((reg) => (
              <tr key={reg._id} className="hover:bg-slate-800/50 transition">
                <td className="p-4">
                  <div className="font-bold text-white">{reg.user?.name}</div>
                  <div className="text-xs text-gray-500">{reg.user?.studentId}</div>
                </td>
                <td className="p-4 text-blue-300">{reg.event?.title}</td>
                <td className="p-4">
                    <div className="text-xs text-gray-400">{reg.mobile}</div>
                    {reg.telegram && <div className="text-xs text-blue-400 dir-ltr">{reg.telegram}</div>}
                </td>
                <td className="p-4">
                    {reg.receiptImage ? (
                        <a href={reg.receiptImage} target="_blank" rel="noreferrer" className="text-blue-400 text-xs underline">
                            مشاهده تصویر
                        </a>
                    ) : <span className="text-gray-600 text-xs">ندارد</span>}
                </td>
                
                <td className="p-4 max-w-xs">
                  {reg.questions && reg.questions.length > 0 ? (
                    <div className="space-y-1">
                      {reg.questions.map((q, i) => (
                        <div key={i} className="text-[10px] bg-slate-700 p-1 rounded text-white border border-slate-600">
                           ❓ {q}
                        </div>
                      ))}
                    </div>
                  ) : "-"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      reg.status === "APPROVED"
                        ? "bg-green-500/20 text-green-400"
                        : reg.status === "REJECTED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {reg.status === "APPROVED"
                      ? "تایید شده"
                      : reg.status === "REJECTED"
                      ? "رد شده"
                      : "در انتظار"}
                  </span>
                </td>

                {/* ✅ دکمه‌های عملیات */}
                <td className="p-4">
                    <div className="flex justify-center gap-2">
                        {reg.status === 'PENDING' ? (
                            <>
                                <button 
                                    onClick={() => handleStatusChange(reg._id, 'APPROVED')}
                                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition"
                                    title="تایید"
                                >
                                    <Check size={18} />
                                </button>
                                <button 
                                    onClick={() => handleStatusChange(reg._id, 'REJECTED')}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                                    title="رد کردن"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <span className="text-gray-600 text-xs">تعیین شده</span>
                        )}
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}