// src/app/admin/registrations/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";

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
  questions?: string[]; // ✅ اضافه شده
  createdAt: string;
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
      <h2 className="text-2xl font-bold text-white mb-6">مدیریت ثبت‌نام‌ها</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-gray-300">
          <thead className="bg-slate-800 text-gray-400 uppercase text-sm">
            <tr>
              <th className="p-4 rounded-tr-xl">دانشجو</th>
              <th className="p-4">رویداد</th>
              <th className="p-4">تماس</th>
              <th className="p-4">تلگرام</th>
              <th className="p-4">وضعیت</th>
              <th className="p-4">سوالات</th> {/* ✅ ستون جدید */}
              <th className="p-4 rounded-tl-xl">تاریخ</th>
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
                <td className="p-4 font-mono dir-ltr text-right">{reg.mobile}</td>
                <td className="p-4 text-blue-400">{reg.telegram || "-"}</td>
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
                
                {/* ✅ نمایش سوالات */}
                <td className="p-4 max-w-xs">
                  {reg.questions && reg.questions.length > 0 ? (
                    <div className="space-y-1">
                      {reg.questions.map((q, i) => (
                        <div key={i} className="text-xs bg-slate-700 p-1.5 rounded text-white border border-slate-600">
                           ❓ {q}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-600 text-sm">-</span>
                  )}
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {new Date(reg.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {registrations.length === 0 && (
        <div className="text-center text-gray-500 py-10">هیچ ثبت‌نامی یافت نشد.</div>
      )}
    </div>
  );
}