// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Link from "next/link";
// import { Calendar, User, ArrowRight, MessageSquare, Send, Loader2, FileText, CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import axios from "axios";

// // ------------------------------------
// // تعریف تایپ‌ها
// // ------------------------------------

// interface CommentType {
//     _id: string;
//     content: string;
//     createdAt: string;
//     user: { name: string, _id: string };
//     adminReplyContent: string;
//     adminRepliedAt?: string;
//     isApproved: boolean;
// }

// interface PostType {
//     _id: string;
//     title: string;
//     content: string;
//     thumbnail?: string;
//     // 🚨 FIX 1: مطمئن شو post.author می تواند یک آبجکت باشد
//     author: { name: string } | null; 
//     createdAt: string;
//     commentsCount: number;
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// // ------------------------------------
// // کامپوننت فرم ارسال نظر
// // ------------------------------------
// const CommentForm = ({ postId, onCommentSubmitted }: { postId: string, onCommentSubmitted: () => void }) => {
//     const [content, setContent] = useState('');
//     const [submitting, setSubmitting] = useState(false);
//     const isAuthenticated = !!localStorage.getItem('token');

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setSubmitting(true);
//         if (!content.trim()) return;

//         try {
//             const token = localStorage.getItem('token');
//             const res = await axios.post(`${API_URL}/comments/${postId}`, { content }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             toast.success(res.data.message || 'نظر شما ثبت شد و در انتظار تأیید است.');
//             setContent('');
//             onCommentSubmitted();
            
//         } catch (error: any) {
//              const message = error.response?.data?.message || "خطا: لطفا دوباره وارد شوید.";
//              toast.error(message);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (!isAuthenticated) {
//         return (
//             <div className="bg-blue-900/20 p-4 rounded-xl text-center text-gray-300 border border-blue-500/30">
//                 برای ارسال نظر، لطفاً <Link href="/auth/login" className="text-blue-400 font-bold hover:underline">وارد شوید</Link>.
//             </div>
//         );
//     }

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 rows={4}
//                 required
//                 placeholder="نظر خود را اینجا بنویسید..."
//                 className="w-full rounded-lg bg-white/5 p-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <button
//                 type="submit"
//                 disabled={submitting || !content.trim()}
//                 className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50"
//             >
//                 {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
//                 ارسال نظر
//             </button>
//         </form>
//     );
// };


// // ------------------------------------
// // کامپوننت نمایش دهنده کامنت‌ها
// // ------------------------------------
// const CommentsSection = ({ postId, initialComments }: { postId: string, initialComments: CommentType[] }) => {
//     const [comments, setComments] = useState(initialComments);

//     const fetchComments = async () => {
//         try {
//             const res = await axios.get(`${API_URL}/comments/${postId}`); 
//             setComments(res.data.data);
//         } catch (error) {
//             toast.error("خطا در بارگذاری نظرات.");
//         }
//     };

//     return (
//         <div className="mt-10 pt-8 border-t border-white/10">
//             <h2 className="mb-6 text-2xl font-bold text-white flex items-center gap-3">
//                 <MessageSquare className="h-6 w-6 text-blue-500" />
//                 نظرات ({comments.length})
//             </h2>
            
//             <CommentForm postId={postId} onCommentSubmitted={fetchComments} />

//             <div className="mt-8 space-y-6">
//                 {comments.map((comment) => (
//                     <div key={comment._id} className="rounded-xl border border-white/10 bg-slate-900/50 p-5">
                        
//                         {/* نظر کاربر */}
//                         <div className="flex items-center justify-between mb-3 text-sm text-gray-300">
//                             <div className="flex items-center gap-3">
//                                 <User className="h-5 w-5 text-purple-400" />
//                                 <span className="font-bold">{comment.user?.name || "کاربر انجمن"}</span>
//                             </div>
//                             <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</span>
//                         </div>
//                         <p className="text-gray-300 leading-relaxed pl-8">{comment.content}</p>
                        
