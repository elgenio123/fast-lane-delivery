<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Review",
 *     type="object",
 *     @OA\Property(property="id", type="integer", readOnly=true, example=1),
 *     @OA\Property(property="reviewer_id", type="integer", example=12),
 *     @OA\Property(property="reviewable_id", type="integer", description="ID of the item being reviewed (e.g., property_id, user_id)", example=3),
 *     @OA\Property(property="reviewable_type", type="string", description="Model name of the item being reviewed", example="App\Models\Property"),
 *     @OA\Property(property="rating", type="integer", minimum=1, maximum=5, example=5),
 *     @OA\Property(property="comment", type="string", nullable=true, example="It was a wonderful experience!"),
 *     @OA\Property(property="created_at", type="string", format="date-time", readOnly=true),
 * )
 */
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
