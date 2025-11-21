'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, BookOpen, Eye, MoreHorizontal, SquarePenIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogbook, LogbookEntry } from '@/hooks/useLogbook';

// Fungsi untuk mendapatkan class CSS berdasarkan status
const getStatusClasses = (status: LogbookEntry['status_verifikasi']) => {
    switch (status) {
        case 'disetujui':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'pending':
            return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'ditolak':
            return 'bg-red-100 text-red-700 border-red-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getStatusLabel = (status: LogbookEntry['status_verifikasi']) => {
    switch (status) {
        case 'disetujui':
            return 'Disetujui';
        case 'pending':
            return 'Belum Diverifikasi';
        case 'ditolak':
            return 'Ditolak';
        default:
            return status;
    }
};

export function LogbookTable() {
    const { logbookList, meta, loading, error, fetchLogbook } = useLogbook();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [processing, setProcessing] = useState<number | null>(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogbook({
                page: currentPage,
                per_page: entriesPerPage,
                search: searchTerm,
                status: statusFilter,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, entriesPerPage, currentPage, fetchLogbook]);

    // Handle filter changes
    const handleStatusChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        setCurrentPage(1);
    };

    const handleEntriesPerPageChange = (newPerPage: number) => {
        setEntriesPerPage(newPerPage);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Handler untuk delete logbook
    const handleDelete = async (entry: LogbookEntry) => {
        if (!confirm('Apakah Anda yakin ingin menghapus logbook ini?')) {
            return;
        }

        setProcessing(entry.id);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://localhost:8000/api/logbook/delete/${entry.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                // Refresh data setelah delete berhasil
                await fetchLogbook({
                    page: currentPage,
                    per_page: entriesPerPage,
                    search: searchTerm,
                    status: statusFilter,
                });
                alert('Logbook berhasil dihapus');
            } else {
                alert(result.message || 'Gagal menghapus logbook');
            }
        } catch (err) {
            console.error('Error deleting logbook:', err);
            alert('Terjadi kesalahan saat menghapus logbook');
        } finally {
            setProcessing(null);
        }
    };

    // Handler untuk edit logbook
    const handleEdit = (entry: LogbookEntry) => {
        // Buka modal atau form edit
        console.log('Edit logbook:', entry);
        
        // Contoh implementasi modal edit sederhana
        const kegiatan = prompt('Edit Kegiatan:', entry.kegiatan);
        if (kegiatan === null) return; // User cancel

        const kendala = prompt('Edit Kendala:', entry.kendala);
        if (kendala === null) return; // User cancel

        // Jika ada perubahan, lakukan update
        if (kegiatan !== entry.kegiatan || kendala !== entry.kendala) {
            handleUpdateLogbook(entry.id, kegiatan, kendala);
        }
    };

    // Handler untuk update logbook
    const handleUpdateLogbook = async (id: number, kegiatan: string, kendala: string) => {
        setProcessing(id);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://localhost:8000/api/logbook/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    kegiatan,
                    kendala,
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Refresh data setelah update berhasil
                await fetchLogbook({
                    page: currentPage,
                    per_page: entriesPerPage,
                    search: searchTerm,
                    status: statusFilter,
                });
                alert('Logbook berhasil diupdate');
            } else {
                alert(result.message || 'Gagal mengupdate logbook');
            }
        } catch (err) {
            console.error('Error updating logbook:', err);
            alert('Terjadi kesalahan saat mengupdate logbook');
        } finally {
            setProcessing(null);
        }
    };

    // Handler untuk view detail
    const handleViewDetail = (entry: LogbookEntry) => {
        console.log('Lihat detail logbook:', entry);
        // Bisa ditambahkan modal detail di sini
        alert(`Detail Logbook:\n\nSiswa: ${entry.siswa.nama}\nTanggal: ${entry.tanggal_formatted}\nKegiatan: ${entry.kegiatan}\nKendala: ${entry.kendala}\nStatus: ${getStatusLabel(entry.status_verifikasi)}`);
    };

    const getPageNumbers = () => {
        const totalPages = meta.last_page || 1;
        const maxPagesToShow = 5;
        
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    if (error) {
        return (
            <Card className="shadow-sm rounded-lg border-0">
                <CardContent className="p-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-700">Error: {error}</p>
                        <button
                            onClick={() => fetchLogbook()}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm rounded-lg border-0">
            <CardHeader className="py-4 px-6 border-b border-gray-200">
                <div className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                        <BookOpen className="h-5 w-5 mr-2 text-cyan-600" />
                        Daftar Logbook Harian
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {/* BARIS PENCARIAN & FILTER */}
                <div className="flex items-center justify-between mb-6 space-x-4">
                    {/* Search Input */}
                    <div className="w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Cari siswa, kegiatan, atau kendala..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0097BB] focus:border-transparent transition-colors shadow-sm"
                        />
                    </div>

                    {/* Filter Status dan Per Halaman */}
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                        {/* Filter Status */}
                        <div className="flex items-center">
                            <label htmlFor="filter-status" className="mr-2">Status:</label>
                            <select
                                id="filter-status"
                                value={statusFilter}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0097BB] focus:border-[#0097BB] appearance-none bg-white transition-colors text-sm"
                            >
                                <option value="all">Semua</option>
                                <option value="pending">Belum Diverifikasi</option>
                                <option value="disetujui">Disetujui</option>
                                <option value="ditolak">Ditolak</option>
                            </select>
                        </div>

                        {/* Filter Per Halaman */}
                        <div className="flex items-center">
                            <label htmlFor="show-entries" className="mr-2 whitespace-nowrap">Per halaman:</label>
                            <select
                                id="show-entries"
                                value={entriesPerPage}
                                onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
                                className="py-2 pl-3 pr-8 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0097BB] focus:border-[#0097BB] appearance-none bg-white transition-colors text-sm"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* TABLE LOGBOOK */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* HEAD TABLE */}
                        <thead className="bg-white">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/6">Tanggal & Foto</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Kegiatan & Kendala</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-auto">Status</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Catatan Verifikasi</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Aksi</th>
                            </tr>
                        </thead>

                        {/* BODY TABLE */}
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097BB]"></div>
                                        </div>
                                        <p className="text-gray-500 mt-2">Memuat data logbook...</p>
                                    </td>
                                </tr>
                            ) : logbookList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-8 text-center">
                                        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500">
                                            {searchTerm || statusFilter !== 'all'
                                                ? 'Tidak ada data logbook yang sesuai dengan pencarian'
                                                : 'Belum ada data logbook'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                logbookList.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Kolom Siswa & Tanggal */}
                                        <td className="px-3 py-4 align-top whitespace-nowrap">
                                            <div className="flex items-start space-x-3">
                                                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-cyan-100 text-[#0097BB] shrink-0">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{entry.siswa.nama}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        NIS: {entry.siswa.nis}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        <Calendar className="inline h-3 w-3 mr-1" />
                                                        {entry.tanggal_formatted}
                                                    </p>
                                                    {entry.file && (
                                                        <p className="text-xs text-[#0097BB] mt-1 italic">
                                                            Ada foto
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kolom Kegiatan & Kendala */}
                                        <td className="px-3 py-4 align-top text-sm">
                                            <p className="font-medium text-gray-800">
                                                <span className="font-bold text-gray-900">Kegiatan:</span>{' '}
                                                {entry.kegiatan.length > 100
                                                    ? `${entry.kegiatan.substring(0, 100)}...`
                                                    : entry.kegiatan}
                                            </p>
                                            <p className="mt-2 text-gray-600">
                                                <span className="font-bold text-gray-900">Kendala:</span>{' '}
                                                {entry.kendala.length > 100
                                                    ? `${entry.kendala.substring(0, 100)}...`
                                                    : entry.kendala}
                                            </p>
                                        </td>

                                        {/* Kolom Status */}
                                        <td className="px-3 py-4 align-top whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusClasses(entry.status_verifikasi)}`}
                                            >
                                                {getStatusLabel(entry.status_verifikasi)}
                                            </span>
                                        </td>

                                        {/* Kolom Catatan (Guru & DUDI) */}
                                        <td className="px-3 py-4 align-top text-sm text-gray-600">
                                            <div className="space-y-2">
                                                <p>
                                                    <span className="font-bold text-gray-900">Guru:</span>{' '}
                                                    {entry.catatan_guru || 'Belum ada catatan'}
                                                </p>
                                                {entry.catatan_dudi && (
                                                    <p>
                                                        <span className="font-bold text-gray-900">DUDI:</span>{' '}
                                                        {entry.catatan_dudi}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Kolom Aksi dengan Dropdown */}
                                        <td className="px-3 py-4 align-top whitespace-nowrap text-left text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                {/* Dropdown Menu untuk Aksi Lainnya */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button 
                                                            className="text-gray-400 hover:text-[#0097BB] transition-colors p-1 rounded-md"
                                                            title="Aksi Lainnya"
                                                            disabled={processing === entry.id}
                                                        >
                                                            {processing === entry.id ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0097BB]"></div>
                                                            ) : (
                                                                <MoreHorizontal className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem 
                                                            onClick={() => handleViewDetail(entry)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Lihat Detail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleEdit(entry)}
                                                            className="cursor-pointer"
                                                        >
                                                            <SquarePenIcon className="h-4 w-4 mr-2" />
                                                            Edit Logbook
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDelete(entry)}
                                                            className="cursor-pointer text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Hapus Logbook
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {!loading && logbookList.length > 0 && (
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4 text-sm text-gray-600">
                            <span>
                                Menampilkan {meta.from || 0} sampai {meta.to || 0} dari {meta.total} entri
                            </span>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    &lt;
                                </button>
                                {getPageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`p-2 border border-gray-200 rounded-lg transition-colors ${
                                            currentPage === page
                                                ? 'bg-[#0097BB] text-white'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === meta.last_page}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}