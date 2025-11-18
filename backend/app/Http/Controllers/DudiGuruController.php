<?php

namespace App\Http\Controllers;

use App\Models\Dudi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DudiGuruController extends Controller
{
    /**
     * Get semua data DUDI (Guru bisa akses)
     */
    public function getAllDudi(Request $request)
    {
        // Check guru role
        if (!Auth::user()->isGuru()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Guru role required.'
            ], 403);
        }

        $query = Dudi::with('user');

        // Filter by status
        if ($request->has('status') && in_array($request->status, Dudi::getStatuses())) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_perusahaan', 'ILIKE', "%{$search}%")
                  ->orWhere('penanggung_jawab', 'ILIKE', "%{$search}%")
                  ->orWhere('email', 'ILIKE', "%{$search}%");
            });
        }

        $dudi = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $dudi,
            'total' => $dudi->count()
        ]);
    }

    /**
     * Get detail DUDI by ID (Guru bisa akses)
     */
    public function getDudiById($id)
    {
        // Check guru role
        if (!Auth::user()->isGuru()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Guru role required.'
            ], 403);
        }

        $dudi = Dudi::with('user')->find($id);

        if (!$dudi) {
            return response()->json([
                'success' => false,
                'message' => 'Data DUDI tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $dudi
        ]);
    }

    /**
     * Create DUDI baru oleh Guru
     */
    public function createDudi(Request $request)
    {
        // Check guru role
        if (!Auth::user()->isGuru()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Guru role required.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nama_perusahaan' => 'required|string|max:255',
            'alamat' => 'required|string',
            'telepon' => 'required|string|max:20',
            'email' => 'required|email|unique:dudi,email',
            'penanggung_jawab' => 'required|string|max:255',
            'status' => 'required|in:' . implode(',', Dudi::getStatuses())
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            // Create user untuk DUDI
            $user = User::create([
                'name' => $request->nama_perusahaan,
                'email' => $request->email, // email perusahaan jadi email login
                'password' => bcrypt('password123'), // default password
                'role' => User::ROLE_DUDI
            ]);

            // Create dudi
            $dudi = Dudi::create([
                'user_id' => $user->id,
                'nama_perusahaan' => $request->nama_perusahaan,
                'alamat' => $request->alamat,
                'telepon' => $request->telepon,
                'email' => $request->email,
                'penanggung_jawab' => $request->penanggung_jawab,
                'status' => $request->status
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data DUDI berhasil dibuat',
                'data' => $dudi->load('user')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat data DUDI: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update DUDI oleh Guru
     */
    public function updateDudi(Request $request, $id)
    {
        // Check guru role
        if (!Auth::user()->isGuru()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Guru role required.'
            ], 403);
        }

        $dudi = Dudi::with('user')->find($id);
        
        if (!$dudi) {
            return response()->json([
                'success' => false,
                'message' => 'Data DUDI tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_perusahaan' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|required|string',
            'telepon' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|unique:dudi,email,' . $id,
            'penanggung_jawab' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:' . implode(',', Dudi::getStatuses())
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            // Update dudi
            $dudi->update($request->only([
                'nama_perusahaan', 'alamat', 'telepon', 'email', 'penanggung_jawab', 'status'
            ]));

            // Update user jika email berubah
            if ($request->has('email') || $request->has('nama_perusahaan')) {
                $userData = [];
                if ($request->has('email')) {
                    $userData['email'] = $request->email;
                }
                if ($request->has('nama_perusahaan')) {
                    $userData['name'] = $request->nama_perusahaan;
                }
                $dudi->user->update($userData);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data DUDI berhasil diupdate',
                'data' => $dudi->load('user')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate data DUDI: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete DUDI oleh Guru
     */
    public function deleteDudi($id)
    {
        // Check guru role
        if (!Auth::user()->isGuru()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Guru role required.'
            ], 403);
        }

        DB::beginTransaction();
        
        try {
            $dudi = Dudi::find($id);
            
            if (!$dudi) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data DUDI tidak ditemukan'
                ], 404);
            }

            $user_id = $dudi->user_id;

            // Delete dudi
            $dudi->delete();

            // Delete user
            User::where('id', $user_id)->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data DUDI berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data DUDI: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get DUDI statistics untuk Guru
     */
    public function getStatistics()
    {
        // Check guru role
        if (!Auth::user()->isGuru()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Guru role required.'
            ], 403);
        }

        $total = Dudi::count();
        $aktif = Dudi::where('status', Dudi::STATUS_AKTIF)->count();
        $pending = Dudi::where('status', Dudi::STATUS_PENDING)->count();
        $nonaktif = Dudi::where('status', Dudi::STATUS_NONAKTIF)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'aktif' => $aktif,
                'pending' => $pending,
                'nonaktif' => $nonaktif
            ]
        ]);
    }
}