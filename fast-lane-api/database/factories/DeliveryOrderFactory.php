<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeliveryOrderFactory extends Factory
{
    public function definition(): array
    {
        $statuses = ['pending', 'accepted', 'in_transit', 'delivered', 'cancelled'];
        $pickupLocations = [
            ['address' => 'Carrefour Bastos, Yaoundé', 'lat' => 3.8812, 'lng' => 11.5021],
            ['address' => 'Marché Mokolo, Yaoundé', 'lat' => 3.8711, 'lng' => 11.5104],
            ['address' => 'Poste Centrale, Yaoundé', 'lat' => 3.8667, 'lng' => 11.5167],
            ['address' => 'Carrefour Nlongkak, Yaoundé', 'lat' => 3.8756, 'lng' => 11.5089],
            ['address' => 'Total Essos, Yaoundé', 'lat' => 3.8634, 'lng' => 11.5234],
            ['address' => 'Rond-point Express, Douala', 'lat' => 4.0511, 'lng' => 9.7679],
            ['address' => 'Marché Central, Douala', 'lat' => 4.0467, 'lng' => 9.7044],
        ];

        $dropoffLocations = [
            ['address' => 'Université de Yaoundé I, Ngoa-Ekelle', 'lat' => 3.8600, 'lng' => 11.4970],
            ['address' => 'Hôpital Central, Yaoundé', 'lat' => 3.8667, 'lng' => 11.5217],
            ['address' => 'Biyem-Assi Market, Yaoundé', 'lat' => 3.8445, 'lng' => 11.4892],
            ['address' => 'Hotel Hilton, Yaoundé', 'lat' => 3.8720, 'lng' => 11.5194],
            ['address' => 'Mvan Junction, Yaoundé', 'lat' => 3.8356, 'lng' => 11.5190],
            ['address' => 'Bonamoussadi, Douala', 'lat' => 4.0787, 'lng' => 9.7357],
            ['address' => 'Aéroport de Douala', 'lat' => 4.0061, 'lng' => 9.7194],
        ];

        $packages = [
            'Small document envelope', 'Electronics package', 'Food delivery',
            'Clothing items', 'Books and stationery', 'Medical supplies',
            'Gift box', 'Business documents', 'Phone accessories',
            'Household items', 'Computer parts', 'Personal effects',
        ];

        $pickup = $this->faker->randomElement($pickupLocations);
        $dropoff = $this->faker->randomElement($dropoffLocations);

        return [
            'customer_id' => User::factory(),
            'driver_id' => null,
            'status' => $this->faker->randomElement($statuses),
            'pickup_address' => $pickup['address'],
            'pickup_latitude' => $pickup['lat'],
            'pickup_longitude' => $pickup['lng'],
            'dropoff_address' => $dropoff['address'],
            'dropoff_latitude' => $dropoff['lat'],
            'dropoff_longitude' => $dropoff['lng'],
            'package_description' => $this->faker->randomElement($packages),
            'estimated_fare' => $this->faker->randomElement([1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000]),
            'payment_method' => $this->faker->randomElement(['cash', 'mobile_money']),
            'payment_status' => 'PENDING',
        ];
    }
}
