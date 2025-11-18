<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DudiGuruController;
use App\Http\Controllers\SiswaController;
use App\Http\Middleware\GuruMiddleware;
use App\Http\Middleware\SiswaMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register/siswa', [AuthController::class, 'registerSiswa']);
Route::post('/register/guru', [AuthController::class, 'registerGuru']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes - butuh authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::middleware(SiswaMiddleware::class)->group(function () {
        Route::get('/siswa/profile', [SiswaController::class, 'getProfile']);
        Route::put('/siswa/profile', [SiswaController::class, 'updateProfile']);
        Route::get('/siswa/dashboard', [SiswaController::class, 'dashboard']);
    });
});

Route::middleware('auth:sanctum')->group(function (){
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::middleware(GuruMiddleware::class)->group(function (){

        //Route DASHBOARD
        Route::get();
        Route::get();
        Route::post();
        Route::patch();
        Route::delete();

        //Route DUDI
        Route::get('/guru/dudi', [DudiGuruController::class, 'getAllDudi']);
        Route::get('/guru/dudi/{id}', [DudiGuruController::class, 'getDudiById']);
        Route::post('/guru/create/dudi', [DudiGuruController::class, 'createDudi']);
        Route::patch('/guru/update/dudi/{id}', [DudiGuruController::class, 'updateDudi']);
        Route::delete('/guru/delete/dudi{id}', [DudiGuruController::class, 'deleteDudi']);
        Route::get('/guru/status/dudi', [DudiGuruController::class, 'getStatistics']);


        //Route MAGANG
        Route::get();
        Route::get();
        Route::post();
        Route::patch();
        Route::delete();


        //Route LOGBOOK
        Route::get();
        Route::get();
        Route::post();
        Route::patch();
        Route::delete();

    });
});