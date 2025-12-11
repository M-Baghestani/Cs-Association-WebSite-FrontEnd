// src/app/blog/BlogClientContent.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Calendar, User, ArrowLeft, Loader2, FileText } from "lucide-react";
import { toShamsiDate } from "../../utils/date"; // 🚨 FIX: ایمپورت توابع تاریخ

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface PostType {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  createdAt: string;
  author?: { name: string };
  summary?: string; 
}

export default function BlogClientContent() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts`);
        if (res.data.success) {
            setPosts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
      return (
        <div className="flex h-screen items-center justify-center text-white">
            <Loader2 className="animate-spin mr-2" /> در حال بارگذاری وبلاگ...
        </div>
      );
  }

  return (
    <div className="min-h-screen px-4 pt-15 pb-20 container mx-auto max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">وبلاگ و مقالات 📚</h1>
        <p className="text-gray-400">تازه‌ترین اطلاعیه‌ها و مقالات آموزشی انجمن</p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-700 rounded-2xl">
            <FileText className="h-16 w-16 text-gray-600 mb-4" />
            <p className="text-gray-500 text-lg">هیچ مقاله‌ای منتشر نشده است.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link 
                key={post._id} 
                href={`/blog/${post.slug}`} 
                className="group block rounded-2xl bg-slate-900 border border-white/10 overflow-hidden transition hover:border-blue-500/50 hover:shadow-xl"
            >
              
              <div className="h-52 w-full bg-slate-800 overflow-hidden relative">
                <img 
                  src={post.thumbnail || "https://picsum.photos/600/400"} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition">{post.title}</h3>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 border-b border-white/5 pb-4">
                   <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-blue-500"/> 
                        {toShamsiDate(post.createdAt)} {/* 🚨 FIX: شمسی‌سازی */}
                   </span>
                   <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-blue-500"/> 
                        {post.author?.name || "ادمین"}
                   </span>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-3 mb-4 leading-relaxed opacity-80">
                    {post.summary || post.content}
                </p>
                
                <div className="flex items-center text-blue-400 text-sm font-bold mt-auto">
                  ادامه مطلب <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}