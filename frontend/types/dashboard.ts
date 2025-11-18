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