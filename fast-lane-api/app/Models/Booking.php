<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Booking",
 *     type="object",
 *     @OA\Property(property="id", type="integer", readOnly=true, example=1),
 *     @OA\Property(property="customer_id", type="integer", example=12),
 *     @OA\Property(property="property_id", type="integer", example=3),
 *     @OA\Property(property="check_in_date", type="string", format="date", example="2025-12-20"),
 *     @OA\Property(property="check_out_date", type="string", format="date", example="2025-12-25"),
 *     @OA\Property(property="total_price", type="number", format="float", example=250000),
 *     @OA\Property(property="status", type="string", enum={"pending", "confirmed", "cancelled", "completed"}, example="pending"),
 *     @OA\Property(property="payment_status", type="string", example="unpaid"),
 *     @OA\Property(property="created_at", type="string", format="date-time", readOnly=true),
 *     @OA\Property(property="updated_at", type="string", format="date-time", readOnly=true),
 * )
 */
class Booking extends Model
{
    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory;

     protected $fillable = [
        'customer_id',
        'property_id',
        'check_in_date',
        'check_out_date',
        'total_price',
        'status',
        'payment_status',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
    ];

    // =================================================================
    //                       MODEL RELATIONSHIPS
    // =================================================================

    /**
     * Get the customer (user) who made the booking.
     * A booking belongs to one customer.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the property that was booked.
     * A booking belongs to one property.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
