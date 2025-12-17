"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Image as ImageIcon, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Loader2 } from "lucide-react";

// آدرس API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await axios.get(`${API_URL}/galleries`);
        if (res.data.success) {
          setGalleries(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching galleries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-20 px-4 md:px-8">
      {/* هدر صفحه */}
      <div className="max-w-7xl mx-auto mb-16 text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
        >
          گزارش‌های تصویری
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-lg max-w-2xl mx-auto"
        >
          مروری بر خاطرات، رویدادها و فعالیت‌های انجمن علمی علوم کامپیوتر
        </motion.p>
      </div>

      {/* لیست کارت‌ها */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleries.map((gallery, index) => (
          <GalleryCard key={gallery._id} gallery={gallery} index={index} />
        ))}
      </div>

      {galleries.length === 0 && !loading && (
        <div className="text-center text-zinc-500 py-20">
          <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p>هنوز هیچ گالری تصویری ثبت نشده است.</p>
        </div>
      )}
    </div>
  );
}

function GalleryCard({ gallery, index }: { gallery: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/gallery/${gallery._id}`} className="group block relative h-full">
        <div className="relative h-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-500 group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
          
          {/* تصویر کاور */}
          <div className="relative h-64 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10 opacity-80" />
            <Image
              src={gallery.coverImage}
              alt={gallery.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* تعداد عکس‌ها - بج (Badge) */}
            <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
              <ImageIcon className="h-3 w-3 text-blue-400" />
              <span>{gallery.images?.length || 0} تصویر</span>
            </div>
          </div>

          {/* محتوای متنی */}
          <div className="p-6 relative z-20 -mt-10">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
              {gallery.title}
            </h3>
            
            <p className="text-zinc-400 text-sm mb-4 line-clamp-2 h-10">
              {gallery.description || "بدون توضیحات..."}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500 flex items-center gap-1.5 dir-ltr">
                {new Date(gallery.createdAt).toLocaleDateString('fa-IR')}
                <Calendar className="h-3 w-3" />
              </span>
              
              <span className="text-sm font-bold text-blue-500 flex items-center gap-1 group-hover:translate-x-[-5px] transition-transform">
                مشاهده آلبوم <ArrowLeft className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}