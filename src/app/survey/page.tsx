'use client';

import { useState } from 'react';
// مطمئن شوید فایل lib/supabase.ts را ساخته‌اید
import { supabase } from '../../lib/supabase'; 

export default function SurveyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // تابع ارسال فرم به دیتابیس
  async function handleSubmit(event: any) {
    event.preventDefault(); // جلوگیری از رفرش شدن صفحه
    setLoading(true);

    const formData = new FormData(event.target);

    // آماده‌سازی داده‌ها برای ارسال
    // نام‌های سمت چپ باید دقیقاً مثل ستون‌های دیتابیس Supabase باشند
    const dataPayload = {
      student_name: formData.get('student_name'),
      nocaf_morning: Number(formData.get('nocaf_morning')),
      nocaf_noon: Number(formData.get('nocaf_noon')),
      nocaf_evening: Number(formData.get('nocaf_evening')),
      caf_morning: Number(formData.get('caf_morning')),
      caf_noon: Number(formData.get('caf_noon')),
      caf_evening: Number(formData.get('caf_evening')),
    };

    // ارسال به جدول memory_test
    const { error } = await supabase
      .from('memory_test')
      .insert([dataPayload]);

    setLoading(false);

    if (error) {
      console.error('Supabase Error:', error);
      alert('مشکلی پیش آمد! لطفاً اتصال اینترنت را چک کنید.');
    } else {
      setSubmitted(true);
    }
  }

  // اگر فرم با موفقیت ثبت شد، این پیام را نشان بده
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-green-100">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ثبت شد!</h1>
          <p className="text-gray-600 leading-relaxed">
            اطلاعات شما با موفقیت در دیتابیس ذخیره شد.
            <br />
            لطفاً به ارائه توجه کنید تا نتایج تحلیل را ببینید.
          </p>
        </div>
      </div>
    );
  }

  // فرم اصلی
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans" dir="rtl">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        
        {/* هدر رنگی بالا */}
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">آزمون حافظه و تمرکز 🧠</h1>
          <p className="text-indigo-100 text-sm opacity-90">
            لطفاً برای کمک به پروژه کلاسی، به سوالات زیر پاسخ دهید.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* بخش نام */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                نام یا نام مستعار (اختیاری)
              </label>
              <input 
                name="student_name" 
                type="text" 
                placeholder="مثلاً: علی"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-gray-800"
              />
            </div>

            <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-100 leading-6">
              👇 تصور کنید قرار است امتحان حافظه بدهید. نمره خود را (از ۰ تا ۲۰) پیش‌بینی کنید:
            </div>

            {/* بخش اول: بدون کافئین */}
            <div>
              <h3 className="flex items-center text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                <span className="ml-2 text-2xl">🚫</span>
                شرایط اول: بدون کافئین
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <InputCard label="صبح زود" name="nocaf_morning" />
                <InputCard label="ظهر" name="nocaf_noon" />
                <InputCard label="عصر" name="nocaf_evening" />
              </div>
            </div>

            {/* بخش دوم: با کافئین */}
            <div>
              <h3 className="flex items-center text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                <span className="ml-2 text-2xl">☕</span>
                شرایط دوم: با کافئین
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <InputCard label="صبح زود" name="caf_morning" />
                <InputCard label="ظهر" name="caf_noon" />
                <InputCard label="عصر" name="caf_evening" />
              </div>
            </div>

            {/* دکمه ارسال */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all transform active:scale-95
                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}
              `}
            >
              {loading ? 'در حال ارسال...' : 'ثبت نهایی'}
            </button>

          </form>
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-6">
        طراحی شده برای پروژه درس آمار
      </p>
    </div>
  );
}

// کامپوننت کوچک برای جلوگیری از تکرار کد ورودی‌ها
function InputCard({ label, name }: { label: string; name: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-gray-600 mb-1.5 text-center">{label}</label>
      <input
        required
        type="number"
        name={name}
        min="0"
        max="20"
        placeholder="-"
        className="w-full text-center py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-lg font-bold text-gray-800 placeholder-gray-300"
      />
    </div>
  );
}