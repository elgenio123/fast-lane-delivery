<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
