'use client';

import { DudiCard } from "@/components/layout/guru/DudiCard";
import { LogbookCard } from "@/components/layout/guru/LogbookCard";
import { MagangCard } from "@/components/layout/guru/MagangCard";
import { ProgressCard } from "@/components/layout/guru/Progres";
import { CardStats } from "@/components/ui/CardStats";
import { dashboardAPI } from "@/lib/api";
import { DashboardData } from "@/types/dashboard";
import {
    User, Building2, GraduationCap, BookOpen
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await dashboardAPI.getDashboardData();

            if (response.success && response.data) {
                setDashboardData(response.data);
            }
        } catch (err: unknown) {

            if (isAxiosError(err)) {
                const serverMessage =
                    err.response?.data?.error ||
                    err.response?.data?.message;

                const errorMessage =
                    serverMessage ||
                    err.message ||
                    "Gagal memuat data dashboard";

                setError(`Error ${err.response?.status || 'Unknown'}: ${errorMessage}`);
                console.error("API Error Details:", err.response?.data || err);
            } else {
                // error lain (bukan axios)
                setError("Terjadi kesalahan tak terduga");
                console.error("Unknown Error:", err);
            }
        }
        finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Memuat data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header Dashboard tetap ada di sini */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Selamat datang di dashboard guru <span className="font-semibold">SIMNAS</span>
                </p>
            </div>

            {/* GRID CARDS - DIPERBAIKI */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <CardStats
                    title="Total Siswa"
                    value={dashboardData?.total_siswa || 0}
                    description="Seluruh siswa terdaftar"
                    icon={User}
                />

                <CardStats
                    title="DUDI Partner"
                    value={dashboardData?.total_dudi || 0}
                    description="Perusahaan mitra"
                    icon={Building2}
                />

                <CardStats
                    title="Siswa Magang"
                    value={dashboardData?.siswa_magang || 0}
                    description="Sedang aktif magang"
                    icon={GraduationCap}
                />

                <CardStats
                    title="Logbook Hari Ini"
                    value={dashboardData?.logbook_hari_ini || 0}
                    description="Laporan masuk hari ini"
                    icon={BookOpen}
                />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Magang & Logbook Terbaru (Membutuhkan Grid/Flex internal) */}
                <div className="lg:col-span-2 space-y-6">
                    <MagangCard />
                    <LogbookCard />
                </div>

                {/* Kolom Kanan: Progress & DUDI Aktif */}
                <div className="lg:col-span-1 space-y-6">
                    <ProgressCard />
                    <DudiCard />
                </div>
            </div>
        </div>
    );
}