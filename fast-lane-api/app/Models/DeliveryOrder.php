<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="DeliveryOrder",
 *     type="object",
 *     title="Delivery Order Schema",
 *     @OA\Property(property="id", type="integer", readOnly=true),
 *     @OA\Property(property="customer_id", type="integer"),
 *     @OA\Property(property="driver_id", type="integer", nullable=true),
 *     @OA\Property(property="status", type="string", enum={"pending", "accepted", "in_transit", "delivered", "cancelled"}),
 *     @OA\Property(property="pickup_address", type="string"),
 *     @OA\Property(property="dropoff_address", type="string"),
 *     @OA\Property(property="estimated_fare", type="number", format="float"),
 *     @OA\Property(property="payment_method", type="string", enum={"mobile_money", "cash_on_delivery"}),
 *     @OA\Property(property="created_at", type="string", format="date-time", readOnly=true),
 *     @OA\Property(property="updated_at", type="string", format="date-time", readOnly=true),
 * )
 */
class DeliveryOrder extends Model
{
    /** @use HasFactory<\Database\Factories\DeliveryOrderFactory> */
    use HasFactory;

     protected $fillable = [
        'customer_id',
        'driver_id',
        'status',
        'pickup_address',
        'pickup_latitude',
        'pickup_longitude',
        'dropoff_address',
        'dropoff_latitude',
        'dropoff_longitude',
        'package_description',
        'estimated_fare',
        'payment_method',
        'payment_status',
    ];

    // =================================================================
    //                       MODEL RELATIONSHIPS
    // =================================================================

    /**
     * Get the customer (user) who placed the order.
     * An order belongs to one customer.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the driver (user) assigned to the order.
     * An order belongs to one driver.
     */
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
