<?php

namespace App\Http\Controllers;

use App\Models\Magang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MagangSiswaController extends Controller
{
    public function getMagangSiswa(Request $request)
    {
        try {
            $user = Auth::user();
            $siswa = $user->siswa;

            if (!$siswa) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data siswa tidak ditemukan'
                ], 404);
            }

            // Get data magang siswa yang aktif/selesai
            $magang = Magang::with(['dudi', 'guru', 'siswa'])
                ->where('siswa_id', $siswa->id)
                ->whereIn('status', ['diterima', 'berlangsung', 'selesai'])
                ->first();

            if (!$magang) {
                return response()->json([
                    'success' => true,
                    'data' => null,
                    'message' => 'Belum memiliki magang'
                ]);
            }

            // Format response
            $data = [
                'name' => $magang->siswa->nama,
                'nis' => $magang->siswa->nis,
                'class' => $magang->siswa->kelas,
                'major' => $magang->siswa->jurusan,
                'company' => $magang->dudi->nama_perusahaan,
                'address' => $magang->dudi->alamat,
                'period' => $this->formatSimplePeriod($magang->tanggal_mulai, $magang->tanggal_selesai),
                'status' => $this->getStatusDisplay($magang->status),
                'finalGrade' => $magang->nilai_akhir
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Data magang berhasil diambil'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getMagangSiswa: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data magang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Format periode sederhana tanpa Carbon
     */
    private function formatSimplePeriod($tanggalMulai, $tanggalSelesai)
    {
        if (!$tanggalMulai) {
            return 'Belum ditentukan';
        }

        // Format tanggal secara manual
        $mulai = $this->formatDateString($tanggalMulai);
        $selesai = $tanggalSelesai ? $this->formatDateString($tanggalSelesai) : 'Sekarang';

        return $mulai . ' s.d ' . $selesai;
    }

    /**
     * Format date string to "d M Y" format
     */
    private function formatDateString($dateString)
    {
        // Jika sudah dalam format yang diinginkan, return langsung
        if (is_string($dateString) && preg_match('/\d{1,2} [A-Za-z]{3} \d{4}/', $dateString)) {
            return $dateString;
        }

        // Coba parse berbagai format date
        try {
            $timestamp = strtotime($dateString);
            if ($timestamp !== false) {
                return date('d M Y', $timestamp);
            }
        } catch (\Exception $e) {
            // Jika gagal, return as is
        }

        return $dateString;
    }

    /**
     * Convert status to display format
     */
    private function getStatusDisplay($status)
    {
        $statusMap = [
            'diterima' => 'Aktif',
            'berlangsung' => 'Aktif',
            'selesai' => 'Selesai',
            'ditolak' => 'Ditolak',
            'pending' => 'Menunggu',
            'dibatalkan' => 'Dibatalkan'
        ];

        return $statusMap[$status] ?? $status;
    }
}
