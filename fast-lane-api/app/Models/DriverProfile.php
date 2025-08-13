<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DriverProfile extends Model
{
    /** @use HasFactory<\Database\Factories\DriverProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_type',
        'vehicle_plate_number',
        'is_verified',
        'documents',
        'latitude',
        'longitude',
        'is_available',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_verified' => 'boolean',
        'is_available' => 'boolean',
        'documents' => 'array', // Automatically cast the JSON column to an array
    ];

    // =================================================================
    //                       MODEL RELATIONSHIPS
    // =================================================================

    /**
     * Get the user that owns this driver profile.
     * A driver profile belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
