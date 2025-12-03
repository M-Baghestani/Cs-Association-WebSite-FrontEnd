// src/app/admin/users/page.tsx (کد کامل)

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Users, UserCheck, UserX } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    isVerified: boolean;
    createdAt: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userStr || JSON.parse(userStr).role !== "admin") {
            router.push("/");
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setUsers(res.data.data);
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "خطا در دریافت کاربران.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [router]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center text-white">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500"/>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-10 pt-24 min-h-screen">
            <h1 className="mb-8 text-3xl font-bold text-white flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500"/> مدیریت کاربران ({users.length})
            </h1>

            <div className="overflow-x-auto bg-slate-900 rounded-xl border border-white/10 shadow-2xl">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-slate-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                نام کاربری
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                ایمیل
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                نقش
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                وضعیت
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                تاریخ ثبت‌نام
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-800/50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === 'admin' ? 'bg-purple-600/30 text-purple-300' : 'bg-blue-600/30 text-blue-300'
                                    }`}>
                                        {user.role === 'admin' ? 'مدیر' : 'کاربر عادی'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                    {user.isVerified ? (
                                        <UserCheck className="h-5 w-5 text-green-500 mx-auto"/>
                                    ) : (
                                        <UserX className="h-5 w-5 text-red-500 mx-auto"/>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="py-10 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl mt-6">
                    هیچ کاربری یافت نشد.
                </div>
            )}
        </div>
    );
}