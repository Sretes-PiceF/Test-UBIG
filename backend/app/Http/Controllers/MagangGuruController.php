<?php

namespace App\Http\Controllers;

use App\Models\Magang;
use App\Http\Requests\StoreMagangRequest;
use App\Http\Requests\UpdateMagangRequest;

class MagangGuruController extends Controller
{
    public function getAllMagang ()
    {
        try {
        // TOTAL SISWA MAGANG - semua siswa yang pernah magang
        $totalSiswa = Magang::distinct('siswa_id')->count('siswa_id');
        
        // SISWA DENGAN STATUS MAGANG AKTIF (berlangsung)
        $siswaAktif = Magang::where('status', 'berlangsung')->count();
        
        // SISWA DENGAN STATUS MAGANG SELESAI
        $siswaSelesai = Magang::where('status', 'selesai')->count();
        
        // SISWA DENGAN STATUS PENDING (menunggu penempatan)
        $siswaPending = Magang::where('status', 'pending')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_siswa' => $totalSiswa,
                'aktif' => $siswaAktif,
                'selesai' => $siswaSelesai,
                'pending' => $siswaPending
            ]
        ], 200);
    } catch (\Throwable $th) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil data dashboard magang',
            'error' => $th->getMessage()
        ], 500);
    }
    }
}
