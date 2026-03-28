<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DeliveryOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DeliveryOrderController extends Controller
{
    /**
     * List all delivery orders for the authenticated user.
     */
    public function index()
    {
        $user = Auth::user();
        $orders = DeliveryOrder::where('customer_id', $user->id)
            ->with(['driver:id,name,phone_number'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Create a new delivery order.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pickup_address' => 'required|string',
            'pickup_latitude' => 'required|numeric',
            'pickup_longitude' => 'required|numeric',
            'dropoff_address' => 'required|string',
            'dropoff_latitude' => 'required|numeric',
            'dropoff_longitude' => 'required|numeric',
            'package_description' => 'required|string|max:500',
            'payment_method' => 'required|in:mobile_money,cash',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }

        $validatedData = $validator->validated();
        $validatedData['customer_id'] = Auth::id();
        $validatedData['estimated_fare'] = $this->calculateFare(
            $request->pickup_latitude,
            $request->pickup_longitude,
            $request->dropoff_latitude,
            $request->dropoff_longitude
        );
        $validatedData['status'] = 'pending';
        $validatedData['payment_status'] = 'PENDING';

        $order = DeliveryOrder::create($validatedData);
        $order->load('customer:id,name');

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Order created successfully',
        ], 201);
    }

    /**
     * Get a specific delivery order.
     */
    public function show(DeliveryOrder $order)
    {
        if (Auth::id() !== $order->customer_id && Auth::id() !== $order->driver_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $order->load(['customer:id,name', 'driver:id,name,phone_number']);
        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Cancel a delivery order.
     */
    public function cancel(DeliveryOrder $order)
    {
        if (Auth::id() !== $order->customer_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if (!in_array($order->status, ['pending', 'accepted'])) {
            return response()->json(['success' => false, 'message' => 'Order cannot be cancelled in current state'], 400);
        }

        $order->update(['status' => 'cancelled']);
        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Order cancelled successfully',
        ]);
    }

    /**
     * Accept a delivery order (for drivers).
     */
    public function acceptOrder(DeliveryOrder $order)
    {
        if (Auth::user()->type !== 'driver' || $order->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'This order cannot be accepted'], 403);
        }

        $order->update([
            'driver_id' => Auth::id(),
            'status' => 'accepted',
        ]);

        $order->load('customer:id,name');
        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, DeliveryOrder $order)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,accepted,in_transit,delivered,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }

        $order->update(['status' => $request->status]);
        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Estimate fare for a delivery.
     */
    public function estimateFare(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pickup_latitude' => 'required|numeric',
            'pickup_longitude' => 'required|numeric',
            'dropoff_latitude' => 'required|numeric',
            'dropoff_longitude' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }

        $fare = $this->calculateFare(
            $request->pickup_latitude,
            $request->pickup_longitude,
            $request->dropoff_latitude,
            $request->dropoff_longitude
        );

        $distance = $this->haversineDistance(
            $request->pickup_latitude,
            $request->pickup_longitude,
            $request->dropoff_latitude,
            $request->dropoff_longitude
        );

        return response()->json([
            'success' => true,
            'data' => [
                'estimatedFare' => $fare,
                'distance' => round($distance, 2),
                'duration' => round($distance * 3, 0),
                'currency' => 'XAF',
            ],
        ]);
    }

    /**
     * Calculate estimated fare using Haversine distance.
     */
    private function calculateFare($pickupLat, $pickupLng, $dropoffLat, $dropoffLng): float
    {
        $distance = $this->haversineDistance($pickupLat, $pickupLng, $dropoffLat, $dropoffLng);
        $baseFare = 500;
        $perKmRate = 1000;
        return round(max($baseFare + ($distance * $perKmRate), 1000), 0);
    }

    /**
     * Calculate Haversine distance in km.
     */
    private function haversineDistance($lat1, $lon1, $lat2, $lon2): float
    {
        $R = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) ** 2 + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $R * $c;
    }
}
