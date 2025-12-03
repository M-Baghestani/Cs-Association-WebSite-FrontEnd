"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Loader2, User, Clock, Send, Lock, CheckCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminMessagesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  
  // 1. دریافت پیام‌ها
  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr || JSON.parse(userStr).role !== "admin") {
      router.push("/");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/contact`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.data.success) setMessages(res.data.data);
    } catch (error) {
      toast.error("خطا در دریافت پیام‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 2. هندلر ارسال پاسخ (چت)
  const handleSendReply = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('replyInput') as HTMLInputElement;
    const message = input.value;

    if (!message || message.trim() === "") return;

    const token = localStorage.getItem("token");
    const toastId = toast.loading("در حال ارسال...");

    try {
        // 🚨 FIX: ارسال به صورت POST و با نام فیلد message
        await axios.post(`${API_URL}/contact/${id}/reply`, 
            { message }, 
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        toast.success("پاسخ ارسال شد", { id: toastId });
        input.value = ""; // پاک کردن فیلد
        fetchMessages(); // رفرش لیست برای دیدن پیام جدید

    } catch (error: any) {
        toast.error(error.response?.data?.message || "خطا در ارسال.", { id: toastId });
    }
  };

  // 3. هندلر بستن تیکت
  const handleCloseTicket = async (id: string) => {
      if(!confirm("آیا می‌خواهید این تیکت را ببندید؟")) return;
      try {
          const token = localStorage.getItem("token");
          await axios.put(`${API_URL}/contact/${id}/close`, {}, {
              headers: { "Authorization": `Bearer ${token}` }
          });
          toast.success("تیکت بسته شد");
          fetchMessages();
      } catch (error) {
          toast.error("خطا");
      }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500" /></div>;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-4">
        <Mail className="h-8 w-8 text-yellow-400"/> صندوق پیام‌ها 
        <span className="text-sm font-normal text-gray-500">({messages.length})</span>
      </h1>
      
      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500">
          صندوق پیام خالی است.
        </div>
      ) : (
        <div className="space-y-8">
          {messages.map((ticket) => (
            <div key={ticket._id} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              
              {/* هدر تیکت */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${ticket.user ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                        {ticket.name}
                        {ticket.status === 'CLOSED' && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">بسته شده</span>}
                    </h3>
                    <p className="text-xs text-gray-400">{ticket.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                    {ticket.status === 'OPEN' && (
                        <button onClick={() => handleCloseTicket(ticket._id)} className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition">
                            بستن تیکت
                        </button>
                    )}
                </div>
              </div>

              <h4 className="mb-4 font-bold text-yellow-400 text-lg">موضوع: {ticket.subject}</h4>
              
              {/* --- بخش چت (تاریخچه پیام‌ها) --- */}
              <div className="bg-slate-950 rounded-xl p-4 mb-4 max-h-80 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
                  {/* اگر پیام‌های جدید (آرایه) وجود داشت */}
                  {ticket.messages && ticket.messages.length > 0 ? (
                      ticket.messages.map((msg: any, idx: number) => (
                        <div key={idx} className={`flex ${msg.sender === 'ADMIN' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                                msg.sender === 'ADMIN' 
                                    ? 'bg-blue-900/50 text-white border border-blue-500/30 rounded-tr-none' 
                                    : 'bg-slate-800 text-gray-200 border border-white/5 rounded-tl-none'
                            }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                <span className="text-[10px] opacity-50 block mt-1">
                                    {msg.sender === 'ADMIN' ? 'شما (ادمین)' : 'کاربر'} - {new Date(msg.createdAt).toLocaleTimeString('fa-IR', {hour:'2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                      ))
                  ) : (
                      // پشتیبانی از پیام‌های قدیمی (قبل از آپدیت سیستم)
                      <>
                        <div className="flex justify-end"><div className="bg-slate-800 p-3 rounded-xl text-sm text-gray-200">{ticket.message}</div></div>
                        {ticket.reply && <div className="flex justify-start mt-2"><div className="bg-blue-900/50 p-3 rounded-xl text-sm text-white border border-blue-500/30">{ticket.reply}</div></div>}
                      </>
                  )}
              </div>

              {/* فرم ارسال پاسخ */}
              {ticket.status === 'OPEN' ? (
                  <form onSubmit={(e) => handleSendReply(e, ticket._id)} className="flex gap-2">
                      <input 
                        name="replyInput"
                        className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition text-sm"
                        placeholder="پاسخ خود را بنویسید..."
                      />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg flex items-center justify-center transition">
                          <Send className="h-5 w-5"/>
                      </button>
                  </form>
              ) : (
                  <div className="text-center text-sm text-gray-500 bg-white/5 p-2 rounded-lg flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4"/> این گفتگو بسته شده است.
                  </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}