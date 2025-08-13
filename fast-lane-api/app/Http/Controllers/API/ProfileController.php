<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/profile",
     *      summary="Get authenticated user's profile",
     *      tags={"Profile"},
     *      description="Returns the profile information of the currently logged-in user.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Response(
     *          response=200,
     *          description="Profile data retrieved successfully",
     *          @OA\JsonContent(
     *              type="object",
     *              ref="#/components/schemas/User"
     *          )
     *      ),
     *      @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Eager load relationships based on user type
        $relations = match ($user->type) {
            'driver' => ['driverProfile'],
            'host' => ['properties'],
            default => [],
        };

        $user->load($relations);

        return response()->json(compact('user'));
    }

    /**
     * @OA\Post(
     *      path="/api/profile",
     *      summary="Update authenticated user's profile",
     *      tags={"Profile"},
     *      description="Updates the profile information of the currently logged-in user.",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="name", type="string", example="John Doe Updated"),
     *              @OA\Property(property="email", type="string", example="john.updated@example.com")
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Profile updated successfully",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="message", type="string", example="Profile updated successfully."),
     *              @OA\Property(property="user", ref="#/components/schemas/User")
     *          )
     *      ),
     *      @OA\Response(response=400, description="Validation error"),
     *      @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user->update($validator->validated());

        $message = 'Profile updated successfully.';
        return response()->json(compact('message', 'user'));
    }
}
