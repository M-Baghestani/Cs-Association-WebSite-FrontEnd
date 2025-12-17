"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";
import { 
  Loader2, Calendar, Share2, Download, 
  X, Maximize2, Copy, Check 
} from "lucide-react";
import BackButton from "../../../components/BackButton"; 
import NeuralBackground from "../../../components/NeuralBackground"; // ✅ اضافه شدن پس‌زمینه متحرک
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function GalleryDetailPage() {
  const { id } = useParams();
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // استیت برای نمایش تصویر به صورت تمام صفحه (Lightbox)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_URL}/galleries/${id}`);
        if (res.data.success) setGallery(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("خطا در دریافت اطلاعات گالری");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchGallery();
  }, [id]);

  // ✅ عملکرد واقعی دکمه اشتراک‌گذاری
  const handleShare = async () => {
    const url = window.location.href;
    
    // اگر مرورگر قابلیت Share داشت (موبایل)
    if (navigator.share) {
      try {
        await navigator.share({
          title: gallery.title,
          text: gallery.description,
          url: url,
        });
      } catch (err) {
        console.log('Sharing canceled');
      }
    } else {
      // کپی کردن لینک در دسکتاپ
      navigator.clipboard.writeText(url);
      toast.success("لینک گالری کپی شد!", {
        icon: <Copy className="h-4 w-4 text-blue-500"/>,
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );

  if (!gallery) return <div className="text-white text-center pt-32">گالری یافت نشد.</div>;

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white overflow-x-hidden">
      {/* ✅ پس‌زمینه متحرک */}
      <NeuralBackground />

      <div className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* هدر جزئیات */}
        <div className="mb-12 bg-zinc-900/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex justify-between md:justify-start items-center gap-4">
                 <BackButton />
                 <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                    <Calendar className="h-4 w-4" />
                    {new Date(gallery.createdAt).toLocaleDateString('fa-IR')}
                 </span>
              </div>

              <motion.h1 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-5xl font-black text-white mt-4 leading-tight"
              >
                {gallery.title}
              </motion.h1>
              
              {gallery.description && (
                <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl border-r-2 border-blue-500 pr-4 mt-4">
                  {gallery.description}
                </p>
              )}
            </div>
            
            {/* دکمه اشتراک گذاری */}
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition text-white font-medium active:scale-95"
            >
              <Share2 className="h-5 w-5" /> 
              <span>اشتراک‌گذاری</span>
            </button>
          </div>
        </div>

        {/* گرید تصاویر */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery.images.map((imgUrl: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedImage(imgUrl)} // ✅ باز شدن عکس
              className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-white/10 cursor-pointer bg-zinc-800"
            >
              <Image
                src={imgUrl}
                alt={`Gallery image ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* لایه هاور */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Maximize2 className="h-4 w-4" />
                      بزرگنمایی
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ✅ مودال نمایش تصویر (Lightbox) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* دکمه بستن */}
            <button className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition z-50">
              <X className="h-8 w-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()} // جلوگیری از بستن مودال با کلیک روی عکس
            >
              <img 
                src={selectedImage} 
                alt="Full Screen" 
                className="w-full h-full object-contain max-h-[85vh] rounded-lg"
              />
              
              {/* دانلود تصویر */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <a 
                  href={selectedImage} 
                  download 
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-blue-600 text-white rounded-full backdrop-blur-md border border-white/20 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" /> دانلود تصویر با کیفیت اصلی
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}