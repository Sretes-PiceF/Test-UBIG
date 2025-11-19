'use client';

import { useState } from 'react';
import { X, Building2, MapPin, Phone, Mail, User } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TambahDudiModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface DudiFormData {
    nama_perusahaan: string;
    alamat: string;
    telepon: string;
    email: string;
    penanggung_jawab: string;
}

export function TambahDudiModal({ open, onOpenChange, onSuccess }: TambahDudiModalProps) {
    const [formData, setFormData] = useState<DudiFormData>({
        nama_perusahaan: '',
        alamat: '',
        telepon: '',
        email: '',
        penanggung_jawab: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/guru/dudi`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Gagal menambahkan DUDI');
            }

            const result = await response.json();

            if (result.success) {
                // Reset form
                setFormData({
                    nama_perusahaan: '',
                    alamat: '',
                    telepon: '',
                    email: '',
                    penanggung_jawab: ''
                });

                // Close modal
                onOpenChange(false);

                // Callback success
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                setError(result.message || 'Gagal menambahkan DUDI');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            console.error('Error adding DUDI:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            nama_perusahaan: '',
            alamat: '',
            telepon: '',
            email: '',
            penanggung_jawab: ''
        });
        setError(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-md bg-white border-0 shadow-2xl"
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="h-5 w-5 text-[#0097BB]" />
                        Tambah DUDI Baru
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Nama Perusahaan */}
                    <div className="space-y-2">
                        <Label htmlFor="nama_perusahaan" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            Nama Perusahaan
                        </Label>
                        <Input
                            id="nama_perusahaan"
                            name="nama_perusahaan"
                            value={formData.nama_perusahaan}
                            onChange={handleChange}
                            placeholder="Masukkan nama perusahaan"
                            required
                            disabled={loading}
                            className="bg-white"
                        />
                    </div>

                    {/* Alamat */}
                    <div className="space-y-2">
                        <Label htmlFor="alamat" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            Alamat
                        </Label>
                        <Textarea
                            id="alamat"
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            placeholder="Masukkan alamat lengkap"
                            rows={3}
                            required
                            disabled={loading}
                            className="resize-none bg-white"
                        />
                    </div>

                    {/* Telepon */}
                    <div className="space-y-2">
                        <Label htmlFor="telepon" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Phone className="h-4 w-4 text-gray-500" />
                            Telepon
                        </Label>
                        <Input
                            id="telepon"
                            name="telepon"
                            type="tel"
                            value={formData.telepon}
                            onChange={handleChange}
                            placeholder="Contoh: 021-12345678"
                            required
                            disabled={loading}
                            className="bg-white"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Mail className="h-4 w-4 text-gray-500" />
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Contoh: info@perusahaan.com"
                            required
                            disabled={loading}
                            className="bg-white"
                        />
                    </div>

                    {/* Penanggung Jawab */}
                    <div className="space-y-2">
                        <Label htmlFor="penanggung_jawab" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <User className="h-4 w-4 text-gray-500" />
                            Penanggung Jawab
                        </Label>
                        <Input
                            id="penanggung_jawab"
                            name="penanggung_jawab"
                            value={formData.penanggung_jawab}
                            onChange={handleChange}
                            placeholder="Nama penanggung jawab"
                            required
                            disabled={loading}
                            className="bg-white"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={loading}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-[#0097BB] hover:bg-[#007b9e]"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}