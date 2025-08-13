<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Property",
 *     type="object",
 *     @OA\Property(property="id", type="integer", readOnly=true, example=1),
 *     @OA\Property(property="host_id", type="integer", example=2),
 *     @OA\Property(property="type", type="string", enum={"guesthouse", "event_hall", "apartment"}, example="guesthouse"),
 *     @OA\Property(property="name", type="string", example="Villa Krystal"),
 *     @OA\Property(property="description", type="string", example="A beautiful villa with a pool."),
 *     @OA\Property(property="address", type="string", example="Rue 1.111, Nkolbisson"),
 *     @OA\Property(property="quarter", type="string", example="Nkolbisson"),
 *     @OA\Property(property="latitude", type="number", format="float", example=3.8711),
 *     @OA\Property(property="longitude", type="number", format="float", example=11.5179),
 *     @OA\Property(property="price_per_night", type="number", format="float", example=50000),
 *     @OA\Property(property="amenities", type="array", @OA\Items(type="string"), example={"Wi-Fi", "Pool", "Air Conditioning"}),
 *     @OA\Property(property="photos", type="array", @OA\Items(type="string", format="uri"), example={"http://example.com/img1.jpg"}),
 *     @OA\Property(property="is_verified", type="boolean", readOnly=true, example=true),
 *     @OA\Property(property="created_at", type="string", format="date-time", readOnly=true),
 *     @OA\Property(property="updated_at", type="string", format="date-time", readOnly=true),
 * )
 */

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
