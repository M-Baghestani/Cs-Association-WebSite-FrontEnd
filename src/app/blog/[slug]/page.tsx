// src/app/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { Calendar, User, ArrowRight, Trash2, MessageSquare } from 'lucide-react';
// 🚨 FIX: فرض بر وجود توابع utility
import { toShamsiDate } from "../../../utils/date"; 

// 🚨 FIX: فرض بر وجود تابع fetchPostBySlug
// شما باید این تابع را در src/utils/fetchPostBySlug.ts پیاده‌سازی کنید که از API بک‌اند دیتا را می‌خواند.
const fetchPostBySlug = async (slug: string) => {
    // ⚠️ Placeholder: باید با فراخوانی واقعی API جایگزین شود
    // مثال: const res = await fetch(`https://cs-khu.ir/api/posts/slug/${slug}`);
    // و دیتا را برگرداند.
    return { 
        _id: '123', 
        title: 'یک پست تستی برای سئو', 
        content: 'این محتوای اصلی پست است...', 
        summary: 'چکیده‌ای کوتاه از مقاله برای توضیحات سئو...',
        thumbnail: 'https://cs-khu.ir/image.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorName: 'ادمین انجمن',
        tags: ['تکنولوژی', 'سئو', 'نمونه'],
        // ...
    }; 
};

const BASE_URL = 'https://cs-khu.ir';


// 🚨 FIX: ایجاد متادیتای دینامیک بر اساس محتوای پست
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return { title: 'پست یافت نشد' };
  }

  const description = post.summary || post.content.substring(0, 160) + '...';
  const postUrl = `${BASE_URL}/blog/${params.slug}`;

  // Schema Markup از نوع Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": post.thumbnail,
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.authorName
    },
    "publisher": {
        "@type": "Organization",
        "name": "انجمن علمی علوم کامپیوتر دانشگاه خوارزمی",
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/icon.png`
        }
    },
    "description": description,
  };

  return {
    title: post.title,
    description: description,
    keywords: post.tags?.join(', ') || 'مقاله علمی, وبلاگ تخصصی, علوم کامپیوتر',
    
    openGraph: {
        title: post.title,
        description: description,
        url: postUrl,
        type: 'article',
        images: [{ url: post.thumbnail }],
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: [post.authorName],
    },
    alternates: {
        types: {
            'application/ld+json': articleSchema as any,
        },
    },
  };
}


// ------------------------------------
// صفحه اصلی جزئیات پست (بخش Client)
// ------------------------------------
// ⚠️ توجه: این کامپوننت نیاز به تبدیل شدن به یک Client Component دارد تا useState/useEffect کار کنند.
// اما چون generateMetadata باید در Server Component اجرا شود، منطق اصلی را در یک فایل جداگانه می‌گذاریم.
// برای سادگی، شما باید این فایل را به یک Server Component تبدیل کرده و منطق نظرات را در کامپوننت‌های فرعی Client قرار دهید.
// این کد، قسمت نمایشی نهایی را نشان می‌دهد.

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPostBySlug(params.slug); // ⚠️ فرض بر وجود تابع

  if (!post) notFound();

  // ⚠️ فرض بر وجود کامپوننت نظرات (CommentsSection) در یک Client Component مجزا
  const CommentsSection = ({ postId }: { postId: string }) => (
    <div className='text-gray-400 mt-10'>بخش نظرات (Client Component)</div>
  );

  return (
    <div className="min-h-screen px-4 pt-24 pb-20 container mx-auto max-w-3xl text-white">
        <div className="flex items-center justify-between mb-8">
            <Link href="/blog" className="flex items-center gap-2 text-gray-400 hover:text-white w-fit group">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> بازگشت به اخبار
            </Link>
            
            {/* ⚠️ دکمه حذف باید به یک Client Component منتقل شود تا بتواند toast و router را مدیریت کند */}
            <div className='text-xs text-gray-500'>منطق حذف پست باید در یک Client Component مجزا قرار گیرد.</div>
            
        </div>

        <article className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            
            {post.thumbnail && (
                <div className="mb-8 w-full rounded-xl overflow-hidden bg-slate-800 shadow-2xl">
                    <img 
                        src={post.thumbnail} 
                        alt={post.title} 
                        className="w-full h-auto object-contain"
                        loading="lazy"
                    />
                </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{post.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-6 mb-6">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500"/> {toShamsiDate(post.createdAt)}</span> {/* 🚨 FIX: شمسی‌سازی */}
                <span className="flex items-center gap-2"><User className="h-4 w-4 text-blue-500"/> {post.authorName || "ادمین"}</span>
                {/* 🚨 FIX: شمارش نظرات */}
                <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-yellow-500"/> {0} نظر</span>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap leading-loose text-justify">
                {post.content}
            </div>
        </article>
        
        {/* بخش نظرات */}
        <CommentsSection postId={post._id} /> 
    </div>
  );
}