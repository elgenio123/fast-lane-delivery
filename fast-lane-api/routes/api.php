<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;


// Route::name('auth.')->group(function () {
//     // Authentication routes

// });

Route::post('register', [JWTAuthController::class, 'register'])->name('register');
    Route::post('login', [JWTAuthController::class, 'login'])->name('login');

    Route::middleware([JwtMiddleware::class])->group(function () {
        Route::get('user', [JWTAuthController::class, 'getUser'])->name('user');
        Route::post('logout', [JWTAuthController::class, 'logout'])->name('logout');
    });
