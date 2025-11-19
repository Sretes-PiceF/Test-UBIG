// utils/error-handler.ts
import { isAxiosError } from '@/types/axios';

export interface ErrorHandlerOptions {
    defaultMessage?: string;
    showStatusCode?: boolean;
}

export const handleApiError = (
    error: unknown,
    options: ErrorHandlerOptions = {}
): string => {
    const {
        defaultMessage = "Terjadi kesalahan tak terduga",
        showStatusCode = true
    } = options;

    if (isAxiosError(error)) {
        const serverMessage =
            error.response?.data?.error ||
            error.response?.data?.message;

        const errorMessage =
            serverMessage ||
            error.message ||
            "Gagal memuat data";

        if (showStatusCode) {
            return `Error ${error.response?.status || 'Unknown'}: ${errorMessage}`;
        }

        return errorMessage;
    }

    // Handle native Error
    if (error instanceof Error) {
        return error.message;
    }

    return defaultMessage;
};

export const logError = (error: unknown, context?: string): void => {
    if (isAxiosError(error)) {
        console.error(`${context ? context + ' - ' : ''}API Error:`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
    } else {
        console.error(`${context ? context + ' - ' : ''}Unknown Error:`, error);
    }
};