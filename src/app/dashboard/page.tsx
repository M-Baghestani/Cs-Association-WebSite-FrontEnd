// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { 
    LayoutDashboard, User, MessageSquare, Ticket, 
    Loader2, Save, CheckCircle, Clock, XCircle, Mail, 
    LogOut, Send, Lock, MessageCircle, FileText, Edit2, X 
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 🚨 FIX 1: تابع کمکی برای ساخت آدرس مطلق بدون تکرار (Double Concatenation)
const getReceiptUrl = (path: string | null | undefined) => {
    if (!path) return '#'; 
    
    // اگر آدرس با 'http' شروع شده بود، یعنی قبلاً کامل شده و آن را مستقیماً برمی‌گردانیم
    if (path.startsWith('http')) {
        return path;
    }

    // اگر نسبی بود (مانند /uploads/...), آدرس پایه را اضافه می‌کنیم
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'events' | 'messages' | 'profile'>('events');
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  
  // 🚨 FIX 2: studentId به phoneNumber تغییر کرد
  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '', password: '' }); 
  
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/auth/login");
        return;
    }
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    setLoading(true);
    try {
        const headers = { Authorization: `Bearer ${token}` };
        
        const eventsRes = await axios.get(`${API_URL}/events/my-registrations`, { headers });
        setEvents(eventsRes.data.data);

        const msgRes = await axios.get(`${API_URL}/contact/my`, { headers });
        setTickets(msgRes.data.data);

        const userStr = localStorage.getItem("user");
        if (userStr) {
            const u = JSON.parse(userStr);
            setProfile(prev => ({ 
                ...prev, 
                name: u.name || '', 
                email: u.email || '', 
                phoneNumber: u.phoneNumber || '' // 🚨 FIX 3: studentId به phoneNumber تغییر کرد
            }));
        }

    } catch (error) {
        console.error(error);
        toast.error("خطا در بارگذاری اطلاعات داشبورد.");
    } finally {
        setLoading(false);
    }
  };

  // --- هندلرها ---
  const handleUserReply = async (ticketId: string, message: string) => {
      if (!message.trim()) return;
      try {
          const token = localStorage.getItem("token");
          await axios.post(`${API_URL}/contact/${ticketId}/reply`, { message }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          toast.success("پاسخ ارسال شد");
          fetchDashboardData(token!);
      } catch (error: any) { toast.error("خطا در ارسال پاسخ"); }
  };

  const handleCloseTicket = async (ticketId: string) => {
      if(!confirm("آیا می‌خواهید این گفتگو را ببندید؟")) return;
      try {
          const token = localStorage.getItem("token");
          await axios.put(`${API_URL}/contact/${ticketId}/close`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
          toast.success("گفتگو بسته شد.");
          fetchDashboardData(token!);
      } catch (error) { toast.error("خطا در بستن تیکت."); }
  };

  const startEditing = (msg: any) => { setEditingMessageId(msg._id); setEditContent(msg.content); };
  const cancelEditing = () => { setEditingMessageId(null); setEditContent(""); };

  const saveEditedMessage = async (ticketId: string, messageId: string) => {
      if (!editContent.trim()) return;
      try {
          const token = localStorage.getItem("token");
          await axios.put(`${API_URL}/contact/${ticketId}/messages/${messageId}`, 
            { newContent: editContent }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("پیام ویرایش شد.");
          setEditingMessageId(null);
          fetchDashboardData(token!);
      } catch (error) { toast.error("خطا در ویرایش."); }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
        const res = await axios.put(`${API_URL}/auth/profile`, profile, {
            headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("پروفایل با موفقیت بروزرسانی شد ✅");
        setProfile(prev => ({ ...prev, password: '' }));
        window.dispatchEvent(new Event("auth-change"));
    } catch (error: any) {
        toast.error(error.response?.data?.message || "خطا در بروزرسانی.");
    }
  };

  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;

  return (
    <div className="min-h-screen px-4 pt-28 pb-20 container mx-auto max-w-6xl flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR */}
        <aside className="lg:w-1/4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 sticky top-28 shadow-xl">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-white truncate">{profile.name}</h2>
                        <p className="text-xs text-gray-400 truncate">{profile.email}</p>
                    </div>
                </div>
                
                <nav className="space-y-2">
                    <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'events' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}><Ticket className="h-5 w-5" /> رویدادهای من</button>
                    <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}><MessageSquare className="h-5 w-5" /> پیام‌ها</button>
                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}><User className="h-5 w-5" /> ویرایش پروفایل</button>
                    <div className="pt-4 mt-4 border-t border-white/10"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"><LogOut className="h-5 w-5" /> خروج</button></div>
                </nav>
            </div>
        </aside>

        {/* CONTENT */}
        <main className="lg:w-3/4">
            
            {/* TAB 1: EVENTS */}
            {activeTab === 'events' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-4">رویدادهای ثبت‌نام شده</h2>
                    {events.length === 0 ? <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-gray-700 text-gray-500">در هیچ رویدادی ثبت‌نام نکرده‌اید. <br/><Link href="/events" className="text-blue-400 hover:underline mt-2 inline-block">مشاهده لیست رویدادها</Link></div> : 
                        <div className="grid md:grid-cols-2 gap-4">
                            {events.map((reg: any) => (
                                <div key={reg._id} className="bg-slate-900 border border-white/10 p-5 rounded-2xl hover:border-blue-500/50 transition group relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-1 h-full rounded-l-full ${reg.status === 'VERIFIED' ? 'bg-green-500' : reg.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'}`}/>
                                    <h3 className="font-bold text-white mb-2 text-lg">{reg.event?.title}</h3>
                                    <div className="text-sm text-gray-400 mb-4 space-y-2 bg-black/20 p-3 rounded-xl">
                                        <p>📅 تاریخ: {new Date(reg.event?.date).toLocaleDateString('fa-IR')}</p>
                                        <p>💰 مبلغ: {reg.pricePaid ? reg.pricePaid.toLocaleString('fa-IR') + ' تومان' : 'رایگان'}</p>
                                        {reg.trackingCode && <p className="font-mono text-xs text-gray-500">کد رهگیری: {reg.trackingCode}</p>}
                                        {reg.receiptImage && (<a href={getReceiptUrl(reg.receiptImage)} target="_blank" className="flex items-center gap-1 text-blue-400 hover:underline text-xs"><FileText className="h-3 w-3"/> مشاهده رسید ارسالی</a>)}
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${reg.status === 'VERIFIED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : reg.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{reg.status === 'VERIFIED' ? <><CheckCircle className="h-3 w-3"/> تأیید شده</> : reg.status === 'PENDING' ? <><Clock className="h-3 w-3"/> در انتظار بررسی</> : <><XCircle className="h-3 w-3"/> رد شده</>}</span>
                                        <Link href={`/events/${reg.event?.slug}`} className="text-blue-400 hover:text-white text-sm transition">مشاهده جزئیات &rarr;</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            )}

            {/* TAB 2: MESSAGES */}
            {activeTab === 'messages' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-bold text-white">پیام‌های من</h2>
                        <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition"><MessageCircle className="h-4 w-4"/> تیکت جدید</Link>
                    </div>
                    {tickets.length === 0 ? (
                        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-gray-700 text-gray-500">
                            هنوز پیامی ارسال نکرده‌اید.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {tickets.map((ticket: any) => (
                                <div key={ticket._id} className="bg-slate-900 border border-white/10 p-6 rounded-2xl">
                                    {/* هدر تیکت */}
                                    <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                                        <div>
                                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                                {ticket.status === 'CLOSED' ? <Lock className="h-4 w-4 text-red-500"/> : <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                                                {ticket.subject}
                                            </h4>
                                            <span className="text-xs text-gray-500">آخرین فعالیت: {new Date(ticket.updatedAt).toLocaleDateString('fa-IR')}</span>
                                        </div>
                                        {ticket.status === 'OPEN' && (
                                            <button onClick={() => handleCloseTicket(ticket._id)} className="text-xs text-red-400 border border-red-400/20 px-2 py-1 rounded hover:bg-red-400/10 transition">
                                                بستن گفتگو
                                            </button>
                                        )}
                                    </div>

                                    {/* چت */}
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-gray-700">
                                        {ticket.messages.map((msg: any, idx: number) => (
                                            <div key={idx} className={`flex ${msg.sender === 'USER' ? 'justify-start' : 'justify-end'}`}>
                                                
                                                {editingMessageId === msg._id ? (
                                                    <div className="w-full max-w-[80%] flex gap-2 items-end">
                                                        <textarea 
                                                            value={editContent} 
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            className="flex-1 bg-slate-800 border border-blue-500 rounded-xl p-2 text-sm text-white outline-none"
                                                            rows={2}
                                                        />
                                                        <div className="flex flex-col gap-1">
                                                            <button onClick={() => saveEditedMessage(ticket._id, msg._id)} className="bg-green-600 p-1.5 rounded-lg text-white hover:bg-green-500"><CheckCircle className="h-3 w-3"/></button>
                                                            <button onClick={cancelEditing} className="bg-red-600 p-1.5 rounded-lg text-white hover:bg-red-500"><X className="h-3 w-3"/></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={`group relative max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'USER' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-blue-600 text-white rounded-tl-none'}`}>
                                                        <p>{msg.content}</p>
                                                        <div className="flex justify-between items-center mt-1 opacity-50 text-[10px]">
                                                            {msg.sender === 'USER' && ticket.status === 'OPEN' && (
                                                                <button onClick={() => startEditing(msg)} className="mr-2 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="ویرایش">
                                                                    <Edit2 className="h-3 w-3"/>
                                                                </button>
                                                            )}
                                                            <span>{msg.sender === 'USER' ? 'شما' : 'پشتیبانی'} - {new Date(msg.createdAt).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* فرم پاسخ */}
                                    {ticket.status === 'OPEN' ? (
                                        <form 
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const input = (e.target as any).elements.replyInput;
                                                handleUserReply(ticket._id, input.value);
                                                input.value = '';
                                            }} 
                                            className="flex gap-2 mt-4 pt-4 border-t border-white/5"
                                        >
                                            <input 
                                                name="replyInput"
                                                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none transition"
                                                placeholder="پاسخ شما..."
                                            />
                                            <button type="submit" className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 transition">
                                                <Send className="h-5 w-5" />
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="text-center text-sm text-gray-500 bg-slate-950/50 p-2 rounded-lg border border-white/5">
                                            این گفتگو بسته شده است.
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: PROFILE */}
            {activeTab === 'profile' && (
                <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">ویرایش اطلاعات کاربری</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-6 bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">نام و نام خانوادگی</label>
                            <input name="name" autoComplete="name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-950 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"/>
                        </div>
                        
                        {/* 🚨 FIX 4: فیلد شماره تماس */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">شماره تماس</label>
                            <input 
                                name="phoneNumber" 
                                autoComplete="tel" 
                                value={profile.phoneNumber} 
                                onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})} 
                                className="w-full bg-slate-950 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">ایمیل (غیرقابل تغییر)</label>
                            <input name="email" value={profile.email} disabled className="w-full bg-slate-950/50 border border-gray-800 rounded-xl p-3 text-gray-500 cursor-not-allowed"/>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <label className="block text-sm font-medium text-gray-400 mb-2">تغییر رمز عبور (اختیاری)</label>
                            <input type="password" name="password" autoComplete="new-password" placeholder="فقط در صورت تمایل به تغییر وارد کنید" value={profile.password} onChange={(e) => setProfile({...profile, password: e.target.value})} className="w-full bg-slate-950 border border-gray-700 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"/>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20 mt-4">
                            <Save className="h-5 w-5" /> ذخیره تغییرات
                        </button>
                    </form>
                </div>
            )}
        </main>
    </div>
  );
}