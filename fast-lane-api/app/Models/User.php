<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\File;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
        'phone_number',
        'type',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['image_profile'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function getImageProfileAttribute() //: MorphMany
    {
        // $file = File::where('target_id', $this->id)->where('target_type', User::class)->first();
        // $file->path = str_replace('public', 'storage', $file->path);
        // return $file;
    }
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
     // =================================================================
    //                       MODEL RELATIONSHIPS
    // =================================================================

    /**
     * Get the driver profile associated with the user.
     * A user (driver) has one profile.
     */
    public function driverProfile()
    {
        return $this->hasOne(DriverProfile::class);
    }

    /**
     * Get the properties owned by the user (host).
     * A user (host) can have many properties.
     */
    public function properties()
    {
        return $this->hasMany(Property::class, 'host_id');
    }

    /**
     * Get the delivery orders placed by the user (customer).
     * A user (customer) can have many delivery orders.
     */
    public function deliveryOrdersAsCustomer()
    {
        return $this->hasMany(DeliveryOrder::class, 'customer_id');
    }

    /**
     * Get the delivery orders handled by the user (driver).
     * A user (driver) can handle many delivery orders.
     */
    public function deliveryOrdersAsDriver()
    {
        return $this->hasMany(DeliveryOrder::class, 'driver_id');
    }

    /**
     * Get the bookings made by the user (customer).
     * A user (customer) can have many bookings.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'customer_id');
    }

    /**
     * Get all reviews written by this user.
     */
    public function reviewsWritten()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Get all reviews written about this user (e.g., as a driver or customer).
     * This is a polymorphic relationship.
     */
    public function reviews()
    {
        return $this->morphMany(Review::class, 'reviewable');
    }
}
