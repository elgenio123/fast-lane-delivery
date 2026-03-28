<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('now', '+3 months');
        $checkOut = (clone $checkIn)->modify('+' . $this->faker->numberBetween(1, 7) . ' days');

        return [
            'customer_id' => User::factory(),
            'property_id' => Property::factory(),
            'check_in_date' => $checkIn->format('Y-m-d'),
            'check_out_date' => $checkOut->format('Y-m-d'),
            'total_price' => $this->faker->randomElement([15000, 25000, 40000, 50000, 75000, 100000, 150000]),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled', 'completed']),
            'payment_status' => 'PENDING',
        ];
    }
}
