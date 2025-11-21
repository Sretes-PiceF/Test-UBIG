"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

import { LogbookItem } from "./LogbookItem";
import { useEffect, useState } from "react";
import { Logbook } from "@/types/dashboard";

export function LogbookCard() {
    const [logbook, setLogbook] = useState<Logbook[]>([]);  // ← DEFAULT ARRAY

    useEffect(() => {
        const fetchLogbook = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/logbook`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                if (!res.ok) {
                    console.error('Gagal fetch:', res.status);
                    return;
                }
                const data: Logbook[] = await res.json();
                setLogbook(data);
            } catch (error) {
                console.error('Gagal memuat data Logbook', error);
            }
        }
        fetchLogbook();
    })
    return (
        <Card className="shadow-lg rounded-xl">
            <CardHeader className="py-4 px-6 border-b">
                <CardTitle className="flex items-center text-base font-semibold text-gray-900">
                    <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                    Logbook Terbaru
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
                {logbook.length === 0 && (
                    <p className="text-sm text-gray-500">Belum ada logbook.</p>
                )}

                {logbook.map((item) => (
                    <LogbookItem
                        key={item.id}
                        kegiatan={item.kegiatan}
                        tanggal={item.tanggal}
                        kendala={item.kendala}
                        status={item.status_verifikasi}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
