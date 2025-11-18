// app/siswa/logbook/page.tsx
"use client";
import { Calendar, Camera, Eye, Pencil, Trash2, Plus } from "lucide-react";

// Dummy data logbook
const logbookList = [
    {
        id: 1,
        date: "2024-03-01",
        activity: "Membuat desain UI aplikasi kasir menggunakan Figma...",
        challenge: "Kesulitan menentukan skema warna yang tepat dan...",
        status: "Disetujui",
        verification: {
            guru: "Bagus, lanjutkan dengan implementasi",
            dudi: "Desain sudah sesuai dengan brief yang diberikan"
        },
        hasPhoto: true
    },
    {
        id: 2,
        date: "2024-03-02",
        activity: "Belajar backend Laravel untuk membangun REST API sistem...",
        challenge: "Error saat menjalankan migration database dan...",
        status: "Belum Diverifikasi",
        verification: {
            guru: "",
            dudi: ""
        },
        hasPhoto: true
    },
    {
        id: 3,
        date: "2024-03-03",
        activity: "Implementasi autentikasi dan authorization menggunakan...",
        challenge: "Token JWT expire terlalu cepat, perlu penyesuaian konfigurasi",
        status: "Ditolak",
        verification: {
            guru: "Perbaiki deskripsi kegiatan, terlalu singkat",
            dudi: "Kurang detail dalam menjelaskan langkah-langkah implementasi"
        },
        hasPhoto: true
    },
    {
        id: 4,
        date: "2024-03-04",
        activity: "Melakukan testing unit pada endpoint API yang telah...",
        challenge: "Beberapa test case gagal karena setup database testing...",
        status: "Disetujui",
        verification: {
            guru: "Sudah bagus, dokumentasikan hasil testingnya",
            dudi: "Testing sudah comprehensive"
        },
        hasPhoto: false
    }
];

export default function LogbookPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Logbook Magang Saya</h1>
            <p className="text-gray-600 mb-6">
                Catat kegiatan harian dan kendala yang Anda hadapi selama magang
            </p>

            {/* Card Container */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                {/* Header Card dengan Daftar Logbook Harian dan Tombol */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#4FC3F7]" />
                        <h2 className="text-lg font-semibold text-gray-900">Daftar Logbook Harian</h2>
                    </div>
                    <button className="px-4 py-2 bg-[#4FC3F7] text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 text-sm font-medium">
                        <Plus className="h-4 w-4" /> Tambah Logbook
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Cari kegiatan atau kendala..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 whitespace-nowrap">Status:</label>
                                <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                    <option>Semua</option>
                                    <option>Disetujui</option>
                                    <option>Belum Diverifikasi</option>
                                    <option>Ditolak</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 whitespace-nowrap">Per halaman:</label>
                                <select className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                    <option>5</option>
                                    <option>10</option>
                                    <option>20</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white border-b border-gray-200">
                    <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase">Tanggal & Foto</div>
                    <div className="col-span-4 text-xs font-semibold text-gray-600 uppercase">Kegiatan & Kendala</div>
                    <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase text-center">Status</div>
                    <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase">Catatan Verifikasi</div>
                    <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase text-center">Aksi</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                    {logbookList.map((log) => (
                        <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 transition-colors">
                            {/* Tanggal & Foto */}
                            <div className="col-span-2 flex items-start gap-3">
                                <div className="h-11 w-11 rounded-lg bg-[#4FC3F7] flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                                        {new Date(log.date).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    {log.hasPhoto && (
                                        <div className="flex items-center gap-1 mt-1.5">
                                            <Camera className="h-3.5 w-3.5 text-blue-500" />
                                            <span className="text-xs text-blue-600 font-medium">Ada foto</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Kegiatan & Kendala */}
                            <div className="col-span-4 space-y-3">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Kegiatan:</p>
                                    <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">{log.activity}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Kendala:</p>
                                    <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">{log.challenge}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 flex items-center justify-center">
                                <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full ${log.status === "Disetujui"
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : log.status === "Belum Diverifikasi"
                                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                            : "bg-red-100 text-red-700 border border-red-200"
                                    }`}>
                                    {log.status}
                                </span>
                            </div>

                            {/* Catatan Verifikasi */}
                            <div className="col-span-3 space-y-2">
                                {log.verification.guru ? (
                                    <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-lg">
                                        <p className="text-xs font-semibold text-blue-700 mb-1">Guru:</p>
                                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{log.verification.guru}</p>
                                    </div>
                                ) : null}
                                {log.verification.dudi ? (
                                    <div className="bg-purple-50 border border-purple-100 p-2.5 rounded-lg">
                                        <p className="text-xs font-semibold text-purple-700 mb-1">DUDI:</p>
                                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{log.verification.dudi}</p>
                                    </div>
                                ) : null}
                                {!log.verification.guru && !log.verification.dudi && (
                                    <p className="text-xs text-gray-400 italic">Belum ada catatan</p>
                                )}
                            </div>

                            {/* Aksi */}
                            <div className="col-span-1 flex items-center justify-center gap-1">
                                <button
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Lihat Detail"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                    <p className="text-sm text-gray-600">
                        Menampilkan <span className="font-semibold">1-4</span> dari <span className="font-semibold">4</span> logbook
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Sebelumnya
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg">1</button>
                        <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}