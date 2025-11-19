'use client';

import { useState } from 'react';
import { Calendar, User, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface TambahMagangModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

interface MagangFormData {
    nama_siswa: string;
    nis: string;
    kelas: string;
    jurusan: string;
    telepon: string;
    email: string;
    alamat: string;
    dudi_id: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: string;
    nilai_akhir: string;
}

export function TambahMagangModal({ open, onOpenChange, onSuccess }: TambahMagangModalProps) {
    const [formData, setFormData] = useState<MagangFormData>({
        nama_siswa: '',
        nis: '',
        kelas: '',
        jurusan: '',
        telepon: '',
        email: '',
        alamat: '',
        dudi_id: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'pending',
        nilai_akhir: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/guru/magang`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Gagal menambahkan magang');

            onOpenChange(false);
            onSuccess?.();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        onOpenChange(false);
        setError(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-white border-0 shadow-2xl">

                {/* JUDUL ATAS */}
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Data Siswa Magang
                    </DialogTitle>
                </DialogHeader>

                {/* FORM */}
                <div className="grid grid-cols-2 gap-4 py-4">

                    {error && (
                        <div className="col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <InputGroup
                        placeholder="Nama Siswa"
                        name="nama_siswa"
                        value={formData.nama_siswa}
                        onChange={handleChange}
                        icon={<User className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                        placeholder="NIS"
                        name="nis"
                        value={formData.nis}
                        onChange={handleChange}
                    />

                    <InputGroup
                        placeholder="Kelas"
                        name="kelas"
                        value={formData.kelas}
                        onChange={handleChange}
                    />

                    <InputGroup
                        placeholder="Jurusan"
                        name="jurusan"
                        value={formData.jurusan}
                        onChange={handleChange}
                    />

                    <InputGroup
                        placeholder="Telepon"
                        name="telepon"
                        value={formData.telepon}
                        onChange={handleChange}
                        icon={<Phone className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        icon={<Mail className="h-4 w-4 text-gray-400" />}
                    />

                    <div className="col-span-2 space-y-2">
                        <Textarea
                            name="alamat"
                            rows={3}
                            value={formData.alamat}
                            onChange={handleChange}
                            className="resize-none"
                            placeholder="Alamat lengkap siswa"
                        />
                    </div>

                    {/* Pilih DUDI */}
                    <div className="space-y-2">
                        <Select
                            value={formData.dudi_id}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, dudi_id: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih DUDI" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">PT. Teknologi Nusantara</SelectItem>
                                <SelectItem value="2">CV. Digital Kreativa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <InputGroup
                        placeholder="Tanggal Mulai"
                        name="tanggal_mulai"
                        type="date"
                        value={formData.tanggal_mulai}
                        onChange={handleChange}
                        icon={<Calendar className="h-4 w-4 text-gray-400" />}
                    />

                    <InputGroup
                        placeholder="Tanggal Selesai"
                        name="tanggal_selesai"
                        type="date"
                        value={formData.tanggal_selesai}
                        onChange={handleChange}
                        icon={<Calendar className="h-4 w-4 text-gray-400" />}
                    />

                    <div>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData(prev => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status Magang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="berlangsung">Berlangsung</SelectItem>
                                <SelectItem value="selesai">Selesai</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <InputGroup
                        placeholder="Nilai Akhir"
                        name="nilai_akhir"
                        type="number"
                        value={formData.nilai_akhir}
                        onChange={handleChange}
                    />

                    {/* BUTTON */}
                    <div className="col-span-2 flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            className="flex-1"
                        >
                            Batal
                        </Button>

                        <Button
                            type="button"
                            disabled={loading}
                            onClick={handleSubmit}
                            className="flex-1 bg-[#0097BB] hover:bg-[#007b9e]"
                        >
                            {loading ? 'Menyimpan...' : 'Tambah'}
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}

function InputGroup({
    placeholder,
    name,
    type = "text",
    value,
    onChange,
    icon,
}: {
    placeholder: string;
    name: string;
    type?: string;
    value: string;
    icon?: React.ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {icon}
                </div>
            )}

            <Input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={icon ? "pl-10" : ""}
            />
        </div>
    );
}
