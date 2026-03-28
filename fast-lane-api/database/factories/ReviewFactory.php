<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    public function definition(): array
    {
        $comments = [
            'Excellent place, very clean and well maintained!',
            'Good location, friendly host. Would recommend.',
            'Decent accommodation for the price.',
            'Amazing experience! Will definitely come back.',
            'Could be better. The water supply was inconsistent.',
            'Great value for money. Close to everything.',
            'Very comfortable and quiet neighborhood.',
            'The kitchen was well equipped. Loved it!',
            'Nice place but a bit far from the city center.',
            'Perfect for a short stay. Very convenient.',
            'Superb! Best guest house in the area.',
            'Host was very responsive and helpful.',
        ];

        return [
            'reviewer_id' => User::factory(),
            'reviewable_id' => Property::factory(),
            'reviewable_type' => 'App\\Models\\Property',
            'rating' => $this->faker->numberBetween(3, 5),
            'comment' => $this->faker->randomElement($comments),
        ];
    }
}
