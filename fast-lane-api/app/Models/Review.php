<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewFactory> */
    use HasFactory;

     protected $fillable = [
        'reviewer_id',
        'reviewable_id',
        'reviewable_type',
        'rating',
        'comment',
    ];

    // =================================================================
    //                       MODEL RELATIONSHIPS
    // =================================================================

    /**
     * Get the parent reviewable model (a property or a user).
     * This defines the polymorphic relationship.
     */
    public function reviewable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user who wrote the review.
     * A review belongs to one reviewer.
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
