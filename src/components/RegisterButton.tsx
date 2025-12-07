// "use client";

// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// interface RegistrationStatus {
//   status: 'VERIFIED' | 'PENDING' | 'FAILED' | 'PAID';
// }

// interface RegisterButtonProps {
//   eventId: string;
//   isFree: boolean;
//   price: number;
//   capacity: number;
//   registeredCount: number;
//   userRegistration: RegistrationStatus | null; 
//   onRegisterSuccess: () => void;
//   // 👇 FIX: افزودن این دو پراپ که از صفحه والد ارسال می‌شوند
//   handleRegister: () => void;
//   isLoading: boolean;
// }

// export default function RegisterButton({ 
//     eventId, 
//     isFree, 
//     price, 
//     capacity, 
//     registeredCount, 
//     userRegistration, 
//     onRegisterSuccess,
//     // دریافت توابع از پراپ‌ها
//     handleRegister,
//     isLoading
// }: RegisterButtonProps) {
  
//     const isFull = registeredCount >= capacity;

//     if (!localStorage.getItem('token')) {
//         return (
//             <button 
//                 onClick={() => toast.error('برای ثبت‌نام ابتدا وارد شوید.')}
//                 className="w-full rounded-xl bg-blue-600 py-3 text-lg font-bold text-white transition hover:bg-blue-700"
//             >
//                 برای ثبت‌نام، ابتدا وارد شوید
//             </button>
//         );
//     }
    
//     const registrationStatus = userRegistration?.status;

//     // نمایش وضعیت‌های ثبت‌نام
//     if (registrationStatus) {
//         switch (registrationStatus) {
//             case 'VERIFIED':
//             case 'PAID':
//                 return (
//                     <div className="w-full rounded-xl bg-green-700 py-3 text-lg font-bold text-white flex items-center justify-center gap-2">
//                         <CheckCircle className="h-6 w-6" /> ثبت‌نام شما تأیید شده است 
//                     </div>
//                 );
//             case 'PENDING':
//                 return (
//                     <div className="w-full rounded-xl bg-yellow-700 py-3 text-lg font-bold text-white flex items-center justify-center gap-2">
//                         <Clock className="h-6 w-6" /> در انتظار تأیید پرداخت 
//                     </div>
//                 );
//             case 'FAILED':
//                 return (
//                     <div className="w-full rounded-xl bg-red-700 py-3 text-lg font-bold text-white flex items-center justify-center gap-2">
//                         <XCircle className="h-6 w-6" /> پرداخت ناموفق. مجدداً ثبت‌نام کنید.
//                     </div>
//                 );
//         }
//     }

//     // دکمه غیرفعال (ظرفیت تکمیل)
//     if (isFull) {
//         return (
//             <button disabled className="w-full rounded-xl bg-gray-600 py-3 text-lg font-bold text-white cursor-not-allowed">
//                 ظرفیت تکمیل شد
//             </button>
//         );
//     }

//     // دکمه ثبت‌نام فعال
//     return (
//         <button 
//             onClick={handleRegister} // 👈 استفاده از تابع ارسال شده از والد
//             disabled={isLoading}
//             className="w-full rounded-xl bg-blue-600 py-3 text-lg font-bold text-white transition hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
//         >
//             {isLoading ? (
//                 <Loader2 className="animate-spin inline-block h-6 w-6" />
//             ) : (
//                 `ثبت‌نام در رویداد (${isFree ? 'رایگان' : price.toLocaleString('fa-IR') + ' تومان'})`
//             )}
//         </button>
//     );
// }

"use client";

import toast from 'react-hot-toast';
import { Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { RegistrationStatus } from '../types/event';


interface RegisterButtonProps {
  eventId: string; isFree: boolean; price: number; capacity: number; registeredCount: number;
  userRegistration: RegistrationStatus | null; 
  onRegisterSuccess: () => void;
  handleRegister: () => void;
  isLoading: boolean;
}

export default function RegisterButton({ 
    eventId, isFree, price, capacity, registeredCount, 
    userRegistration, handleRegister, isLoading
}: RegisterButtonProps) {
  
    const isFull = registeredCount >= capacity;
    
    // اگر کاربر هنوز لاگین نکرده
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
        return (
            <button onClick={() => toast.error('برای ثبت‌نام ابتدا وارد شوید.')} className="w-full rounded-xl bg-blue-600 py-3 text-lg font-bold text-white hover:bg-blue-700 transition">
                برای ثبت‌نام، ابتدا وارد شوید
            </button>
        );
    }
    
    const status = userRegistration?.status;

    // 🚨 نمایش وضعیت‌های مختلف (قفل شدن دکمه)
    if (status) {
        if (status === 'VERIFIED' || status === 'PAID') {
            return <div className="w-full rounded-xl bg-green-700 py-3 text-lg font-bold text-white flex items-center justify-center gap-2"><CheckCircle className="h-6 w-6"/> ثبت‌نام شما تأیید شده است ✅</div>;
        }
        if (status === 'PENDING') {
            return <div className="w-full rounded-xl bg-yellow-600/20 border border-yellow-500 text-yellow-400 py-3 text-lg font-bold flex items-center justify-center gap-2"><Clock className="h-6 w-6"/> مدارک ارسال شد. در انتظار تأیید 🕒</div>;
        }
        if (status === 'FAILED') {
            return <div className="w-full rounded-xl bg-red-700 py-3 text-lg font-bold text-white flex items-center justify-center gap-2"><XCircle className="h-6 w-6"/> پرداخت رد شد. مجدداً تلاش کنید.</div>;
        }
    }

    if (isFull) {
        return <button disabled className="w-full rounded-xl bg-gray-600 py-3 text-lg font-bold text-white cursor-not-allowed">ظرفیت تکمیل شد</button>;
    }

    return (
        <button 
            onClick={handleRegister} 
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 py-3 text-lg font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
            {isLoading ? <Loader2 className="animate-spin inline-block h-6 w-6" /> : `ثبت‌نام در رویداد (${isFree ? 'رایگان' : price.toLocaleString('fa-IR') + ' تومان'})`}
        </button>
    );
}