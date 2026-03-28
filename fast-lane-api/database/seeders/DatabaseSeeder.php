<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DriverProfile;
use App\Models\Property;
use App\Models\DeliveryOrder;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create a known test customer user for easy login
        $testCustomer = User::create([
            'name' => 'Test Customer',
            'email' => 'customer@test.com',
            'phone_number' => '+237670000001',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'type' => 'customer',
        ]);

        // 2. Create a known test driver user
        $testDriver = User::create([
            'name' => 'Jean-Pierre Mbarga',
            'email' => 'driver@test.com',
            'phone_number' => '+237670000002',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'type' => 'driver',
        ]);

        // 3. Create a known test host user
        $testHost = User::create([
            'name' => 'Marie-Claire Fotso',
            'email' => 'host@test.com',
            'phone_number' => '+237670000003',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'type' => 'host',
        ]);

        // 4. Create driver profile for test driver
        DriverProfile::create([
            'user_id' => $testDriver->id,
            'vehicle_type' => 'motorcycle',
            'vehicle_plate_number' => 'LT-4521-AB',
            'is_verified' => true,
            'documents' => json_encode(['license' => 'license_verified.pdf']),
            'latitude' => 3.8756,
            'longitude' => 11.5089,
            'is_available' => true,
        ]);

        // 5. Create additional customers
        $customers = User::factory(5)->create(['type' => 'customer']);

        // 6. Create additional drivers with profiles
        $drivers = User::factory(4)->create(['type' => 'driver']);
        foreach ($drivers as $driver) {
            DriverProfile::factory()->create(['user_id' => $driver->id]);
        }

        // 7. Create additional hosts
        $hosts = User::factory(3)->create(['type' => 'host']);

        // 8. Create properties for test host
        $testProperties = Property::factory(5)->create([
            'host_id' => $testHost->id,
            'is_verified' => true,
        ]);

        // 9. Create properties for other hosts
        foreach ($hosts as $host) {
            Property::factory($this->randomBetween(2, 4))->create([
                'host_id' => $host->id,
            ]);
        }

        // 10. Create delivery orders for test customer
        $allDriverIds = $drivers->pluck('id')->push($testDriver->id)->toArray();

        // Pending order
        DeliveryOrder::factory()->create([
            'customer_id' => $testCustomer->id,
            'status' => 'pending',
            'pickup_address' => 'Carrefour Bastos, Yaoundé',
            'pickup_latitude' => 3.8812,
            'pickup_longitude' => 11.5021,
            'dropoff_address' => 'Université de Yaoundé I, Ngoa-Ekelle',
            'dropoff_latitude' => 3.8600,
            'dropoff_longitude' => 11.4970,
            'package_description' => 'Small document envelope',
            'estimated_fare' => 2500,
            'payment_method' => 'mobile_money',
        ]);

        // Delivered order
        DeliveryOrder::factory()->create([
            'customer_id' => $testCustomer->id,
            'driver_id' => $testDriver->id,
            'status' => 'delivered',
            'pickup_address' => 'Marché Mokolo, Yaoundé',
            'pickup_latitude' => 3.8711,
            'pickup_longitude' => 11.5104,
            'dropoff_address' => 'Hôpital Central, Yaoundé',
            'dropoff_latitude' => 3.8667,
            'dropoff_longitude' => 11.5217,
            'package_description' => 'Medical supplies',
            'estimated_fare' => 1500,
            'payment_method' => 'cash',
        ]);

        // In-transit order
        DeliveryOrder::factory()->create([
            'customer_id' => $testCustomer->id,
            'driver_id' => $testDriver->id,
            'status' => 'in_transit',
            'pickup_address' => 'Total Essos, Yaoundé',
            'pickup_latitude' => 3.8634,
            'pickup_longitude' => 11.5234,
            'dropoff_address' => 'Biyem-Assi Market, Yaoundé',
            'dropoff_latitude' => 3.8445,
            'dropoff_longitude' => 11.4892,
            'package_description' => 'Electronics package',
            'estimated_fare' => 3000,
            'payment_method' => 'mobile_money',
        ]);

        // 11. Create delivery orders for other customers
        foreach ($customers as $customer) {
            DeliveryOrder::factory($this->randomBetween(1, 3))->create([
                'customer_id' => $customer->id,
                'driver_id' => $this->randomElement(array_merge($allDriverIds, [null])),
            ]);
        }

        // 12. Create bookings for test customer
        foreach ($testProperties->take(2) as $property) {
            Booking::factory()->create([
                'customer_id' => $testCustomer->id,
                'property_id' => $property->id,
                'status' => 'confirmed',
            ]);
        }

        // 13. Create bookings for other customers
        $allProperties = Property::all();
        foreach ($customers as $customer) {
            $randomProperties = $allProperties->random(min(2, $allProperties->count()));
            foreach ($randomProperties as $property) {
                Booking::factory()->create([
                    'customer_id' => $customer->id,
                    'property_id' => $property->id,
                ]);
            }
        }

        // 14. Create reviews for properties
        foreach ($allProperties as $property) {
            $reviewers = $customers->random(min(3, $customers->count()));
            foreach ($reviewers as $reviewer) {
                Review::factory()->create([
                    'reviewer_id' => $reviewer->id,
                    'reviewable_id' => $property->id,
                    'reviewable_type' => Property::class,
                ]);
            }
        }

        // Test customer also reviews some properties
        foreach ($testProperties->take(3) as $property) {
            Review::factory()->create([
                'reviewer_id' => $testCustomer->id,
                'reviewable_id' => $property->id,
                'reviewable_type' => Property::class,
            ]);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Test accounts:');
        $this->command->info('  Customer: customer@test.com / password');
        $this->command->info('  Driver:   driver@test.com / password');
        $this->command->info('  Host:     host@test.com / password');
    }

    private function randomBetween(int $min, int $max): int
    {
        return rand($min, $max);
    }

    private function randomElement(array $items)
    {
        return $items[array_rand($items)];
    }
}
