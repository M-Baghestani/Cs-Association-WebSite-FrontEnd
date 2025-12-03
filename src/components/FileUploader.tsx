// src/components/FileUploader.tsx
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, Loader2, FileText, Check } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FileUploaderProps {
    onUpload: (url: string) => void;
    label: string;
    accept?: string;
}

export default function FileUploader({ onUpload, label, accept = '.pdf' }: FileUploaderProps) {
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // 💡 جدید: درصد آپلود

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileUrl('');
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
                setFileUrl(res.data.url);
                onUpload(res.data.url);
                toast.success('فایل با موفقیت آپلود شد.');
            }
        } catch (error) {
            toast.error('خطا در آپلود فایل. حجم فایل مجاز 50 مگابایت است.');
            setUploadProgress(0); // ریست کردن درصد در صورت خطا
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setFileUrl('');
        onUpload('');
        setUploadProgress(0);
    };

    const isUploading = loading && uploadProgress > 0 && uploadProgress < 100;
    const isUploaded = fileUrl && !loading;

    return (
        <div className="flex flex-col items-center p-4 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-300 text-sm mb-4">{label}</p>

            {isUploaded ? (
                <div className="flex items-center justify-between w-full max-w-sm p-4 bg-green-900/50 border border-green-600/50 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                        <Check className="h-6 w-6 text-green-400"/>
                        <span className="text-sm font-medium text-white">فایل آپلود شد.</span>
                    </div>
                    <button 
                        onClick={handleRemove} 
                        className="bg-red-600/30 text-red-400 p-1.5 rounded-full hover:bg-red-600 hover:text-white transition"
                    >
                        <X className="h-4 w-4"/>
                    </button>
                </div>
            ) : (
                <div className="w-full space-y-3">
                    <input
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload-input"
                        disabled={loading}
                    />
                    <label 
                        htmlFor="file-upload-input" 
                        className={`w-full flex items-center justify-center p-3 rounded-xl font-bold transition cursor-pointer ${
                            file ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                    >
                        {file ? file.name : 'انتخاب فایل PDF'}
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