<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    /** @use HasFactory<\Database\Factories\PropertyFactory> */
    use HasFactory;

     protected $fillable = [
        'host_id',
        'type',
        'name',
        'description',
        'address',
        'quarter',
        'latitude',
        'longitude',
        'price_per_night',
        'amenities',
        'photos',
        'is_verified',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_verified' => 'boolean',
        'amenities' => 'array', // Cast JSON amenities to array
        'photos' => 'array',    // Cast JSON photos to array
    ];

    // =================================================================
    //                       MODEL RELATIONSHIPS
    // =================================================================

    /**
     * Get the host (user) who owns the property.
     * A property belongs to one host.
     */
    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    /**
     * Get all bookings for the property.
     * A property can have many bookings.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get all of the property's reviews.
     * This is a polymorphic relationship.
     */
    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }
}
