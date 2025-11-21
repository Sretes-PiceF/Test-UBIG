'use client'
import { useAuth } from "@/hooks/useAuth";
import { Building2, Calendar, CheckCircle, Star, User, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

// Interface untuk data magang
interface MagangData {
    name: string;
    nis: string;
    class: string;
    major: string;
    company: string;
    address: string;
    period: string;
    status: string;
    finalGrade: string | null;
}

export default function MagangPage() {
    useAuth();
    const [magangData, setMagangData] = useState<MagangData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data magang
    const fetchMagangData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/siswa/magang`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setMagangData(result.data);
                } else {
                    setMagangData(null);
                }
            } else {
                throw new Error('Gagal mengambil data magang');
            }
        } catch (err: any) {
            console.error('Error fetching magang data:', err);
            setError('Gagal memuat data magang');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMagangData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Memuat data magang...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <p className="text-red-700 mb-4">{error}</p>
                            <button
                                onClick={fetchMagangData}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Data dummy fallback jika tidak ada data dari API
    const displayData = magangData || {
        name: "Ahmad Rizki",
        nis: "2024001",
        class: "XII RPL 1",
        major: "Rekayasa Perangkat Lunak",
        company: "PT Kreatif Teknologi",
        address: "Jakarta",
        period: "1 Feb 2024 s.d 1 Mei 2024",
        status: "Aktif",
        finalGrade: "88"
    };

    const hasMagang = magangData !== null;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Page Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {/* Header */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Status Magang Saya</h1>
                    <p className="text-gray-600 mb-6">
                        Lihat informasi detail tempat dan status magang Anda
                    </p>

                    {hasMagang ? (
                        /* Data Magang Card */
                        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="h-5 w-5 text-blue-500" />
                                <h2 className="text-lg font-semibold text-gray-900">Data Magang</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Kolom Kiri */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="h-4 w-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Nama Siswa</p>
                                            <p className="text-sm font-semibold text-gray-900">{displayData.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-4 w-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Kelas</p>
                                            <p className="text-sm font-semibold text-gray-900">{displayData.class}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-4 w-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Nama Perusahaan</p>
                                            <p className="text-sm font-semibold text-gray-900">{displayData.company}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Periode Magang</p>
                                            <p className="text-sm font-semibold text-gray-900">{displayData.period}</p>
                                        </div>
                                    </div>

                                    {displayData.finalGrade && (
                                        <div className="flex items-start gap-3">
                                            <Star className="h-4 w-4 text-gray-400 mt-1" />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 mb-1">Nilai Akhir</p>
                                                <p className="text-sm font-semibold text-gray-900">{displayData.finalGrade}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Kolom Kanan */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="h-4 w-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">NIS</p>
                                            <p className="text-sm font-semibold text-gray-900">{displayData.nis}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Building2 className="h-4 w-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Jurusan</p>
                                            <p className="text-sm font-semibold text-gray-900">{displayData.major}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Alamat Perusahaan</p>
                                            <p className="text-sm font-semibold text-gray-900">{displayData.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-4 w-4 text-gray-400 mt-1" />
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                                                displayData.status === "Aktif"
                                                    ? "bg-green-100 text-green-800"
                                                    : displayData.status === "Selesai"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}>
                                                {displayData.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Tidak ada magang */
                        <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100 text-center">
                            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Memiliki Magang</h3>
                            <p className="text-gray-500 mb-4">
                                Anda belum memiliki magang aktif. Silakan daftar ke DUDI yang tersedia.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}