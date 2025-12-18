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

interface GalleryDetailClientProps {
  id: string;
}

export default function GalleryDetailClient({ id }: GalleryDetailClientProps) {
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // 🛠️ دیباگ: اگر ID نرسید، لودینگ را خاموش کن و خطا بده
    if (!id) {
        console.error("❌ خطا: شناسه (ID) گالری دریافت نشد.");
        setLoading(false);
        return;
    }

    const fetchGallery = async () => {
      try {
        console.log("در حال دریافت گالری با ID:", id);
        const res = await axios.get(`${API_URL}/galleries/${id}`);
        if (res.data.success) setGallery(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("خطا در دریافت اطلاعات گالری");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: gallery?.title,
          text: gallery?.description,
          url: url,
        });
      } catch (err) { console.log('Share canceled'); }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("لینک گالری کپی شد!");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
    </div>
  );

  if (!gallery) return <div className="text-white text-center pt-32 text-xl font-bold">گالری یافت نشد ❌</div>;

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden">
      <NeuralBackground />

      <div className="relative z-10 pt-24 pb-20 px-4 container mx-auto max-w-6xl">
        
        {/* هدر جزئیات */}
        <div className="mb-12 relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-5 flex-1">
              <div className="flex items-center gap-4">
                 <BackButton />
                 <span className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                    <Calendar className="h-4 w-4" />
                    {new Date(gallery.createdAt).toLocaleDateString('fa-IR')}
                 </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {gallery.title}
              </h1>
              
              {gallery.description && (
                <p className="text-gray-300 text-lg leading-relaxed">
                  {gallery.description}
                </p>
              )}
            </div>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition text-white font-medium active:scale-95 h-fit whitespace-nowrap"
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
              onClick={() => setSelectedImage(imgUrl)}
              className="relative group break-inside-avoid rounded-2xl overflow-hidden border border-white/10 cursor-zoom-in bg-slate-800 shadow-lg"
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
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white shadow-xl">
                      <Maximize2 className="h-6 w-6" />
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* مودال Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition z-50">
              <X className="h-8 w-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Full Screen" 
                className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
              />
              
              <div className="mt-4">
                <a 
                  href={selectedImage} 
                  download 
                  target="_blank"
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg transition"
                >
                  <Download className="h-4 w-4" /> دانلود تصویر
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}