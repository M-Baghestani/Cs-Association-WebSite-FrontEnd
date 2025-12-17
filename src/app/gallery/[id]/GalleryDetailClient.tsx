"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { 
  Loader2, Calendar, Share2, Download, 
  X, Maximize2 
} from "lucide-react";
import BackButton from "../../../components/BackButton"; 
import NeuralBackground from "../../../components/NeuralBackground";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ✅ تعریف اینترفیس برای ورودی‌های کامپوننت
interface GalleryDetailClientProps {
  id: string;
}

// ✅ اضافه کردن { id } به ورودی تابع
export default function GalleryDetailClient({ id }: GalleryDetailClientProps) {
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    // چک می‌کنیم که id وجود داشته باشد
    if (id) fetchGallery();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: gallery.title,
          text: gallery.description,
          url: url,
        });
      } catch (err) { console.log('Share canceled'); }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("لینک گالری کپی شد!");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
      <Loader2 className="animate-spin h-10 w-10 text-cyan-500" />
    </div>
  );

  if (!gallery) return <div className="text-white text-center pt-32">گالری یافت نشد.</div>;

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white overflow-x-hidden selection:bg-cyan-500/30">
      <NeuralBackground />

      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[128px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        
        <div className="mb-12 relative overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-white/10 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4">
                 <BackButton />
                 <span className="flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-bold border border-cyan-500/20">
                    <Calendar className="h-4 w-4" />
                    {new Date(gallery.createdAt).toLocaleDateString('fa-IR')}
                 </span>
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-black text-white leading-tight"
              >
                {gallery.title}
              </motion.h1>
              
              {gallery.description && (
                <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                  {gallery.description}
                </p>
              )}
            </div>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition text-white font-bold active:scale-95 group shrink-0"
            >
              <Share2 className="h-5 w-5 group-hover:text-cyan-400 transition" /> 
              <span>اشتراک‌گذاری</span>
            </button>
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery.images.map((imgUrl: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedImage(imgUrl)}
              className="relative group break-inside-avoid rounded-3xl overflow-hidden border border-white/5 cursor-zoom-in bg-slate-800 shadow-lg"
            >
              <Image
                src={imgUrl}
                alt={`Gallery image ${index}`}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Maximize2 className="h-6 w-6" />
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] bg-slate-950/90 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition z-50 border border-white/10">
              <X className="h-6 w-6" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center pointer-events-none"
            >
              <img 
                src={selectedImage} 
                alt="Full Screen" 
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10 bg-black pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="mt-6 flex items-center gap-4 pointer-events-auto">
                <a 
                  href={selectedImage} 
                  download 
                  target="_blank"
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold shadow-lg shadow-cyan-900/20 transition-all active:scale-95"
                >
                  <Download className="h-4 w-4" /> دانلود با کیفیت اصلی
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}