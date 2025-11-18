<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dudi extends Model
{
    use HasFactory;

    protected $table = 'dudi';

    protected $fillable = [
        'user_id',
        'nama_perusahaan',
        'alamat',
        'telepon',
        'email',
        'penanggung_jawab',
        'status'
    ];

    // ENUM values dari database
    const STATUS_AKTIF = 'aktif';
    const STATUS_NONAKTIF = 'nonaktif';
    const STATUS_PENDING = 'pending';

    public static function getStatuses()
    {
        return [
            self::STATUS_AKTIF,
            self::STATUS_NONAKTIF,
            self::STATUS_PENDING,
        ];
    }

    // Relationship dengan user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scope untuk status
    public function scopeAktif($query)
    {
        return $query->where('status', self::STATUS_AKTIF);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeNonaktif($query)
    {
        return $query->where('status', self::STATUS_NONAKTIF);
    }
}