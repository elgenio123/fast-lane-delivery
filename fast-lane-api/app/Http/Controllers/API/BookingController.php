<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * @OA\Post(
     *      path="/api/bookings",
     *      summary="Create a new booking",
     *      tags={"Bookings"},
     *      description="Allows a customer to book a property for a specified date range.",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"property_id", "check_in_date", "check_out_date"},
     *              @OA\Property(property="property_id", type="integer", example=3),
     *              @OA\Property(property="check_in_date", type="string", format="date", example="2025-12-20"),
     *              @OA\Property(property="check_out_date", type="string", format="date", example="2025-12-25"),
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Booking created successfully",
     *          @OA\JsonContent(type="object", @OA\Property(property="booking", ref="#/components/schemas/Booking"))
     *      ),
     *      @OA\Response(response=400, description="Validation error"),
     *      @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'property_id' => 'required|exists:properties,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validatedData = $validator->validated();
        $property = Property::find($validatedData['property_id']);

        // Advanced validation: In a real app, you must check here for booking overlaps to prevent double booking.

        $checkIn = new \DateTime($validatedData['check_in_date']);
        $checkOut = new \DateTime($validatedData['check_out_date']);
        $nights = $checkOut->diff($checkIn)->days;

        $totalPrice = $nights * $property->price_per_night;

        $booking = Booking::create([
            'customer_id' => Auth::id(),
            'property_id' => $property->id,
            'check_in_date' => $validatedData['check_in_date'],
            'check_out_date' => $validatedData['check_out_date'],
            'total_price' => $totalPrice,
            'status' => 'pending', // Becomes 'confirmed' after successful payment
        ]);

        return response()->json(compact('booking'), 201);
    }

    /**
     * @OA\Get(
     *      path="/api/bookings",
     *      summary="List user's bookings",
     *      tags={"Bookings"},
     *      description="Retrieves a list of bookings. Customers see their own bookings. Hosts see bookings for their properties.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(
     *          response=200,
     *          description="Bookings retrieved successfully",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="bookings", type="array", @OA\Items(ref="#/components/schemas/Booking"))
     *          )
     *      ),
     *      @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->type === 'host') {
            $propertyIds = $user->properties()->pluck('id');
            $bookings = Booking::whereIn('property_id', $propertyIds)->with('customer:id,name', 'property:id,name')->latest()->get();
        } else {
            $bookings = $user->bookings()->with('property:id,name')->latest()->get();
        }

        return response()->json(compact('bookings'));
    }
}
