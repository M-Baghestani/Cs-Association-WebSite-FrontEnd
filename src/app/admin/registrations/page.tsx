"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, CheckCircle, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getStatusClasses = (status: string) => {
    switch (status) {
        case 'VERIFIED': return 'text-green-400 bg-green-900/50 border-green-500';
        case 'PENDING': return 'text-yellow-400 bg-yellow-900/50 border-yellow-500';
        case 'FAILED': return 'text-red-400 bg-red-900/50 border-red-500';
        default: return 'text-gray-400 bg-gray-700/50 border-gray-500';
    }
};

const statusMap: { [key: string]: string } = {
    'PENDING': 'در انتظار تأیید',
    'VERIFIED': 'تأیید شده',
    'FAILED': 'رد شده',
    'PAID': 'پرداخت شده',
};

// 👇 FIX: تابع فقط آدرس ذخیره شده را برمی‌گرداند (چون کامل ذخیره شده است)
const getReceiptUrl = (path: string | null | undefined) => {
    if (!path) return '#'; 
    return path; // بازگرداندن لینک مطلق ذخیره شده در دیتابیس
}

// کامپوننت رندر یک ردیف جدول
const TableRow = ({ reg, handleStatusChange }: any) => (
    <tr key={reg._id} className="hover:bg-white/5 transition-colors">
        
        {/* رویداد */}
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="font-medium text-white">{reg.event?.title || "حذف شده"}</div>
            <div className="text-xs text-gray-500">مبلغ مورد نیاز: {reg.event?.price ? reg.event.price.toLocaleString('fa-IR') : 0} تومان</div>
        </td>
        
        {/* دانشجو */}
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="font-medium text-white">{reg.user?.name}</div>
            <div className="text-xs text-gray-500">{reg.user?.email}</div>
        </td>
        
        {/* مبلغ پرداختی و رسید (FIXED) */}
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="font-bold text-green-400">{reg.pricePaid.toLocaleString('fa-IR')}</div>
            <div className="text-xs text-gray-500">کد رهگیری: {reg.trackingCode || "ندارد"}</div>
            
            {/* 🚨 FIX 2: استفاده از تابع ساده‌شده */}
            {reg.receiptImage && (
                <a 
                    href={getReceiptUrl(reg.receiptImage)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:underline text-xs mt-1"
                >
                    <FileText className='h-4 w-4'/> مشاهده رسید
                </a>
            )}
        </td>

        {/* وضعیت */}
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusClasses(reg.status)}`}>
                {statusMap[reg.status]}
            </span>
        </td>

        {/* عملیات (تأیید و رد) */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {reg.status === 'PENDING' ? (
                <div className='flex gap-2'>
                    {/* دکمه ۱: تأیید */}
                    <button
                        onClick={() => handleStatusChange(reg._id, 'VERIFIED')}
                        className="p-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                        title='تأیید پرداخت'
                    >
                         <CheckCircle className='h-5 w-5'/>
                    </button>
                    {/* دکمه ۲: رد */}
                    <button
                        onClick={() => handleStatusChange(reg._id, 'FAILED')}
                        className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                        title='رد پرداخت'
                    >
                         <XCircle className='h-5 w-5'/>
                    </button>
                </div>
            ) : (
                // وضعیت نهایی تأیید شده یا رد شده
                <div className='text-gray-500'>{reg.status === 'VERIFIED' ? 'تأیید شده' : 'رد شده'}</div>
            )}
        </td>
    </tr>
);


export default function AdminRegistrationsPage() {
    const router = useRouter();
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("token");

    // 1. تابع اصلی فچ کردن داده‌ها
    const fetchRegistrations = useCallback(async () => {
        const token = getToken();
        const userStr = localStorage.getItem("user");
        
        if (!token || !userStr || JSON.parse(userStr).role !== "admin") {
            router.push("/");
            return;
        }

        try {
            const res = await axios.get(`${API_URL}/admin/registrations`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const json = res.data;

            if (json.success) {
                // مرتب‌سازی: ابتدا در انتظارها، سپس بقیه
                const sortedData = json.data.sort((a: any, b: any) => {
                    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
                    return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
                });

                setRegistrations(sortedData);
            }
        } catch (error) {
            toast.error("خطا در دریافت لیست ثبت‌نام‌ها");
        } finally {
            setLoading(false);
        }
    }, [router]);

    // 2. تابع به‌روزرسانی وضعیت (فراخوانی API)
    const handleStatusChange = async (registrationId: string, newStatus: string) => {
        const token = getToken();
        if (!token) {
            toast.error("ابتدا وارد شوید.");
            return;
        }

        try {
            // فراخوانی روت PUT برای تغییر وضعیت
            const res = await axios.put(`${API_URL}/admin/registrations/${registrationId}/status`, { status: newStatus }, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.status === 200) {
                toast.success(`وضعیت ثبت‌نام به‌روز شد: ${statusMap[newStatus]}`);
                fetchRegistrations(); // رفرش جدول
            } else {
                toast.error("خطا در به‌روزرسانی وضعیت.");
            }
        } catch (error) {
            toast.error("خطای شبکه در به‌روزرسانی.");
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;

    return (
        <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">پیگیری پرداخت‌ها و ثبت‌نام‌ها</h1>
            
            <div className="overflow-x-auto bg-slate-900 rounded-xl border border-white/10 shadow-lg">
                
                <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                    <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">رویداد</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">دانشجو</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">مبلغ و رسید</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">وضعیت</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">عملیات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {registrations.map((reg) => (
                        <TableRow key={reg._id} reg={reg} handleStatusChange={handleStatusChange} />
                    ))}
                </tbody>
                </table>
            </div>
            
            {registrations.length === 0 && !loading && (
                <div className="text-center mt-12 text-gray-500 p-8 border border-dashed border-gray-700 rounded-lg">
                    هیچ ثبت‌نامی برای نمایش وجود ندارد.
                </div>
            )}
        </div>
    );
}