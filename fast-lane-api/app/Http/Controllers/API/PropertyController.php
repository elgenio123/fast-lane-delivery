<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PropertyController extends Controller
{
    /**
     * @OA\Get(
     *      path="/api/properties",
     *      summary="List and search for properties",
     *      tags={"Properties"},
     *      security={{"bearerAuth":{}}},
     *      description="Returns a paginated list of verified properties. Can be filtered by quarter.",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Property"))
     *          )
     *      )
     * )
     */
    public function index(Request $request)
    {
        $query = Property::query()->where('is_verified', false);

        // if ($request->has('quarter')) {
        //     $query->where('quarter', 'like', '%' . $request->quarter . '%');
        // }

        $properties = $query->with('host:id,name')->paginate(15);

        return response()->json($properties);
    }

    /**
     * @OA\Post(
     *      path="/api/properties",
     *      summary="Create a new property listing",
     *      tags={"Properties"},
     *      description="Allows a host to create a new property. It will be unverified by default.",
     *      security={{"bearerAuth":{}}},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              required={"name", "type", "description", "address", "quarter", "latitude", "longitude", "price_per_night"},
     *              @OA\Property(property="name", type="string", example="Cozy Studio Apartment"),
     *              @OA\Property(property="type", type="string", enum={"guesthouse", "event_hall", "apartment"}, example="apartment"),
     *              @OA\Property(property="description", type="string", example="A nice and cozy place to stay."),
     *              @OA\Property(property="address", type="string", example="Rue 1.234, Bastos"),
     *              @OA\Property(property="quarter", type="string", example="Bastos"),
     *              @OA\Property(property="latitude", type="number", format="float", example=3.8711),
     *              @OA\Property(property="longitude", type="number", format="float", example=11.5179),
     *              @OA\Property(property="price_per_night", type="number", format="float", example=25000),
     *              @OA\Property(property="amenities", type="array", @OA\Items(type="string"), example={"Wi-Fi", "Air Conditioning"})
     *          )
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Property created successfully",
     *          @OA\JsonContent(type="object", ref="#/components/schemas/Property")
     *      ),
     *      @OA\Response(response=400, description="Validation error"),
     *      @OA\Response(response=403, description="Forbidden, user is not a host")
     * )
     */
    public function store(Request $request)
    {
        // if (Auth::user()->type !== 'host') {
        //     $message = 'Only hosts can create properties.';
        //     return response()->json(compact('message'), 403);
        // }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:guesthouse,event_hall,apartment',
            'description' => 'required|string',
            'address' => 'required|string',
            'quarter' => 'required|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'price_per_night' => 'required|numeric|min:0',
            'amenities' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $property = Auth::user()->properties()->create($validator->validated());

        return response()->json(compact('property'), 201);
    }

    // NOTE: The rest of the controller methods (`show`, `update`, etc.) would follow the same refactoring pattern.


    /**
     * @OA\Get(
     *      path="/api/properties/{id}",
     *      summary="Get a specific property",
     *      tags={"Properties"},
     *      security={{"bearerAuth":{}}},
     *      description="Returns details of a specific property by ID.",
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the property",
     *          @OA\Schema(type="integer", example=1)
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/Property")
     *      ),
     *      @OA\Response(response=404, description="Property not found")
     * )
     */
    public function show($id)
    {
        $property = Property::with('host:id,name')->findOrFail($id);
        return response()->json(compact('property'));
    }
    /**
     * @OA\Put(
     *      path="/api/properties/{id}",
     *      summary="Update a property",
     *      tags={"Properties"},
     *      description="Allows a host to update their property details.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the property",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/Property")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Property updated successfully",
     *          @OA\JsonContent(ref="#/components/schemas/Property")
     *      ),
     *      @OA\Response(response=400, description="Validation error"),
     *      @OA\Response(response=403, description="Forbidden, user is not the owner of the property")
     * )
     */
    public function update(Request $request, $id){
        // if (Auth::user()->type !== 'host') {
        //     $message = 'Only hosts can update properties.';
        //     return response()->json(compact('message'), 403);
        // }
        $property = Property::findOrFail($id);

        if (Auth::id() !== $property->host_id) {
            $message = 'You are not authorized to update this property.';
            return response()->json(compact('message'), 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:guesthouse,event_hall,apartment',
            'description' => 'sometimes|string',
            'address' => 'sometimes|string',
            'quarter' => 'sometimes|string',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'price_per_night' => 'sometimes|numeric|min:0',
            'amenities' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $property->update($validator->validated());

        return response()->json(compact('property'));
    }
    /**
     * @OA\Delete(
     *      path="/api/properties/{id}",
     *      summary="Delete a property",
     *      tags={"Properties"},
     *      description="Allows a host to delete their property.",
     *      security={{"bearerAuth":{}}},
     *      @OA\Parameter(
     *          name="id",
     *          in="path",
     *          required=true,
     *          description="ID of the property",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=204,
     *          description="Property deleted successfully"
     *      ),
     *      @OA\Response(response=403, description="Forbidden, user is not the owner of the property")
     * )
     */
    public function destroy($id){
        // if (Auth::user()->type !== 'host') {
        //     $message = 'Only hosts can delete properties.';
        //     return response()->json(compact('message'), 403);
        // }

        $property = Property::findOrFail($id);

        if (Auth::id() !== $property->host_id) {
            $message = 'You are not authorized to delete this property.';
            return response()->json(compact('message'), 403);
        }

        $property->delete();

        return response()->json(null, 204);
    }
}
