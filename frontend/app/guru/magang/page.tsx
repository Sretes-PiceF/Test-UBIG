import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calendar1,
    CheckCircle,
    GraduationCap,
    Plus,
    User,
    UsersRound,
    Building2
} from "lucide-react";
import { MagangTable } from "@/components/layout/guru/MagangTable";
import { CardStats } from "@/components/ui/CardStats";

export default function MagangPage() {
    // Data statis atau nanti dari API
    const statsData = {
        totalSiswa: "156",
        totalDudi: "42",
        siswaMagang: "118",
        logbookHariIni: "23"
    };

    return (
        <div className="p-8">
            {/* Header Halaman */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Data Siswa Magang</h1>
                <p className="text-gray-600 mt-1">
                    Kelola data, status, dan nilai magang seluruh siswa.
                </p>
            </div>

            {/* GRID CARDS - SUDAH DIRAPIKAN */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <CardStats
                    title="Total Siswa"
                    value={statsData.totalSiswa}
                    description="Seluruh siswa terdaftar"
                    icon={User}
                />

                <CardStats
                    title="Aktif"
                    value={statsData.totalDudi}
                    description="Perusahaan mitra"
                    icon={Building2} // Icon lebih sesuai untuk perus
                />

                <CardStats
                    title="Selesai"
                    value={statsData.siswaMagang}
                    description="Sedang aktif magang"
                    icon={CheckCircle}
                />

                <CardStats
                    title="Pending"
                    value={statsData.logbookHariIni}
                    description="Laporan masuk hari ini"
                    icon={Calendar1}
                />
            </div>

            {/* Card Tabel Magang */}
            <Card className="shadow-lg rounded-xl border-0">
                <CardHeader className="py-4 px-6 border-b bg-gray-50/50 rounded-t-xl">
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                            <UsersRound className="h-5 w-5 mr-2 text-cyan-600" />
                            Daftar Siswa Magang
                        </CardTitle>

                        {/* TOMBOL TAMBAH SISWA */}
                        <Button
                            className="bg-[#0097BB] hover:bg-[#007b9e] text-white rounded-lg shadow-md transition-colors px-4 py-2"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Siswa
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {/* Tabel Siswa Magang dimuat di sini */}
                    <MagangTable />
                </CardContent>
            </Card>
        </div>
    );
}