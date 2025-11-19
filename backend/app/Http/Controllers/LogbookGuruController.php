<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Http\Requests\StoreLogbookRequest;
use App\Http\Requests\UpdateLogbookRequest;

class LogbookGuruController extends Controller
{
   public function getAllLogbook () {
     try {
        // TOTAL LOGBOOK - semua catatan harian
        $totalLogbook = Logbook::count();
        
        // LOGBOOK BELUM DIVERIFIKASI (status pending)
        $belumDiverifikasi = Logbook::where('status_verifikasi', 'pending')->count();
        
        // LOGBOOK DISETUJUI
        $disetujui = Logbook::where('status_verifikasi', 'disetujui')->count();
        
        // LOGBOOK DITOLAK
        $ditolak = Logbook::where('status_verifikasi', 'ditolak')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_logbook' => $totalLogbook,
                'belum_diverifikasi'=> $belumDiverifikasi,
                'disetujui'=> $disetujui,
                'ditolak'=> $ditolak
            ]
        ], 200);
    } catch (\Throwable $th) {
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengambil data dashboard logbook',
            'error' => $th->getMessage()
        ], 500);
    }
   }
}