//                         {/* پاسخ ادمین */}
//                         {comment.adminReplyContent && (
//                             <div className="mt-4 ml-6 p-4 rounded-lg border-l-4 border-green-500 bg-green-900/20 shadow-inner">
//                                 <div className="flex items-center gap-2 text-sm font-bold text-green-400 mb-2">
//                                     <CheckCircle className="h-4 w-4" /> پاسخ انجمن:
//                                 </div>
//                                 <p className="text-gray-200 text-sm">{comment.adminReplyContent}</p>
//                             </div>
//                         )}
                        
//                     </div>
//                 ))}
//             </div>
            
//             {comments.length === 0 && (
//                 <div className="text-gray-500 text-center py-6">اولین نظر را شما بنویسید!</div>
//             )}
//         </div>
//     );
// };


// // ------------------------------------
// // صفحه اصلی جزئیات پست (SinglePostPage)
// // ------------------------------------
// export default function SinglePostPage() {
//     const router = useRouter();
//     const params = useParams();
//     const postId = params.id as string;

//     const [post, setPost] = useState<PostType | null>(null);
//     const [comments, setComments] = useState<CommentType[]>([]);
//     const [loading, setLoading] = useState(true);

//     const fetchPostData = useCallback(async () => {
//         try {
//             // دریافت پست و کامنت‌ها به صورت موازی
//             const [postRes, commentsRes] = await Promise.all([
//                 axios.get(`${API_URL}/posts/${postId}`),
//                 axios.get(`${API_URL}/comments/${postId}`)
//             ]);

//             setPost(postRes.data.data);
//             setComments(commentsRes.data.data);

//         } catch (error) {
//             router.push("/blog"); // اگر پست یافت نشد، به لیست برگرد
//             toast.error("پست مورد نظر یافت نشد.");
//         } finally {
//             setLoading(false);
//         }
//     }, [postId, router]);

//     useEffect(() => {
//         if (postId) {
//             fetchPostData();
//         }
//     }, [postId, fetchPostData]);

//     if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;
//     if (!post) return null;

//     return (
//         <div className="min-h-screen px-4 pt-24 pb-20">
//             <div className="container mx-auto max-w-3xl">
                
//                 <Link href="/blog" className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition">
//                     <ArrowRight className="h-4 w-4" /> بازگشت به وبلاگ
//                 </Link>

//                 <article className="bg-slate-900/50 p-8 rounded-xl border border-white/10">
                    
//                     {/* تصویر اصلی */}
//                     {post.thumbnail && (
//                         <div className="mb-8 overflow-hidden rounded-xl border border-white/10">
//                              <img src={post.thumbnail} alt={post.title} className="w-full object-cover" loading="lazy" />
//                         </div>
//                     )}

//                     {/* تیتر و اطلاعات */}
//                     <h1 className="mb-6 text-4xl font-black leading-tight text-white md:text-5xl">
//                         {post.title}
//                     </h1>

//                     <div className="mb-8 flex items-center gap-6 border-b border-white/10 pb-4 text-sm text-gray-400">
//                         <div className="flex items-center gap-2">
//                             <Calendar className="h-4 w-4 text-blue-500" />
//                             <span>{new Date(post.createdAt).toLocaleDateString('fa-IR')}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <User className="h-4 w-4 text-blue-500" />
//                             {/* 🚨 FIX: افزودن ? برای دسترسی ایمن به name */}
//                             <span>نویسنده: {post.author?.name || "ادمین انجمن"}</span>
//                         </div>
//                     </div>

//                     {/* متن خبر */}
//                     <div className="prose prose-invert prose-lg max-w-none text-gray-300">
//                         <p className="whitespace-pre-wrap leading-loose">
//                             {post.content}
//                         </p>
//                     </div>
//                 </article>
                
//                 {/* بخش نظرات */}
//                 <CommentsSection postId={postId} initialComments={comments} />

