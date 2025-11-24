import { CheckCircle, Clock, XCircle } from "lucide-react";

export interface LogbookItemProps {
    kegiatan: string;
    tanggal: string;      // <= WAJIB ADA
    kendala?: string | null;
    status: "pending" | "disetujui" | "ditolak";
}

export function LogbookItem({ kegiatan, tanggal, kendala, status }: LogbookItemProps) {

    const statusIcon = {
        disetujui: <CheckCircle className="w-4 h-4 text-green-600" />,
        pending: <Clock className="w-4 h-4 text-yellow-500" />,
        ditolak: <XCircle className="w-4 h-4 text-red-600" />
    };

    return (
        <div className="p-3 rounded-lg border bg-white shadow-sm">
            <div className="flex justify-between items-center">
                <p className="font-medium text-gray-900">Kegiatan: {kegiatan}</p>
                {statusIcon[status]}
            </div>

            {/* <== TANGGAL WAJIB ADA, NOTE: TypeScript error muncul kalau ini tidak match */}
            <p className="text-xs text-gray-500 mt-1">
                Tanggal:  {tanggal}
            </p>

            {kendala && (
                <p className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold">Kendala:</span> {kendala}
                </p>
            )}
        </div>
    );
}
