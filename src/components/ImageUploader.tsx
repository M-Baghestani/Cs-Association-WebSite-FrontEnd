// src/components/ImageUploader.tsx
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';






interface ImageUploaderProps {
    onUpload: (url: string) => void;
    label: string;
    defaultImage?: string
}

export default function ImageUploader({ onUpload, label, defaultImage = "" }: ImageUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(defaultImage);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setImageUrl('');
            onUpload('');
            setUploadProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("لطفاً یک فایل انتخاب کنید.");
            return;
        }
        
        setLoading(true);
        setUploadProgress(1); // شروع نوار پیشرفت

        const formData = new FormData();
        // ⚠️ مهم: نام فیلد باید مطابق با تنظیمات Multer در بک‌اند باشد (قبلاً 'image' تنظیم شده بود)
        formData.append('image', file); 

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => { // 🎯 کلیدی: ردیابی پیشرفت
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    }
                },
            });

            if (res.data.success) {
                setImageUrl(res.data.url);
                onUpload(res.data.url); 
                toast.success('فایل با موفقیت آپلود شد.'); 
            }
        } catch (error) {
            toast.error('خطا در آپلود فایل. حجم فایل مجاز 5 مگابایت است.');
            setUploadProgress(0); // ریست کردن درصد در صورت خطا
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setImageUrl('');
        onUpload('');
        setUploadProgress(0);
    };

    const isUploading = loading && uploadProgress > 0 && uploadProgress < 100;
    const isUploaded = imageUrl && !loading;

    return (
        <div className="flex flex-col items-center p-4 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-300 text-sm mb-4">{label}</p>

            {/* بخش نمایش عکس آپلود شده */}
            {isUploaded ? (
                <div className="relative w-full max-w-xs aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                    <Image 
                        src={imageUrl} 
                        alt="Uploaded Cover" 
                        layout="fill"
                        objectFit="cover"
                        className="opacity-70"
                    />
                    <button 
                        onClick={handleRemove} 
                        className="absolute top-2 left-2 bg-red-600 p-1.5 rounded-full text-white hover:bg-red-500 transition shadow-lg"
                    >
                        <X className="h-5 w-5"/>
                    </button>
                    <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center">
                        <Check className="h-10 w-10 text-green-400"/>
                    </div>
                </div>
            ) : (
                <div className="w-full space-y-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload-input"
                        disabled={loading}
                    />
                    <label 
                        htmlFor="image-upload-input" 
                        className={`w-full flex items-center justify-center p-3 rounded-xl font-bold transition cursor-pointer ${
                            file ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                    >
                        {file ? file.name : 'انتخاب فایل جلد'}
                    </label>

                    {file && (
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'
                            } text-white`}
                        >
                            {loading && <Loader2 className="animate-spin h-5 w-5"/>}
                            {isUploading ? `در حال آپلود: ${uploadProgress}%` : (loading ? 'در حال پردازش...' : 'شروع آپلود')}
                        </button>
                    )}
                </div>
            )}
            
            {/* 💡 Progress Bar */}
            {isUploading && (
                <div className="w-full mt-4">
                    <div className="h-2 bg-gray-700 rounded-full">
                        <div 
                            className="h-2 bg-cyan-500 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}