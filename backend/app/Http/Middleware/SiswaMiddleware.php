<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SiswaMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Debug: cek user yang terautentikasi
        \Log::info('SiswaMiddleware - User:', [
            'user_id' => Auth::id(),
            'role' => Auth::user()?->role,
            'token' => $request->bearerToken()
        ]);

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.'
            ], 401);
        }

        if (Auth::user()->role !== 'siswa') {
            \Log::warning('SiswaMiddleware - Access denied for role:', ['role' => Auth::user()->role]);
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Siswa role required.'
            ], 403);
        }

        return $next($request);
    }
}
