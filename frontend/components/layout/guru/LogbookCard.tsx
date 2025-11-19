"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

import { LogbookItem } from "./LogbookItem";
import type { Logbook } from "@/types/dashboard";

interface LogbookCardProps {
    logbooks?: Logbook[]; // tetap optional
}

export function LogbookCard({ logbooks = [] }: LogbookCardProps) {  // ← DEFAULT ARRAY
    return (
        <Card className="shadow-lg rounded-xl">
            <CardHeader className="py-4 px-6 border-b">
                <CardTitle className="flex items-center text-base font-semibold text-gray-900">
                    <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                    Logbook Terbaru
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-2">
                {logbooks.length === 0 && (
                    <p className="text-sm text-gray-500">Belum ada logbook.</p>
                )}

                {logbooks.map((item) => (
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
