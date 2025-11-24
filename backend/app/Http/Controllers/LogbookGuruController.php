<?php

namespace App\Http\Controllers;

use App\Models\Logbook;
use App\Http\Requests\StoreLogbookRequest;
use App\Http\Requests\UpdateLogbookRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LogbookGuruController extends Controller
{
    public function getAllLogbook()
    {
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
                    'belum_diverifikasi' => $belumDiverifikasi,
                    'disetujui' => $disetujui,
                    'ditolak' => $ditolak
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

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $search = $request->input('search', '');
            $status = $request->input('status', 'all');

            $logbooks = Logbook::with([
                'magang.siswa.user',
                'magang.dudi'
            ])
                ->search($search)
                ->byStatus($status)
                ->orderBy('tanggal', 'desc')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            // Transform data untuk frontend
            $logbooks->getCollection()->transform(function ($logbook) {
                return [
                    'id' => $logbook->id,
                    'magang_id' => $logbook->magang_id,
                    'tanggal' => $logbook->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $logbook->tanggal->format('d M Y'),
                    'kegiatan' => $logbook->kegiatan,
                    'kendala' => $logbook->kendala,
                    'file' => $logbook->file,
                    'status_verifikasi' => $logbook->status_verifikasi,
                    'catatan_guru' => $logbook->catatan_guru,
                    'catatan_dudi' => $logbook->catatan_dudi,
                    'siswa' => [
                        'id' => $logbook->magang->siswa->id ?? null,
                        'nama' => $logbook->magang->siswa->nama ?? 'N/A',
                        'nis' => $logbook->magang->siswa->nis ?? 'N/A',
                        'kelas' => $logbook->magang->siswa->kelas ?? 'N/A',
                        'jurusan' => $logbook->magang->siswa->jurusan ?? 'N/A',
                        'email' => $logbook->magang->siswa->email ?? 'N/A',
                    ],
                    'dudi' => [
                        'id' => $logbook->magang->dudi->id ?? null,
                        'nama_perusahaan' => $logbook->magang->dudi->nama_perusahaan ?? 'N/A',
                    ],
                    'created_at' => $logbook->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $logbook->updated_at->format('Y-m-d H:i:s'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $logbooks->items(),
                'meta' => [
                    'current_page' => $logbooks->currentPage(),
                    'last_page' => $logbooks->lastPage(),
                    'per_page' => $logbooks->perPage(),
                    'total' => $logbooks->total(),
                    'from' => $logbooks->firstItem(),
                    'to' => $logbooks->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data logbook',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $logbook = Logbook::with([
                'magang.siswa.user',
                'magang.dudi'
            ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $logbook->id,
                    'magang_id' => $logbook->magang_id,
                    'tanggal' => $logbook->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $logbook->tanggal->format('d M Y'),
                    'kegiatan' => $logbook->kegiatan,
                    'kendala' => $logbook->kendala,
                    'file' => $logbook->file,
                    'status_verifikasi' => $logbook->status_verifikasi,
                    'catatan_guru' => $logbook->catatan_guru,
                    'catatan_dudi' => $logbook->catatan_dudi,
                    'siswa' => [
                        'id' => $logbook->magang->siswa->id ?? null,
                        'nama' => $logbook->magang->siswa->nama ?? 'N/A',
                        'nis' => $logbook->magang->siswa->nis ?? 'N/A',
                        'kelas' => $logbook->magang->siswa->kelas ?? 'N/A',
                        'jurusan' => $logbook->magang->siswa->jurusan ?? 'N/A',
                        'email' => $logbook->magang->siswa->email ?? 'N/A',
                    ],
                    'dudi' => [
                        'id' => $logbook->magang->dudi->id ?? null,
                        'nama_perusahaan' => $logbook->magang->dudi->nama_perusahaan ?? 'N/A',
                    ],
                    'created_at' => $logbook->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $logbook->updated_at->format('Y-m-d H:i:s'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logbook tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // Update method untuk handle kegiatan, kendala, file, DAN status verifikasi
    public function update(Request $request, $id)
    {
        try {
            // Cari logbook dengan relasi magang
            $logbook = Logbook::with(['magang.siswa', 'magang.dudi'])->find($id);

            if (!$logbook) {
                return response()->json([
                    'success' => false,
                    'message' => 'Logbook tidak ditemukan'
                ], 404);
            }

            // Validasi input
            $request->validate([
                'kegiatan' => 'required|string|min:10',
                'kendala' => 'required|string|min:5',
                'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB
                'status_verifikasi' => 'nullable|in:pending,disetujui,ditolak',
                'catatan_guru' => 'nullable|string',
                'remove_file' => 'nullable|string',
            ]);

            // Prepare data untuk update
            $updateData = [
                'kegiatan' => $request->kegiatan,
                'kendala' => $request->kendala,
            ];

            // Handle status verifikasi jika ada
            if ($request->has('status_verifikasi')) {
                $updateData['status_verifikasi'] = $request->status_verifikasi;
            }

            // Handle catatan guru jika ada
            if ($request->has('catatan_guru')) {
                $updateData['catatan_guru'] = $request->catatan_guru;
            }

            // Handle file removal
            if ($request->remove_file == '1') {
                if ($logbook->file && Storage::disk('public')->exists($logbook->file)) {
                    Storage::disk('public')->delete($logbook->file);
                }
                $updateData['file'] = null;
            }
            // Handle file upload
            else if ($request->hasFile('file')) {
                // Delete old file if exists
                if ($logbook->file && Storage::disk('public')->exists($logbook->file)) {
                    Storage::disk('public')->delete($logbook->file);
                }
                // Store new file
                $filePath = $request->file('file')->store('logbook_files', 'public');
                $updateData['file'] = $filePath;
            }

            // Update logbook
            $logbook->update($updateData);

            // Reload relasi setelah update
            $logbook->load(['magang.siswa', 'magang.dudi']);

            return response()->json([
                'success' => true,
                'message' => 'Logbook berhasil diupdate',
                'data' => $logbook
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate logbook',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Method verifikasi tetap ada untuk verifikasi saja (tanpa edit konten)
    public function verifikasi(Request $request, $id)
    {
        try {
            $request->validate([
                'status_verifikasi' => 'required|in:pending,disetujui,ditolak',
                'catatan_guru' => 'nullable|string',
            ]);

            $logbook = Logbook::findOrFail($id);

            $logbook->update([
                'status_verifikasi' => $request->status_verifikasi,
                'catatan_guru' => $request->catatan_guru,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Verifikasi logbook berhasil',
                'data' => $logbook
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memverifikasi logbook',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Cari logbook
            $logbook = Logbook::find($id);

            if (!$logbook) {
                return response()->json([
                    'success' => false,
                    'message' => 'Logbook tidak ditemukan'
                ], 404);
            }

            // Delete file if exists
            if ($logbook->file && Storage::exists($logbook->file)) {
                Storage::delete($logbook->file);
            }

            // Delete logbook
            $logbook->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logbook berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus logbook'
            ], 500);
        }
    }
}
