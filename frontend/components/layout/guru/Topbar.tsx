"use client";
import { User } from "lucide-react";

export function TopbarGuru() {
    return (
        <div className="w-full h-[93px] flex items-center justify-between px-8 bg-white border-b border-gray-100 flex-shrink-0">
            {/* KIRI — Judul */}
            <div className="flex flex-col leading-tight">
                <h1 className="text-xl font-semibold text-gray-800">SIMNAS</h1>
                <p className="text-sm text-gray-500 -mt-0.5">Sistem Pelaporan Magang Siswa SIMNAS</p>
            </div>
            {/* KANAN — Profil */}
            <div className="flex items-center gap-3">
                <div className="text-right leading-tight">
                    <p className="font-semibold text-sm text-gray-800">Nama Guru</p>
                    <p className="text-xs text-gray-500 -mt-0.5">Guru Pembimbing</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                </div>
            </div>
        </div>
    );
}