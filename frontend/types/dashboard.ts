export interface DashboardData {
    total_siswa: number;
    total_dudi: number;
    siswa_magang: number;
    logbook_hari_ini: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// types/dashboard.ts
export interface DudiDashboardData {
    dudi_aktif: number;
    siswa_magang_aktif: number;
    rata_rata_siswa_perusahaan: number;
}

export interface MagangDashboardData {
    total_siswa: number;
    aktif: number;
    selesai: number;
    pending: number;
}

export interface DudiItemProps {
    company: string;
    address: string;
    phone: string;
    studentCount: number;
}

export interface DudiType {
    id: number;
    nama_perusahaan: string;
    alamat: string;
    telepon: string;
    email: string;
    penanggung_jawab: string;
    status: string;
    student_count: number; // ditambahkan manual dari Controller
}

export interface MagangType {
    id: number;
    status: string;

    tanggal_mulai: string;
    tanggal_selesai: string;

    siswa: {
        id: number;
        nama: string;
    };

    dudi: {
        id: number;
        nama_perusahaan: string;
    };
}


export interface Logbook {
    id: number;
    magangId: number;
    tanggal: string;     // format ISO dari backend
    kegiatan: string;
    kendala: string | null;
    file: string | null;
    status_verifikasi: "pending" | "disetujui" | "ditolak";
    catatan_guru: string | null;
    catatan_dudi: string | null;
}
