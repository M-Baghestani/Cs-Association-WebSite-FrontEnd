"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader2, X, Smartphone, Send, DollarSign as MoneyIcon, CreditCard, Copy } from 'lucide-react';
import ImageUploader from './ImageUploader'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface PaymentProofModalProps {
    isOpen: boolean; onClose: () => void; eventId: string; eventPrice: number; onRegistrationSuccess: () => void;
}

export default function PaymentProofModal({ isOpen, onClose, eventId, eventPrice, onRegistrationSuccess }: PaymentProofModalProps) {
    if (!isOpen) return null;

    const [loading, setLoading] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [mobile, setMobile] = useState('');
    const [telegram, setTelegram] = useState('');

    const cardNumber = "6219861847387114";
    const cardOwner = "ملیکا باقری";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cardNumber);
        toast.success("شماره کارت کپی شد!");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!receiptUrl || !mobile.trim()) {
            toast.error("لطفاً تصویر رسید و شماره تماس را وارد کنید.");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) { toast.error('لطفا وارد شوید.'); setLoading(false); return; }

        try {
            const payload = {
                pricePaid: eventPrice,
                receiptImage: receiptUrl,
                mobile: mobile,
                telegram: telegram 
            };

            await axios.post(`${API_URL}/events/${eventId}/register`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("اطلاعات پرداخت ثبت شد. منتظر تأیید ادمین باشید.");
            await onRegistrationSuccess(); 
            onClose(); 

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'خطا در ثبت اطلاعات.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                
                <div className="p-5 border-b border-white/10 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <MoneyIcon className="h-6 w-6 text-green-400"/>
                        ثبت پرداخت و نهایی‌سازی
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    
                    {/* اطلاعات پرداخت */}
                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-600/50 text-white text-sm space-y-3">
                        <div className="flex justify-between items-center border-b border-blue-500/30 pb-2">
                            <span>مبلغ قابل پرداخت:</span>
                            <b className="text-lg text-blue-300">{eventPrice.toLocaleString('fa-IR')} تومان</b>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-gray-400 text-xs">لطفاً مبلغ را به شماره کارت زیر واریز نمایید:</p>
                            <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-yellow-500 w-5 h-5"/>
                                    <div className="flex flex-col">
                                        <span className="font-mono text-lg tracking-wider">{cardNumber}</span>
                                        <span className="text-xs text-gray-400">{cardOwner}</span>
                                    </div>
                                </div>
                                <button type="button" onClick={copyToClipboard} className="text-blue-400 hover:text-white p-2">
                                    <Copy className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* آپلود رسید */}
                    <ImageUploader onUpload={setReceiptUrl} label="تصویر رسید پرداخت" defaultImage={receiptUrl} />

                    {/* ورودی شماره تماس */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">شماره تماس <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Smartphone className="absolute right-3 top-3 h-5 w-5 text-gray-500"/>
                            <input 
                                type="tel" 
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                                className="w-full rounded-lg bg-white/5 py-3 pr-10 pl-4 text-white focus:ring-blue-500 outline-none placeholder:text-gray-600"
                                placeholder="مثال: 09123456789"
                            />
                        </div>
                    </div>

                    {/* ورودی تلگرام */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">آیدی تلگرام (اختیاری)</label>
                        <div className="relative">
                            <Send className="absolute right-3 top-3 h-5 w-5 text-gray-500"/>
                            <input 
                                type="text" 
                                value={telegram}
                                onChange={(e) => setTelegram(e.target.value)}
                                className="w-full rounded-lg bg-white/5 py-3 pr-10 pl-4 text-white focus:ring-blue-500 outline-none ltr-text text-left placeholder:text-gray-600"
                                placeholder="@username"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-green-600 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-50 transition shadow-lg shadow-green-900/20">
                        {loading ? <Loader2 className="animate-spin inline-block"/> : 'ثبت اطلاعات و ارسال رسید'}
                    </button>
                </form>
            </div>
        </div>
    );
}