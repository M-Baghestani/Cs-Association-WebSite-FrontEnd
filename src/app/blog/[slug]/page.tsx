"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { toShamsiDate } from "../../../utils/date";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface CommentType {
  _id: string;
  content: string;
  createdAt: string;
  user: { name: string; _id: string };
  adminReplyContent?: string;
  adminRepliedAt?: string;
}

interface PostType {
  _id: string;
  title: string;
  content: string;
  thumbnail?: string;
  author?: { name: string } | null;
  createdAt: string;
}

// ------------------------------------
// ۱. کامپوننت فرم ارسال نظر
// ------------------------------------
const CommentForm = ({
  postId,
  onCommentSubmitted,
}: {
  postId: string;
  onCommentSubmitted: () => void;
}) => {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!content.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/comments/${postId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        res.data.message || "نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود."
      );
      setContent("");
      onCommentSubmitted();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "خطا در ارسال نظر. لطفاً وارد شوید.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-800/50 p-6 rounded-xl text-center border border-slate-700 mb-8">
        <p className="text-gray-400 mb-4">
          برای ثبت نظر، لطفاً وارد حساب کاربری خود شوید.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          ورود به حساب
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-slate-800/30 p-6 rounded-xl border border-white/5 mb-8"
    >
      <h3 className="text-lg font-bold text-white mb-2">
        دیدگاه خود را بنویسید
      </h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
        placeholder="نظر شما درباره این مطلب چیست؟"
        className="w-full rounded-lg bg-slate-900/50 border border-slate-700 p-4 text-white placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          ارسال نظر
        </button>
      </div>
    </form>
  );
};

// ------------------------------------
// ۲. کامپوننت بخش نظرات
// ------------------------------------
const CommentsSection = ({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: CommentType[];
}) => {
  const [comments, setComments] = useState<CommentType[]>(initialComments);

  // اصلاح: همگام‌سازی state با props اولیه
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_URL}/comments/${postId}`);
      setComments(res.data.data);
    } catch (error) {
      console.error("Error fetching comments");
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-white/10">
      <h2 className="mb-8 text-2xl font-bold text-white flex items-center gap-3">
        <MessageSquare className="h-7 w-7 text-blue-500" />
        نظرات کاربران{" "}
        <span className="text-sm font-normal text-gray-500">
          ({comments.length})
        </span>
      </h2>

      {/* فرم ارسال */}
      <div className="mb-12">
        <CommentForm postId={postId} onCommentSubmitted={fetchComments} />
      </div>

      {/* لیست نظرات */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {comment.user?.name ? comment.user.name.charAt(0) : "U"}
              </div>
            </div>

            <div className="flex-grow space-y-2">
              <div className="bg-slate-800/50 rounded-2xl rounded-tl-none p-5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">
                    {comment.user?.name || "کاربر ناشناس"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {comment.content}
                </p>
              </div>

              {/* پاسخ ادمین */}
              {comment.adminReplyContent && (
                <div className="flex gap-4 mr-8 mt-2">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="bg-green-900/20 rounded-2xl rounded-tr-none p-4 border border-green-500/20 flex-grow">
                    <p className="text-xs font-bold text-green-400 mb-1">
                      پاسخ انجمن:
                    </p>
                    <p className="text-gray-300 text-sm">
                      {comment.adminReplyContent}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-gray-500 text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
          هنوز نظری برای این مطلب ثبت نشده است. اولین نفر باشید!
        </div>
      )}
    </div>
  );
};

// ------------------------------------
// ۳. صفحه اصلی جزئیات پست
// ------------------------------------
export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();

  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const safeSlug = slug ? decodeURIComponent(slug) : "";

  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchPostData = useCallback(async () => {
    if (!safeSlug) return;
    try {
      // 1. دریافت خبر
      const postRes = await axios.get(`${API_URL}/posts/slug/${safeSlug}`);
      const postData = postRes.data.data;
      setPost(postData);

      // 2. دریافت نظرات (با استفاده از ID پست)
      if (postData?._id) {
        const commentsRes = await axios.get(
          `${API_URL}/comments/${postData._id}`
        );
        setComments(commentsRes.data.data);
      }

      // چک کردن ادمین
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === "admin") setIsAdmin(true);
      }
    } catch (error) {
      toast.error("خبر پیدا نشد.");
      router.push("/blog");
    } finally {
      setLoading(false);
    }
  }, [safeSlug, router]);

  useEffect(() => {
    if (safeSlug) fetchPostData();
  }, [fetchPostData]);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // تابع حذف خبر
  const handleDeletePost = async () => {
    setShowDeleteModal(false); // Close the modal first

    const loadingToast = toast.loading("در حال حذف خبر...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/posts/${post?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.dismiss(loadingToast);
      toast.success("خبر با موفقیت حذف شد.");
      router.push("/blog");
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "خطا در حذف خبر.");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  if (!post) return null;

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-3xl text-white">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-gray-400 hover:text-white w-fit group"
        >
          <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
          بازگشت به اخبار
        </Link>

        {isAdmin && (
          <button
            type="button"
            onClick={openDeleteModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition"
          >
            <Trash2 className="h-4 w-4" /> حذف خبر
          </button>
        )}
      </div>
      <article className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        {/* 🚨 FIX: تغییر استایل عکس برای نمایش با سایز اصلی */}
        {post.thumbnail && (
          <div className="mb-8 w-full rounded-xl overflow-hidden bg-slate-800 shadow-2xl">
            <img
              src={post.thumbnail}
              alt={post.title}
              // استفاده از w-full برای عرض کامل و h-auto برای حفظ نسبت تصویر
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-6 mb-6">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />{" "}
            {toShamsiDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />{" "}
            {post.author?.name || "ادمین"}
          </span>
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-loose text-justify">
          {post.content}
        </div>
      </article>
      {/* بخش نظرات */}
      <CommentsSection postId={post._id} initialComments={comments} />+{" "}
      {/* 🚨 MODAL: پنجره مودال اختصاصی برای حذف پست */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/20 p-3 rounded-full">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              حذف این خبر؟
            </h3>
            <p className="text-gray-400 text-center text-sm mb-6 leading-relaxed">
              با حذف این خبر، تمام نظرات مرتبط با آن نیز حذف خواهند شد. آیا
              مطمئن هستید؟
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white transition font-medium"
              >
                انصراف
              </button>
              <button
                onClick={handleDeletePost} // 🚨 Call the final delete logic
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-bold flex items-center justify-center gap-2"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
