import { Github, Linkedin, User, Globe, Send } from "lucide-react"; 
import Image from "next/image";

// دریافت اعضا از API
async function getMembers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/members`, {
      cache: 'no-store'
    });
    const json = await res.json();
    // 💡 اطمینان حاصل کنید که ساختار داده ارسالی از بک‌اند شامل website، telegram و gender باشد.
    return json.data || []; 
  } catch (error) {
    return [];
  }
}

export default async function TeamPage() {
  const members = await getMembers();

  return (
    <div className="min-h-screen px-4 pt-15 pb-20">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black text-white md:text-5xl">اعضای انجمن 👥</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            تیم ما متشکل از دانشجویان پرشور و فعالی است که برای ارتقای سطح علمی دانشکده تلاش می‌کنند.
          </p>
        </div>

        {members.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500">
            هنوز اعضا معرفی نشده‌اند.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member: any) => {
                
                // منطق Placeholder بر اساس جنسیت
                const isFemale = member.gender === 'female';
                const iconColor = isFemale ? 'text-pink-400' : 'text-blue-400';
                const bgColor = isFemale ? 'bg-pink-500/10' : 'bg-blue-500/10';
                
                return (
                <div key={member._id} className="group relative flex flex-col items-center rounded-3xl border border-white/5 bg-slate-900/50 p-6 text-center transition hover:border-blue-500/30 hover:bg-slate-900">
                
                {/* عکس پروفایل */}
                <div className="mb-6 relative h-32 w-32 overflow-hidden rounded-full border-4 border-slate-800 shadow-2xl group-hover:border-blue-500 transition duration-500">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // Placeholder بر اساس جنسیت (با آیکون بزرگ و رنگ متمایز)
                    <div className={`flex h-full w-full items-center justify-center ${bgColor} text-white transition duration-500 group-hover:scale-110`}>
                      <User className={`h-16 w-16 ${iconColor}`} /> 
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <span className="mt-1 text-sm font-medium text-blue-400">{member.role}</span>
                
                <p className="mt-4 text-sm text-gray-400 line-clamp-2">
                  {member.bio || "عضوی فعال در انجمن علمی کامپیوتر"}
                </p>

                {/* آیکون‌های شبکه اجتماعی */}
                <div className="mt-6 flex gap-4 opacity-60 transition group-hover:opacity-100">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" className="hover:text-blue-500 text-gray-400">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" className="hover:text-white text-gray-400">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {/* وب‌سایت شخصی */}
                  {member.website && (
                    <a href={member.website} target="_blank" className="hover:text-cyan-400 text-gray-400">
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                  {/* تلگرام */}
                  {member.telegram && (
                    <a href={`https://t.me/${member.telegram.replace('@', '')}`} target="_blank" className="hover:text-sky-500 text-gray-400">
                      <Send className="h-5 w-5" /> 
                    </a>
                  )}
                </div>

              </div>
            )})}
          </div>
        )}

      </div>
    </div>
  );
}