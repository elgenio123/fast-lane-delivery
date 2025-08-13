<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\ProfileController;

Route::name('auth.')->group(function () {
    // Authentication routes

    Route::post('register', [JWTAuthController::class, 'register'])->name('register');
    Route::post('login', [JWTAuthController::class, 'login'])->name('login');

    Route::middleware([JwtMiddleware::class])->group(function () {
        Route::get('user', [JWTAuthController::class, 'getUser'])->name('user');
        Route::post('logout', [JWTAuthController::class, 'logout'])->name('logout');
    });

});


Route::middleware([JwtMiddleware::class])->group(function () {
    // Protected routes that require authentication
    Route::apiResource('bookings', BookingController::class);
    Route::apiResource('reviews', ReviewController::class);
    Route::apiResource('properties', PropertyController::class);
    Route::apiResource('profile', ProfileController::class);
});
