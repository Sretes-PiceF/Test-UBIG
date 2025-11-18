<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class GuruMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Debug: cek user yang terautentikasi
        \Log::info('GuruMiddleware - User:', [
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

        if (Auth::user()->role !== 'guru') {
            \Log::warning('GuruMiddleware - Access denied for role:', ['role' => Auth::user()->role]);
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Guru role required.'
            ], 403);
        }

        return $next($request);
    }
}
