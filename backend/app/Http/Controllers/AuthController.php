<?php

namespace App\Http\Controllers;

use App\Models\Guru;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function registerSiswa(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'nis' => 'required|unique:siswa',
            'kelas' => 'required|string|max:50',
            'jurusan' => 'required|string|max:100',
            'alamat' => 'nullable|string',
            'telepon' => 'nullable|string|max:15'
        ]);

        DB::beginTransaction();

        try {
            // Create user
            $user = User::create([
                'name' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'siswa'
            ]);

            // Create siswa
            Siswa::create([
                'user_id' => $user->id,
                'nama' => $request->nama,
                'nis' => $request->nis,
                'kelas' => $request->kelas,
                'jurusan' => $request->jurusan,
                'alamat' => $request->alamat,
                'telepon' => $request->telepon
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registrasi siswa berhasil'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Registrasi gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function registerGuru(Request $request)
    {

        $request->validate([
            'nip' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'alamat' => 'required',
            'telepon' => 'required|string|min:12',
        ]);

        DB::beginTransaction();

        try {
            // Create user
            $user = User::create([
                'name' => $request->nama,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'guru'
            ]);

            // Create siswa
            Guru::create([
                'user_id' => $user->id,
                'nama' => $request->nama,
                'nip' => $request->nip,
                'alamat' => $request->alamat,
                'telepon' => $request->telepon
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Registrasi admin berhasil'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Registrasi gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Coba login
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();

            // Hapus hanya token lama untuk device yang sama (optional)
            // Atau biarkan multiple devices login
            // $user->tokens()->where('name', 'auth_token')->delete();

            // Buat token baru
            $token = $user->createToken('auth_token')->plainTextToken;

            // Response data berdasarkan role
            $responseData = [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ],
                'token' => $token,
                'token_type' => 'Bearer'
            ];

            // Tambahkan data spesifik berdasarkan role
            if ($user->isSiswa() && $user->siswa) {
                $responseData['siswa'] = $user->siswa;
            } elseif ($user->isGuru() && $user->guru) {
                $responseData['guru'] = $user->guru;
            } elseif ($user->isDudi() && $user->dudi) {
                $responseData['dudi'] = $user->dudi;
            }

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => $responseData
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Mohon check email dan password anda!'
        ], 401);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        try {
            // Hapus token yang sedang digunakan
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current user data
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]
        ]);
    }
}
