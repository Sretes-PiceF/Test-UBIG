<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logbook extends Model
{
    use HasFactory;

    protected $fillable = [
        'magang_id',
        'tanggal',
        'kegiatan',
        'kendala',
        'file',
        'status_verifikasi',
        'catatan_guru',
        'catatan_dudi'
    ];

    // ENUM values dari database
    const STATUS_PENDING = 'pending';
    const STATUS_DISETUJUI = 'disetujui';
    const STATUS_DITOLAK = 'ditolak';

    public static function getStatuses()
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_DISETUJUI,
            self::STATUS_DITOLAK,
        ];
    }

    // Relationship dengan magang
    public function magang()
    {
        return $this->belongsTo(Magang::class);
    }
}