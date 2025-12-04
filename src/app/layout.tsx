// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import { Toaster } from "react-hot-toast";
import { Vazirmatn } from "next/font/google";
import NeuralBackground from "../components/NeuralBackground";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

// 🚨 FIX: آدرس پایه سایت برای استفاده در متادیتاهای مطلق (Open Graph)
const BASE_URL = "https://cs-khu.ir";

export const metadata: Metadata = {
  title: "انجمن علمی علوم کامپیوتر دانشگاه خوارزمی | CS-KHU.ir",
  description:
    "پایگاه رسمی انجمن علمی گروه علوم کامپیوتر دانشگاه خوارزمی. آخرین رویدادها، وبلاگ‌های تخصصی، و نشریات علمی را دنبال کنید.",
  icons: {
    icon: "/icon.png",
  },

  // 🚨 FIX: افزودن Open Graph (OG) برای پیش‌نمایش جذاب در تلگرام
  openGraph: {
    title: "انجمن علمی کامپیوتر خوارزمی | رویدادها و مقالات تخصصی",
    description:
      "پایگاه رسمی انجمن علمی گروه علوم کامپیوتر دانشگاه خوارزمی. آخرین رویدادها، وبلاگ‌های تخصصی، و نشریات علمی را دنبال کنید.",
    url: BASE_URL,
    siteName: "CS Association",
    type: "website",
    images: [
      {
        // استفاده از آیکون به عنوان تصویر پیش‌فرض (باید URL مطلق باشد)
        url: `${BASE_URL}/icon.png`,
        width: 512,
        height: 512,
        alt: "لوگوی انجمن علمی علوم کامپیوتر",
      },
    ],
  },
  // 🚨 FIX: افزودن Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@CS_KHU", // اگر اکانت توییتر دارید
    creator: "@CS_KHU",
    images: [`${BASE_URL}/icon.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazir.className} bg-gray-900 text-white antialiased min-h-screen flex flex-col`}
      >
        <Toaster
          position="top-center" // برای نمایش بهینه در موبایل
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />

        {/* 🚨 FIX: استفاده از IntroWrapper برای نمایش ویدیوی اینترو */}
        <NeuralBackground />
        <Navbar />

        <main className="flex-grow flex flex-col pt-20 sm:pt-24 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        <Footer />
        <BackButton />

        +      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "انجمن علمی علوم کامپیوتر دانشگاه خوارزمی",
        "url": "https://cs-khu.ir/",
        "logo": "https://cs-khu.ir/icon.png",
        "sameAs": ["https://t.me/CS_KHU","https://www.linkedin.com/company/cskhu","https://www.instagram.com/cs.khu?igsh=MXU0NWQ5eWJlamRqMA=="]
      })}} />
      </body>
    </html>
  );
}
