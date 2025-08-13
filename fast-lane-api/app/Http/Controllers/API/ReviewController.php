<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    /**
     * @OA\Post(
     *      path="/api/reviews",
     *      summary="Submit a review",
     *      tags={"Reviews"},
     *      description="Submits a review for a property or a user (e.g., a driver).",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"reviewable_id", "reviewable_type", "rating"},
     *              @OA\Property(property="reviewable_id", type="integer", description="ID of the item to review", example=3),
     *              @OA\Property(property="reviewable_type", type="string", enum={"property", "user"}, description="Type of item to review ('property' or 'user')", example="property"),
     *              @OA\Property(property="rating", type="integer", minimum=1, maximum=5, example=5),
     *              @OA\Property(property="comment", type="string", nullable=true, example="Excellent service!")
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Review submitted successfully",
     *          @OA\JsonContent(type="object", @OA\Property(property="review", ref="#/components/schemas/Review"))
     *      ),
     *      @OA\Response(response=400, description="Validation error"),
     *      @OA\Response(response=401, description="Unauthenticated"),
     *      @OA\Response(response=422, description="Unprocessable Entity (e.g., target not found)")
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'reviewable_id' => 'required|integer',
            'reviewable_type' => ['required', Rule::in(['property', 'user'])],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validatedData = $validator->validated();

        // Map the short type to the full model class name
        $modelMap = [
            'property' => \App\Models\Property::class,
            'user' => \App\Models\User::class,
        ];
        $modelClass = $modelMap[$validatedData['reviewable_type']];

        // Check if the entity to be reviewed actually exists
        $reviewable = $modelClass::find($validatedData['reviewable_id']);
        if (!$reviewable) {
            $message = "The selected {$validatedData['reviewable_type']} to review was not found.";
            return response()->json(compact('message'), 422);
        }

        // Prevent users from reviewing something multiple times
        $existingReview = Review::where('reviewer_id', Auth::id())
                                ->where('reviewable_id', $validatedData['reviewable_id'])
                                ->where('reviewable_type', $modelClass)
                                ->exists();

        if ($existingReview) {
            $message = 'You have already submitted a review for this item.';
            return response()->json(compact('message'), 422);
        }

        // In a real app, you should add logic here to ensure a user can only review
        // a property they've booked or a driver who has completed a delivery for them.

        $review = $reviewable->reviews()->create([
            'reviewer_id' => Auth::id(),
            'rating' => $validatedData['rating'],
            'comment' => $validatedData['comment'] ?? null,
        ]);

        return response()->json(compact('review'), 201);
    }
    /**
     * @OA\Get(
     *      path="/api/reviews",
     *      summary="List reviews",
     *      tags={"Reviews"},
     *      description="Retrieves a list of reviews for a specific property or user.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="reviewable_id",
     *          in="query",
     *          required=true,
     *          description="ID of the item to retrieve reviews for",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Parameter(
     *          name="reviewable_type",
     *          in="query",
     *          required=true,
     *          description="Type of item to retrieve reviews for ('property' or 'user')",
     *          @OA\Schema(type="string", enum={"property", "user"})
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="List of reviews retrieved successfully",
     *          @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Review"))
     *      ),
     *      @OA\Response(response=400, description="Validation error"),
     *      @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request){
        $validator = Validator::make($request->all(), [
            'reviewable_id' => 'required|integer',
            'reviewable_type' => ['required', Rule::in(['property', 'user'])],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $validatedData = $validator->validated();

        // Map the short type to the full model class name
        $modelMap = [
            'property' => \App\Models\Property::class,
            'user' => \App\Models\User::class,
        ];
        $modelClass = $modelMap[$validatedData['reviewable_type']];

        // Check if the entity to be reviewed actually exists
        $reviewable = $modelClass::find($validatedData['reviewable_id']);
        if (!$reviewable) {
            $message = "The selected {$validatedData['reviewable_type']} to retrieve reviews for was not found.";
            return response()->json(compact('message'), 422);
        }

        $reviews = $reviewable->reviews()->with('reviewer')->get();

        return response()->json(compact('reviews'), 200);
    }
}