//             </div>
//         </div>
//     );
// };

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Users, DollarSign, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import RegisterButton from '../../../components/RegisterButton'; 
import PaymentProofModal from '../../../components/PaymentProofModal'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RegistrationStatus {
  status: 'VERIFIED' | 'PENDING' | 'FAILED' | 'PAID';
  pricePaid: number;
  trackingCode?: string;
}

interface EventType {
  _id: string; title: string; slug: string; description: string; date: string;
  location: string; capacity: number; registeredCount: number; isFree: boolean;
  price: number; thumbnail?: string; creator: string;
  userRegistration?: RegistrationStatus | null; 
}

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // 1. فراخوانی اطلاعات (شامل وضعیت کاربر)
  const fetchEvent = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const res = await axios.get(`${API_URL}/events/slug/${slug}`, { headers });
        
        // تبدیل قیمت به عدد
        const data = res.data.data;
        data.price = Number(data.price) || 0;
        setEvent(data);

    } catch (error: any) {
        if (error.response?.status === 404) {
            toast.error("رویداد یافت نشد.");
            router.push('/events'); 
        } else {
            toast.error("خطا در دریافت اطلاعات.");
        }
    } finally {
        setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => { if (slug) fetchEvent(); }, [slug, fetchEvent]);

  // 2. هندلر کلیک روی دکمه ثبت نام
  const handleRegisterClick = async () => {
    if (!event) return;
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error('لطفاً ابتدا وارد حساب کاربری خود شوید.');
        return;
    }
    
    // اگر رایگان بود: ثبت نام مستقیم
    if (event.isFree) {
        setRegisterLoading(true);
        try {
            await axios.post(`${API_URL}/events/${event._id}/register`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("ثبت‌نام رایگان انجام شد.");
            fetchEvent(); // رفرش وضعیت دکمه
        } catch (error: any) {
            toast.error(error.response?.data?.message || "خطا در ثبت نام.");
        } finally {
            setRegisterLoading(false);
        }
    } else {
        // اگر پولی بود: باز کردن مودال
        setIsModalOpen(true);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin inline-block mr-2"/>در حال بارگذاری...</div>;
  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-5xl text-white">
      <Link href="/events" className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white w-fit"><ArrowRight className="h-4 w-4" /> بازگشت به رویدادها</Link>

      <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10 bg-slate-800">
        <img src={event.thumbnail || "https://picsum.photos/800/600"} alt={event.title} className="w-full h-full object-cover" />
      </div>
      
      <h1 className="text-4xl font-extrabold mb-4 border-b border-white/10 pb-4">{event.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 mb-8">
        <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-400"/> {formattedDate}</div>
        <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-400"/> {event.location}</div>
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-400"/> ظرفیت: {event.registeredCount} از {event.capacity} نفر</div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-400"/> {event.isFree ? "رایگان" : `قیمت: ${event.price.toLocaleString('fa-IR')} تومان`}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-3 mt-10">توضیحات</h2>
      <p className="leading-relaxed text-gray-300 whitespace-pre-wrap">{event.description}</p>
      
      <div className="mt-10 border-t border-white/10 pt-6">
        <div className="mb-4 flex justify-between text-sm text-gray-400"><span>وضعیت ظرفیت</span><span>{Math.round((event.registeredCount / event.capacity) * 100)}%</span></div>
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-800"><div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }} /></div>
        
        <RegisterButton 
          eventId={event._id} 
          isFree={event.isFree}
          price={event.price}
          capacity={event.capacity} 
          registeredCount={event.registeredCount} 
          // 👇 ارسال وضعیت دقیق کاربر به دکمه
          userRegistration={event.userRegistration || null}
          onRegisterSuccess={fetchEvent} 
          handleRegister={handleRegisterClick}
          isLoading={registerLoading}
        />
      </div>
      
      {/* مودال پرداخت */}
      <PaymentProofModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={event._id}
        eventPrice={event.price}
        onRegistrationSuccess={fetchEvent} // بعد از موفقیت مودال، صفحه رفرش می‌شود
      />
    </div>
  );
}