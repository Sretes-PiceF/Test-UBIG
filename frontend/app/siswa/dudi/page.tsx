"use client"
import { Building2, MapPin, User, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

// Dummy data DUDI
const dudiList = [
    {
        id: 1,
        name: "PT Kreatif Teknologi",
        industry: "Teknologi Informasi",
        status: "Menunggu", // Menunggu / Aktif
        address: "Jl. Merdeka No. 123, Jakarta",
        pic: "Andi Wijaya",
        quota: { filled: 8, total: 12 },
        description: "Perusahaan teknologi yang bergerak dalam pengembangan aplikasi web dan mobile. Memberikan kesempatan magang bagi mahasiswa IT.",
        isApplied: false
    },
    {
        id: 2,
        name: "CV Digital Solusi",
        industry: "Digital Marketing",
        status: "Aktif",
        address: "Jl. Sudirman No. 45, Surabaya",
        pic: "Sari Dewi",
        quota: { filled: 5, total: 8 },
        description: "Konsultan digital marketing yang membantu UMKM berkembang di era digital. Menyediakan program magang untuk siswa SMK jurusan multimedia dan pemasaran.",
        isApplied: false
    },
    {
        id: 3,
        name: "PT Inovasi Mandiri",
        industry: "Software Development",
        status: "Aktif",
        address: "Jl. Diponegoro No. 78, Surabaya",
        pic: "Budi Santoso",
        quota: { filled: 12, total: 15 },
        description: "Perusahaan software house yang mengembangkan sistem informasi untuk berbagai industri. Menawarkan program magang untuk siswa jurusan RPL dan TKJ.",
        isApplied: false
    },
    {
        id: 4,
        name: "PT Teknologi Maju",
        industry: "Hardware & Networking",
        status: "Aktif",
        address: "Jl. Ahmad Yani No. 90, Malang",
        pic: "Rina Setiawan",
        quota: { filled: 3, total: 6 },
        description: "Spesialis hardware dan jaringan komputer. Membuka kesempatan magang untuk siswa jurusan TKJ dan TITL.",
        isApplied: false
    },
    {
        id: 5,
        name: "CV Solusi Digital Prima",
        industry: "E-commerce",
        status: "Aktif",
        address: "Jl. Gatot Subroto No. 15, Bandung",
        pic: "Dian Prasetyo",
        quota: { filled: 7, total: 10 },
        description: "Platform e-commerce lokal yang menyediakan layanan logistik dan pemasaran digital. Menerima magang untuk siswa jurusan pemasaran dan TI.",
        isApplied: false
    },
    {
        id: 6,
        name: "PT Inovasi Global",
        industry: "Konsultan IT",
        status: "Aktif",
        address: "Jl. Thamrin No. 22, Jakarta",
        pic: "Fajar Hidayat",
        quota: { filled: 9, total: 12 },
        description: "Konsultan IT yang membantu perusahaan dalam transformasi digital. Membuka program magang untuk siswa SMK jurusan RPL dan TKJ.",
        isApplied: false
    }
];

export default function DudiPage() {
    const [appliedDudi, setAppliedDudi] = useState<Set<number>>(new Set());
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Fungsi untuk menampilkan notifikasi
    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000); // Hilang setelah 3 detik
    };

    // Fungsi untuk mendaftar ke DUDI
    const handleApply = (dudiId: number) => {
        if (appliedDudi.has(dudiId)) return; // Jika sudah mendaftar, jangan lakukan apa-apa

        setAppliedDudi(prev => new Set([...prev, dudiId]));
        showNotification("Pendaftaran magang berhasil dikirim! Menunggu verifikasi dari perusahaan.", "success");
    };

    return (
        <div className="p-8">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Cari Tempat Magang</h1>
            <p className="text-gray-600 mb-6">
                Jelajahi perusahaan mitra dan daftarkan diri Anda untuk program magang
            </p>

            {/* Search & Pagination */}
            <div className="bg-white shadow-sm rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Cari perusahaan, bidang usaha, lokasi"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tampilkan:</span>
                    <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>6</option>
                        <option>12</option>
                        <option>24</option>
                    </select>
                    <span className="text-sm text-gray-600">per halaman</span>
                </div>
            </div>

            {/* DUDI Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dudiList.map((dudi) => (
                    <div
                        key={dudi.id}
                        className="bg-white shadow-sm rounded-xl p-5 border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                        {/* Header: Company Name & Industry */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-[#4FC3F7] flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{dudi.name}</h3>
                                <p className="text-sm text-blue-600">{dudi.industry}</p>
                                {dudi.status === "Menunggu" && (
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                        Menunggu
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Address & PIC */}
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {dudi.address}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                PIC: {dudi.pic}
                            </div>
                        </div>

                        {/* Quota Progress */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">Kuota Magang</span>
                                <span className="text-sm font-medium text-gray-700">
                                    {dudi.quota.filled}/{dudi.quota.total}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                        width: `${(dudi.quota.filled / dudi.quota.total) * 100}%`
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {dudi.quota.total - dudi.quota.filled} slot tersisa
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-500 mb-4 line-clamp-3">
                            {dudi.description}
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-between items-center">
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Detail
                            </button>
                            {appliedDudi.has(dudi.id) ? (
                                <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-lg cursor-not-allowed">
                                    Sudah Mendaftar
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleApply(dudi.id)}
                                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                                >
                                    <ArrowRight className="h-3 w-3" /> Daftar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg transition-all duration-300 ${notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    <div className="flex items-center gap-2">
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5" />
                        ) : (
                            <XCircle className="h-5 w-5" />
                        )}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}