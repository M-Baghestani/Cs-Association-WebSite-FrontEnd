"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Trash2, Image as ImageIcon } from 'lucide-react'; // آیکون‌های جدید
import Image from 'next/image';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    label: string;
    defaultImage?: string
}

export default function ImageUploader({ onUpload, label, defaultImage = "" }: ImageUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    // پرچم برای تشخیص اینکه آیا کاربر دستی عکس را پاک کرده است
    const [isUserCleared, setIsUserCleared] = useState(false);
    const [imageUrl, setImageUrl] = useState(defaultImage);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setImageUrl(''); 
            onUpload(''); 
            setIsUserCleared(false);
            setUploadProgress(0);
        }
    };
    
    // سینک کردن با پراپ والد (مگر اینکه کاربر دستی پاک کرده باشد)
    useEffect(() => {
        if (defaultImage && !isUserCleared && defaultImage !== imageUrl) {
            setImageUrl(defaultImage);
        }
        // اگر والد عکس را خالی فرستاد (مثلا فرم ریست شد)
        if (!defaultImage && !file && imageUrl) {
            setImageUrl(''); 
        }
    }, [defaultImage, isUserCleared]);

    const handleUpload = async () => {
        if (!file) {
            toast.error("لطفاً یک فایل انتخاب کنید.");
            return;
        }
        
        setLoading(true);
        setUploadProgress(1);

        const formData = new FormData();
        formData.append('image', file); 

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    }
                },
            });

            if (res.data.success) {
                const uploadedUrl = res.data.url;
                setImageUrl(uploadedUrl);
                setIsUserCleared(false);
                onUpload(uploadedUrl);
                toast.success('تصویر با موفقیت آپلود شد.');
            }
        } catch (error) {
            toast.error('خطا در آپلود فایل.');
            setUploadProgress(0);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setImageUrl('');
        onUpload('');
        setIsUserCleared(true); // علامت‌گذاری به عنوان "حذف شده توسط کاربر"
        setUploadProgress(0);
    };

    const isUploading = loading && uploadProgress > 0 && uploadProgress < 100;
    const isUploaded = imageUrl && !loading;

    return (
        <div className="flex flex-col items-center p-4 border border-dashed border-gray-700 bg-slate-900/30 rounded-xl w-full">
            <div className="flex items-center gap-2 mb-4 w-full">
                <ImageIcon className="h-5 w-5 text-cyan-400"/>
                <p className="text-gray-300 text-sm font-bold">{label}</p>
            </div>

            {/* --- حالت ۱: نمایش عکس آپلود شده --- */}
            {isUploaded ? (
                <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
                    {/* نمایش خود عکس */}
                    <div className="relative w-full aspect-video md:aspect-[16/9] max-w-sm mb-4 overflow-hidden rounded-lg border-2 border-cyan-500/30 shadow-2xl">
                        <Image 
                            src={imageUrl} 
                            alt="Uploaded Cover" 
                            layout="fill"
                            objectFit="cover"
                            className="hover:scale-105 transition duration-500"
                        />
                    </div>
                    
                    {/* دکمه حذف زیر عکس */}
                    <button 
                        type="button" // جلوگیری از سابمیت فرم
                        onClick={handleRemove} 
                        className="flex items-center justify-center gap-2 w-full max-w-sm py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition group"
                    >
                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition"/>
                        <span>حذف و انتخاب عکس جدید</span>
                    </button>
                </div>
            ) : (
                /* --- حالت ۲: فرم انتخاب فایل --- */
                <div className="w-full space-y-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id={`image-upload-${label}`} // ID یکتا برای جلوگیری از تداخل اگر چند آپلودر باشد
                        disabled={loading}
                    />
                    
                    {!file ? (
                        <label 
                            htmlFor={`image-upload-${label}`} 
                            className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/5 cursor-pointer transition group"
                        >
                            <div className="p-3 bg-gray-800 rounded-full mb-3 group-hover:scale-110 transition duration-300">
                                <ImageIcon className="h-6 w-6 text-gray-400 group-hover:text-cyan-400"/>
                            </div>
                            <span className="text-gray-400 font-medium group-hover:text-cyan-400">برای انتخاب تصویر کلیک کنید</span>
                            <span className="text-gray-500 text-xs mt-1">PNG, JPG, JPEG (حداکثر 5 مگابایت)</span>
                        </label>
                    ) : (
                        /* فایل انتخاب شده (هنوز آپلود نشده) */
                        <div className="bg-slate-800 p-4 rounded-xl border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-cyan-300 truncate max-w-[200px]">{file.name}</span>
                                <button type="button" onClick={handleRemove} className="text-gray-400 hover:text-red-400">
                                    <Trash2 className="h-4 w-4"/>
                                </button>
                            </div>

                            <button
                                type="button" // جلوگیری از سابمیت فرم
                                onClick={handleUpload}
                                disabled={loading}
                                className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                                    loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5"/>
                                        <span>در حال پردازش...</span>
                                    </>
                                ) : (
                                    <span>شروع آپلود</span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            {/* نوار پیشرفت */}
            {isUploading && (
                <div className="w-full mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>در حال آپلود...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500 transition-all duration-300 ease-out" 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
}