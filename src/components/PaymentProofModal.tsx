// "use client";

// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import axios from 'axios';
// import { Loader2, X, FileText, DollarSign as MoneyIcon } from 'lucide-react';
// import ImageUploader from './ImageUploader'; 

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// interface PaymentProofModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     eventId: string;
//     eventPrice: number;
//     onRegistrationSuccess: () => void;
// }

// export default function PaymentProofModal({ isOpen, onClose, eventId, eventPrice, onRegistrationSuccess }: PaymentProofModalProps) {
//     if (!isOpen) return null;

//     const [loading, setLoading] = useState(false);
//     const [receiptUrl, setReceiptUrl] = useState('');
//     const [trackingCode, setTrackingCode] = useState('');

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         if (!receiptUrl || !trackingCode.trim()) {
//             toast.error("لطفاً کد رهگیری و تصویر رسید را وارد کنید.");
//             setLoading(false);
//             return;
//         }

//         const token = localStorage.getItem('token');
//         if (!token) {
//             toast.error('ابتدا وارد حساب کاربری شوید.');
//             setLoading(false);
//             return;
//         }

//         try {
//             const payload = {
//                 pricePaid: eventPrice,
//                 trackingCode: trackingCode.trim(),
//                 receiptImage: receiptUrl,
//             };

//             const res = await axios.post(`${API_URL}/events/${eventId}/register`, payload, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             // این بخش تنها در صورتی اجرا می‌شود که سرور 200/201 برگرداند
//             toast.success("رسید پرداخت شما با موفقیت ثبت شد. پس از تأیید ادمین، ثبت‌نام شما نهایی می‌شود.");
            
//             await onRegistrationSuccess(); // رفرش داده‌ها و به‌روزرسانی دکمه
//             onClose(); 

//         } catch (error: any) {
//             // اگر خطای 500 یا 400 بدهد، اینجا گزارش می‌شود.
//             toast.error(error.response?.data?.message || 'خطا در ثبت نهایی پرداخت.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
//             <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
                
//                 {/* Header */}
//                 <div className="p-5 border-b border-white/10 flex justify-between items-center">
//                     <h2 className="text-xl font-bold text-white flex items-center gap-3">
//                         <MoneyIcon className="h-6 w-6 text-green-400"/>
//                         ثبت نهایی پرداخت
//                     </h2>
//                     <button onClick={onClose} className="text-gray-400 hover:text-white"><X/></button>
//                 </div>
                
//                 {/* Content */}
//                 <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    
//                     <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-600/50 text-white text-sm">
//                         <p className="font-bold mb-2">مبلغ قابل پرداخت: {eventPrice.toLocaleString('fa-IR')} تومان</p>
//                         <p className="text-xs text-gray-300">
//                             لطفاً مبلغ را به شماره کارت انجمن (که در پنل ادمین اعلام شده) واریز کرده و رسید آن را آپلود کنید.
//                         </p>
//                     </div>

//                     {/* 1. آپلود رسید */}
//                     <ImageUploader 
//                         onUpload={setReceiptUrl} 
//                         label="تصویر رسید پرداخت (screenshot)"
//                         defaultImage={receiptUrl}
//                     />

//                     {/* 2. کد رهگیری */}
//                     <div>
//                         <label className="block text-sm text-gray-400 mb-2">کد رهگیری/ارجاع بانک</label>
//                         <div className="relative">
//                             <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-500"/>
//                             <input 
//                                 type="text" 
//                                 value={trackingCode}
//                                 onChange={(e) => setTrackingCode(e.target.value)}
//                                 required
//                                 placeholder="کد رهگیری تراکنش را وارد کنید"
//                                 className="w-full rounded-lg bg-white/5 py-3 pr-10 pl-4 text-white focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>

//                     {/* 3. دکمه نهایی */}
//                     <button
//                         type="submit"
//                         disabled={loading || !receiptUrl || !trackingCode.trim()}
//                         className="w-full rounded-lg bg-green-600 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
//                     >
//                         {loading ? (
//                             <Loader2 className="animate-spin inline-block h-6 w-6" />
//                         ) : (
//                             'ثبت و ارسال مدارک پرداخت'
//                         )}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader2, X, FileText, DollarSign as MoneyIcon } from 'lucide-react';
import ImageUploader from './ImageUploader'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface PaymentProofModalProps {
    isOpen: boolean; onClose: () => void; eventId: string; eventPrice: number; onRegistrationSuccess: () => void;
}

export default function PaymentProofModal({ isOpen, onClose, eventId, eventPrice, onRegistrationSuccess }: PaymentProofModalProps) {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [trackingCode, setTrackingCode] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!receiptUrl || !trackingCode.trim()) {
            toast.error("لطفاً کد رهگیری و تصویر رسید را وارد کنید.");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) { toast.error('لطفا وارد شوید.'); setLoading(false); return; }

        try {
            const payload = { pricePaid: eventPrice, trackingCode: trackingCode.trim(), receiptImage: receiptUrl };
            await axios.post(`${API_URL}/events/${eventId}/register`, payload, { headers: { Authorization: `Bearer ${token}` } });

            toast.success("رسید ثبت شد. منتظر تأیید باشید.");
            await onRegistrationSuccess(); // 🚨 رفرش صفحه اصلی
            onClose(); // بستن مودال

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'خطا در ثبت.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex gap-2"><MoneyIcon className="text-green-400"/> ثبت پرداخت</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-600/50 text-sm text-white">
                        مبلغ: <b>{eventPrice.toLocaleString('fa-IR')} تومان</b> <br/> لطفاً رسید و کد رهگیری را وارد کنید.
                    </div>
                    <ImageUploader onUpload={setReceiptUrl} label="تصویر رسید" defaultImage={receiptUrl} />
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">کد رهگیری</label>
                        <input type="text" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} required className="w-full rounded-lg bg-white/5 py-3 px-4 text-white" placeholder="شماره پیگیری..." />
                    </div>
                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin inline-block"/> : 'ارسال مدارک'}
                    </button>
                </form>
            </div>
        </div>
    );
}