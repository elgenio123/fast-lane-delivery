<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DeliveryOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Enums\DeliveryStatus;

class DeliveryOrderController extends Controller
{
    /**
     * @OA\Post(
     *      path="/api/delivery-orders",
     *      summary="Create a new delivery order",
     *      tags={"Delivery Orders"},
     *      description="Allows a customer to create a new delivery request.",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"pickup_address", "pickup_latitude", "pickup_longitude", "dropoff_address", "dropoff_latitude", "dropoff_longitude", "package_description", "payment_method"},
     *              @OA\Property(property="pickup_address", type="string", example="123 Pickup St, Yaoundé"),
     *              @OA\Property(property="pickup_latitude", type="number", format="float", example=3.866667),
     *              @OA\Property(property="pickup_longitude", type="number", format="float", example=11.516667),
     *              @OA\Property(property="dropoff_address", type="string", example="456 Dropoff Ave, Yaoundé"),
     *              @OA\Property(property="dropoff_latitude", type="number", format="float", example=3.875555),
     *              @OA\Property(property="dropoff_longitude", type="number", format="float", example=11.522222),
     *              @OA\Property(property="package_description", type="string", example="A small document"),
     *              @OA\Property(property="payment_method", type="string", enum={"mobile_money", "cash_on_delivery"}, example="mobile_money")
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Order created successfully",
     *          @OA\JsonContent(type="object", ref="#/components/schemas/DeliveryOrder")
     *      ),
     *      @OA\Response(response=400, description="Validation error"),
     *      @OA\Response(response=401, description="Unauthenticated")
     * )
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
            'payment_method' => ['required', Rule::in(['mobile_money', 'cash_on_delivery'])],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validatedData = $validator->validated();
        $validatedData['customer_id'] = Auth::id();
        $validatedData['estimated_fare'] = $this->calculateFare($request->pickup_latitude, $request->pickup_longitude, $request->dropoff_latitude, $request->dropoff_longitude);
        $validatedData['status'] = 'pending';

        $order = DeliveryOrder::create($validatedData);

        return response()->json(compact('order'), 201);
    }

    /**
     * @OA\Get(
     *      path="/api/delivery-orders/{order}",
     *      summary="Get a specific delivery order",
     *      tags={"Delivery Orders"},
     *      description="Retrieves the details of a single delivery order. Accessible by the customer or the assigned driver.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="order",
     *          in="path",
     *          required=true,
     *          description="ID of the delivery order",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(type="object", ref="#/components/schemas/DeliveryOrder")
     *      ),
     *      @OA\Response(response=403, description="Forbidden"),
     *      @OA\Response(response=404, description="Order not found")
     * )
     */
    public function show(DeliveryOrder $order)
    {
        if (Auth::id() !== $order->customer_id && Auth::id() !== $order->driver_id) {
            $message = 'You are not authorized to view this order.';
            return response()->json(compact('message'), 403);
        }

        $order->load(['customer:id,name', 'driver.driverProfile']);
        return response()->json(compact('order'));
    }


    /**
     * @OA\Post(
     *      path="/api/delivery-orders/{order}/accept",
     *      summary="Accept a delivery order",
     *      tags={"Delivery Orders"},
     *      description="Allows a driver to accept a pending delivery order.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="order",
     *          in="path",
     *          required=true,
     *          description="ID of the delivery order to accept",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Order accepted successfully",
     *          @OA\JsonContent(type="object", ref="#/components/schemas/DeliveryOrder")
     *      ),
     *      @OA\Response(response=403, description="Forbidden/Order cannot be accepted")
     * )
     */
    public function acceptOrder(DeliveryOrder $order)
    {
        if (Auth::user()->type !== 'driver' || $order->status !== 'pending') {
            $message = 'This order cannot be accepted.';
            return response()->json(compact('message'), 403);
        }

        $order->update([
            'driver_id' => Auth::id(),
            'status' => 'accepted',
        ]);

        $order->load('customer:id,name');
        return response()->json(compact('order'));
    }

    // NOTE: The rest of the controller methods (`updateStatus`, `calculateFare`, etc.) would follow the same refactoring pattern.

    /**
     * Calculate estimated fare based on pickup and dropoff coordinates.
     * This is a placeholder function. Implement your own fare calculation logic.
     */
    private function calculateFare($pickupLat, $pickupLng, $dropoffLat, $dropoffLng)
    {
        // Example logic: return a fixed fare for simplicity
        return 1000; // Replace with actual fare calculation logic
    }
    /**
     * @OA\Delete(
     *      path="/api/delivery-orders/{order}",
     *      summary="Cancel a delivery order",
     *      tags={"Delivery Orders"},
     *      description="Allows a customer to cancel their delivery order.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="order",
     *          in="path",
     *          required=true,
     *          description="ID of the delivery order to cancel",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Order cancelled successfully",
     *          @OA\JsonContent(type="object", ref="#/components/schemas/DeliveryOrder")
     *      ),
     *      @OA\Response(response=403, description="Forbidden/Order cannot be cancelled"),
     *      @OA\Response(response=404, description="Order not found")
     * )
     */
    public function updateStatus(DeliveryOrder $order, $orderStatus)
    {
        if (Auth::id() !== $order->customer_id || $order->status !== DeliveryStatus::PENDING->value) {
            $message = 'You are not authorized to change the status of this order.';
            return response()->json(compact('message'), 403);
        }

        $order->update(['status' => $orderStatus]);
        return response()->json(compact('order'));
    }
}
