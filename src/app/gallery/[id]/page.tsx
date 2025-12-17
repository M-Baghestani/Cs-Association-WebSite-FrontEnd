"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2, ArrowRight, Calendar, Share2 } from "lucide-react";
import BackButton from "../../../components/BackButton"; // فرض بر وجود این کامپوننت
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function GalleryDetailPage() {
  const { id } = useParams();
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_URL}/galleries/${id}`);
        if (res.data.success) setGallery(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchGallery();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );

  if (!gallery) return <div className="text-white text-center pt-32">گالری یافت نشد.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-20 px-4">
      {/* هدر جزئیات */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
          <div className="space-y-4">
            <BackButton />
            <motion.h1 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-5xl font-bold text-white mt-4"
            >
              {gallery.title}
            </motion.h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                <Calendar className="h-4 w-4" />
                {new Date(gallery.createdAt).toLocaleDateString('fa-IR')}
              </span>
              {/* اگر دسته‌بندی دارید اینجا نمایش دهید */}
            </div>

            {gallery.description && (
              <p className="text-zinc-300 max-w-3xl leading-relaxed text-lg mt-4">
                {gallery.description}
              </p>
            )}
          </div>
          
          {/* دکمه اشتراک گذاری (نمایشی) */}
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition text-zinc-300 hover:text-white">
            <Share2 className="h-4 w-4" /> اشتراک‌گذاری
          </button>
        </div>
      </div>

      {/* گرید تصاویر */}
      <div className="max-w-6xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {gallery.images.map((imgUrl: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer"
            >
              <Image
                src={imgUrl}
                alt={`Gallery image ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              {/* لایه تاریک روی هاور */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <ArrowRight className="h-6 w-6 text-white rotate-45" /> {/* آیکون بزرگنمایی */}
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}