<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SiswaController extends Controller
{
    public function getProfile()
    {
        $user = Auth::user();

        $siswa = Siswa::where('user_id', $user->id)->first();

        if (!$siswa) {
            return response()->json([
                'success' => false,
                'message' => 'Data siswa tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $siswa
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $siswa = Siswa::where('user_id', $user->id)->first();

        if (!$siswa) {
            return response()->json([
                'success' => false,
                'message' => 'Data siswa tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'alamat' => 'nullable|string|max:500',
            'telepon' => 'nullable|string|max:20'
        ]);

        $siswa->update([
            'alamat' => $request->alamat,
            'telepon' => $request->telepon
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $siswa
        ]);
    }
}
