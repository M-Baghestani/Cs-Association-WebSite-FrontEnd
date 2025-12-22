import { NextResponse } from 'next/server'

export function middleware(request) {
  // کپی گرفتن از URL
  const url = request.nextUrl.clone()
  
  // گرفتن هاست
  const hostname = request.headers.get('host') || ''
  
  // دامنه اصلی (بدون نقطه اول)
  const rootDomain = 'cs-khu.ir' 

  // تمیز کردن آدرس برای پیدا کردن ساب‌دامنه
  const currentHost = hostname
    .replace(`.${rootDomain}`, '')
    .replace(`www.`, '')

  // شرط: اگر ساب‌دامنه mhb بود
  if (currentHost === 'mhb') {
    // بازنویسی مسیر به پوشه survey
    url.pathname = `/survey${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // ادامه مسیر برای بقیه درخواست‌ها
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}