<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
