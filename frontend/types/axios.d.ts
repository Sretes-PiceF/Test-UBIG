// types/axios.d.ts
import { AxiosError } from 'axios';

// Extended Axios error type untuk response data yang umum
export interface ApiErrorResponse {
    error?: string;
    message?: string;
    statusCode?: number;
    [key: string]: string;
}

// Type guard untuk memeriksa apakah error adalah AxiosError
export const isAxiosError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
    return (error as AxiosError).isAxiosError !== undefined;
};