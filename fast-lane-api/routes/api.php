<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\DeliveryOrderController;

// Public auth routes
Route::post('auth/register', [JWTAuthController::class, 'register']);
Route::post('auth/login', [JWTAuthController::class, 'login']);

// Protected routes
Route::middleware([JwtMiddleware::class])->group(function () {
    // Auth
    Route::get('user', [JWTAuthController::class, 'getUser']);
    Route::post('auth/logout', [JWTAuthController::class, 'logout']);

    // Profile
    Route::get('profile', [ProfileController::class, 'index']);
    Route::put('profile', [ProfileController::class, 'store']);
    Route::post('profile', [ProfileController::class, 'store']);

    // Delivery Orders
    Route::get('delivery-orders', [DeliveryOrderController::class, 'index']);
    Route::post('delivery-orders', [DeliveryOrderController::class, 'store']);
    Route::get('delivery-orders/{order}', [DeliveryOrderController::class, 'show']);
    Route::put('delivery-orders/{order}/cancel', [DeliveryOrderController::class, 'cancel']);
    Route::post('delivery-orders/{order}/accept', [DeliveryOrderController::class, 'acceptOrder']);
    Route::put('delivery-orders/{order}/status', [DeliveryOrderController::class, 'updateStatus']);
    Route::post('delivery-orders/estimate-fare', [DeliveryOrderController::class, 'estimateFare']);

    // Properties
    Route::get('properties', [PropertyController::class, 'index']);
    Route::post('properties', [PropertyController::class, 'store']);
    Route::get('properties/{id}', [PropertyController::class, 'show']);
    Route::put('properties/{id}', [PropertyController::class, 'update']);
    Route::delete('properties/{id}', [PropertyController::class, 'destroy']);
    Route::get('properties/{id}/reviews', [ReviewController::class, 'propertyReviews']);

    // Bookings
    Route::get('bookings', [BookingController::class, 'index']);
    Route::post('bookings', [BookingController::class, 'store']);
    Route::get('bookings/{id}', [BookingController::class, 'show']);
    Route::put('bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Reviews
    Route::post('reviews', [ReviewController::class, 'store']);
    Route::get('reviews', [ReviewController::class, 'index']);
});
