<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DriverProfileFactory extends Factory
{
    public function definition(): array
    {
        $vehicleTypes = ['motorcycle', 'car', 'van', 'truck'];
        $platePrefixes = ['LT', 'CE', 'NW', 'SW', 'EN', 'AD', 'NO', 'OU', 'ES', 'SU'];

        return [
            'user_id' => User::factory(),
            'vehicle_type' => $this->faker->randomElement($vehicleTypes),
            'vehicle_plate_number' => $this->faker->randomElement($platePrefixes) . '-' . $this->faker->numberBetween(1000, 9999) . '-' . $this->faker->randomLetter() . $this->faker->randomLetter(),
            'is_verified' => $this->faker->boolean(80),
            'documents' => json_encode(['license' => 'doc_' . $this->faker->uuid . '.pdf']),
            'latitude' => $this->faker->latitude(3.8, 4.1),
            'longitude' => $this->faker->longitude(9.6, 11.6),
            'is_available' => $this->faker->boolean(70),
        ];
    }
}
