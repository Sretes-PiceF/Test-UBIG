import { CardStats } from "@/components/ui/CardStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DudiTable } from "@/components/layout/guru/DudiTable";
import { User, Building2, GraduationCap, Plus } from "lucide-react";

export default function DudiPage() {
    return (
        <div className="p-8">
            {/* Header Halaman */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">DUDI</h1>
                <p className="text-gray-600 mt-1">
                    Kelola data industri dan perusahaan mitra magang siswa <span className="font-semibold">SIMNAS</span>
                </p>
            </div>

            {/* GRID CARDS STATS */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
                <CardStats
                    title="Total DUDI"
                    value={55}
                    description="Total perusahaan terdaftar"
                    icon={Building2}
                />

                <CardStats
                    title="Total Siswa Magang"
                    value={150}
                    description="Seluruh siswa terdaftar"
                    icon={User}
                />

                <CardStats
                    title="Rata - Rata Siswa"
                    value={120}
                    description="Sedang aktif magang"
                    icon={GraduationCap}
                />
            </div>

            {/* CARD TABEL DUDI */}
            <Card className="shadow-sm rounded-lg border-0">
                <CardHeader className="py-4 px-6 border-b border-gray-200">
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                            <Building2 className="h-5 w-5 mr-2 text-cyan-600" />
                            Daftar DUDI
                        </CardTitle>

                        <Button className="bg-[#0097BB] hover:bg-[#007b9e] text-white rounded-lg px-4 py-2">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah DUDI
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <DudiTable />
                </CardContent>
            </Card>
        </div>
    );
}