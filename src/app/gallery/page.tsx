"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Image as ImageIcon, ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
// ✅ ایمپورت پس‌زمینه متحرک
import NeuralBackground from "../../components/NeuralBackground";

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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-zinc-950 text-white">
      {/* ✅ اضافه شدن پس‌زمینه گرافیکی */}
      <NeuralBackground />
      
      <div className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* هدر صفحه */}
        <div className="text-center space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-2"
          >
            <ImageIcon className="h-8 w-8 text-blue-400" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-lg"
          >
            گزارش‌های تصویری
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            مروری بر خاطرات، رویدادها و فعالیت‌های انجمن علمی علوم کامپیوتر
          </motion.p>
        </div>

        {/* لیست کارت‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery, index) => (
            <GalleryCard key={gallery._id} gallery={gallery} index={index} />
          ))}
        </div>

        {/* نمایش پیام در صورت خالی بودن */}
        {galleries.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-white/5">
            <ImageIcon className="h-20 w-20 text-zinc-700 mb-6" />
            <p className="text-zinc-400 text-lg font-medium">هنوز هیچ آلبومی ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryCard({ gallery, index }: { gallery: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/gallery/${gallery._id}`} className="group block h-full">
        {/* ✅ استایل شیشه‌ای کارت‌ها */}
        <div className="relative h-full overflow-hidden rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-white/10 transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
          
          {/* بخش تصویر */}
          <div className="relative h-64 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
            
            <Image
              src={gallery.coverImage}
              alt={gallery.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* تعداد عکس‌ها */}
            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
              <ImageIcon className="h-3.5 w-3.5 text-cyan-400" />
              <span>{gallery.images?.length || 0} تصویر</span>
            </div>
          </div>

          {/* محتوا */}
          <div className="p-6 relative z-20 -mt-6">
            <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
                {gallery.title}
                </h3>
                
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2 h-10 leading-relaxed">
                {gallery.description || "بدون توضیحات..."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(gallery.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                    
                    <span className="text-sm font-bold text-cyan-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                        مشاهده آلبوم <ArrowLeft className="h-4 w-4" />
                    </span>
                </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}