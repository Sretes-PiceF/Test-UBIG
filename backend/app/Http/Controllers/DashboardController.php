<?php

namespace App\Http\Controllers;

use App\Models\Dudi;
use App\Models\Logbook;
use App\Models\Magang;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getDashboardData()
    {
        try {
            $totalSiswa = Siswa::count();
            $totalDudi = Dudi::count();
            $totalMagang = Magang::where('status', 'selesai')->count();
            $logbookHariIni = Logbook::whereDate('tanggal', Carbon::today())->count();

                return response()->json([
                'success' => true,
                'data' => [
                    'total_siswa' => $totalSiswa,
                    'total_dudi' => $totalDudi,
                    'siswa_magang' => $totalMagang,
                    'logbook_hari_ini' => $logbookHariIni
                ]
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data dashboard',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
