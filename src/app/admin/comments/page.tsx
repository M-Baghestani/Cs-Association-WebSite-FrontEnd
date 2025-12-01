"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare, CheckCircle, XCircle, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminCommentModerationPage() {
    const router = useRouter();
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({}); 
    const [activeTab, setActiveTab] = useState('pending'); 

    const fetchComments = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/"); return; }

        try {
            const res = await axios.get(`${API_URL}/admin/comments/all`, { 
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            const initialReplyMap: { [key: string]: string } = {};
            res.data.data.forEach((comment: any) => {
                if (comment.adminReplyContent) {
                    initialReplyMap[comment._id] = comment.adminReplyContent;
                }
            });
            setReplyText(initialReplyMap);
            setComments(res.data.data);
        } catch (error) {
            toast.error("خطا در دریافت نظرات.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const getToken = () => localStorage.getItem("token");

    const handleReplyAndApprove = async (commentId: string, isAlreadyApproved: boolean) => {
        const replyContent = (replyText as any)[commentId] || '';
        
        try {
            await axios.put(`${API_URL}/admin/comments/approve/${commentId}`, { replyContent }, {
                headers: { "Authorization": `Bearer ${getToken()}` }
            });

            const actionVerb = isAlreadyApproved ? 'ویرایش شد' : (replyContent.trim() ? 'پاسخ و تأیید شد' : 'تأیید شد');
            toast.success(`نظر با موفقیت ${actionVerb}.`);
            fetchComments(); 
        } catch (error: any) {
            toast.error(error.response?.data?.message || "خطا در عملیات.");
        }
    };
    
    const handleDelete = async (commentId: string) => {
        const deleteAction = async () => {
            try {
                await axios.delete(`${API_URL}/admin/comments/${commentId}`, {
                    headers: { "Authorization": `Bearer ${getToken()}` }
                });
                toast.success("نظر با موفقیت حذف شد.");
                fetchComments();
            } catch (error: any) {
                toast.error(error.response?.data?.message || "خطا در حذف نظر.");
            }
        };

        toast((t) => (
            <div className="flex flex-col gap-3 items-center bg-slate-800 p-4 rounded-lg shadow-2xl border border-red-600">
                <span className="font-bold text-sm text-white">آیا مطمئن هستید؟</span>
                <div className="flex justify-center gap-3 w-full">
                    <button onClick={() => { deleteAction(); toast.dismiss(t.id); }} className="flex-1 rounded bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-500 transition">بله، حذف کن</button>
                    <button onClick={() => toast.dismiss(t.id)} className="flex-1 rounded bg-gray-600 px-3 py-1.5 text-xs text-white hover:bg-gray-500 transition">انصراف</button>
                </div>
            </div>
        ), { duration: Infinity, style: { padding: '0px', background: 'transparent' } });
    };

    const pendingComments = comments.filter((c: any) => !c.isApproved);
    const approvedComments = comments.filter((c: any) => c.isApproved);
    const commentsToDisplay = activeTab === 'pending' ? pendingComments : approvedComments;

    if (loading) return <div className="flex h-screen items-center justify-center text-white"><Loader2 className="animate-spin h-10 w-10 text-blue-500"/></div>;

    return (
        <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                <MessageSquare className="h-7 w-7 text-yellow-400" />
                مدیریت نظرات
            </h1>
            
            <div className="flex mb-6 p-1 rounded-xl bg-slate-800 border border-white/10">
                <button onClick={() => setActiveTab('pending')} className={`flex-1 p-3 rounded-lg font-bold text-sm transition ${activeTab === 'pending' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}>در انتظار تأیید ({pendingComments.length})</button>
                <button onClick={() => setActiveTab('approved')} className={`flex-1 p-3 rounded-lg font-bold text-sm transition ${activeTab === 'approved' ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-slate-700'}`}>تأیید شده ({approvedComments.length})</button>
            </div>
            
            {commentsToDisplay.length === 0 ? (
                <div className="p-8 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">موردی وجود ندارد.</div>
            ) : (
                <div className="space-y-6">
                    {commentsToDisplay.map((comment: any) => (
                        <div key={comment._id} className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                                <div>
                                    {/* 🚨 FIX: استفاده از Optional Chaining (?.) برای جلوگیری از کرش */}
                                    <span className="text-sm font-bold text-white">{comment.user?.name || "کاربر حذف شده"}</span>
                                    <span className="text-xs text-gray-500 block">{comment.user?.email || "---"}</span>
                                </div>
                                <span className="text-xs text-purple-400">پست: {comment.post?.title || "پست حذف شده"}</span>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-4 pl-4 border-l-2 border-white/10">{comment.content}</p>
                            
                            {comment.adminReplyContent && activeTab === 'approved' && (
                                <div className="mt-4 p-3 rounded-lg bg-green-900/30 border border-green-500/50 text-sm text-gray-200">پاسخ قبلی: {comment.adminReplyContent}</div>
                            )}

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h3 className="text-sm font-bold text-gray-400 mb-2">پاسخ شما (اختیاری)</h3>
                                <textarea
                                    value={(replyText as any)[comment._id] || ''}
                                    onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                                    rows={2}
                                    placeholder="متن پاسخ..."
                                    className="w-full rounded-lg bg-gray-800/80 p-3 text-white focus:ring-blue-500 text-sm"
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button onClick={() => handleDelete(comment._id)} className="flex items-center gap-1 rounded-lg bg-red-600/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-600 hover:text-white transition"><Trash2 className="h-4 w-4"/> حذف</button>
                                    <button onClick={() => handleReplyAndApprove(comment._id, activeTab === 'approved')} className="flex items-center gap-1 rounded-lg bg-green-600/90 px-3 py-1.5 text-xs text-white hover:bg-green-700 transition"><CheckCircle className="h-4 w-4"/> {activeTab === 'approved' ? 'ویرایش پاسخ' : 'تأیید'}</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}