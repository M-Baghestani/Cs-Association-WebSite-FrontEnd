// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers"; // ۱. اضافه شدن این مورد برای تشخیص دامنه
import "./globals.css";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AppContent from "../components/AppContent";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

// آدرس پایه سایت
const BASE_URL = "https://cs-khu.ir";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// ۲. تعریف متادیتای پیش‌فرض (سایت اصلی) در یک متغیر
const defaultMetadata: Metadata = {
  title: "انجمن علمی علوم کامپیوتر دانشگاه خوارزمی | CS-KHU.ir",
  description:
    "پایگاه رسمی انجمن علمی گروه علوم کامپیوتر دانشگاه خوارزمی. آخرین رویدادها، وبلاگ‌های تخصصی، و نشریات علمی را دنبال کنید.",
  keywords: [
    "انجمن علمی",
    "علوم کامپیوتر",
    "دانشگاه خوارزمی",
    "CS",
    "KHU",
    "برنامه نویسی",
    "رویداد علمی",
  ],
  authors: { name: "انجمن علمی علوم کامپیوتر" },
  creator: "اعضای انجمن علمی",
  publisher: "دانشگاه خوارزمی",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "انجمن علمی کامپیوتر خوارزمی | رویدادها و مقالات تخصصی",
    description:
      "پایگاه رسمی انجمن علمی گروه علوم کامپیوتر دانشگاه خوارزمی. آخرین رویدادها، وبلاگ‌های تخصصی، و نشریات علمی را دنبال کنید.",
    url: BASE_URL,
    siteName: "CS Association",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/icon.png`,
        width: 512,
        height: 512,
        alt: "لوگوی انجمن علمی علوم کامپیوتر",
      },
    ],
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@CS_KHU",
    creator: "@CS_KHU",
    images: [`${BASE_URL}/icon.png`],
  },
};

// ۳. تابع تولید متادیتای پویا
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // شرط: اگر ساب‌دامنه mhb بود
  if (host.includes("mhb")) {
    return {
      ...defaultMetadata,
      title: "وب‌سایت رسمی محمدحسین باغستانی",
      description: "صفحه شخصی و نظرسنجی محمدحسین باغستانی - دانشجوی علوم کامپیوتر دانشگاه خوارزمی",
      openGraph: {
        ...defaultMetadata.openGraph,
        title: "وب‌سایت رسمی محمدحسین باغستانی",
        siteName: "Mohammad Hossein Baghestani",
      },
    };
  }

  // در غیر این صورت همان متادیتای اصلی را برگردان
  return defaultMetadata;
}

// Schema Markup برای سازمان
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "انجمن علمی علوم کامپیوتر دانشگاه خوارزمی",
  url: BASE_URL,
  logo: `${BASE_URL}/icon.png`,
  sameAs: [
    "https://t.me/CS_KHU",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazir.className} bg-gray-950 text-white antialiased min-h-screen flex flex-col`}
      >
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />

        {/* محتوای اصلی */}
        <AppContent>{children}</AppContent>

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}