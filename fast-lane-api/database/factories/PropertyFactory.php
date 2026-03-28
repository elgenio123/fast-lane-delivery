<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    public function definition(): array
    {
        $quarters = [
            'Bastos', 'Nlongkak', 'Melen', 'Biyem-Assi', 'Essos',
            'Omnisport', 'Tsinga', 'Nkolbisson', 'Mvog-Ada', 'Etoa-Meki',
            'Mvan', 'Ngousso', 'Emana', 'Odza', 'Etoug-Ebe',
            'Akwa', 'Bonanjo', 'Bonapriso', 'Deido', 'Bali',
        ];

        $propertyNames = [
            'Villa Krystal', 'Maison de Paix', 'Résidence du Lac',
            'Le Petit Château', 'Appartement Soleil', 'Guesthouse Bellevue',
            'La Terrasse Verte', 'Résidence Étoile', 'Maison des Arts',
            'Le Jardin Secret', 'Chez Mama Africa', 'Villa Tropicale',
            'Résidence Boulangerie', 'Maison du Bonheur', 'Villa Palm',
            'Appartement Central', 'Guesthouse Harmonie', 'Le Beau Séjour',
            'Villa Cameroun', 'Résidence Mandara',
        ];

        $amenities = ['Wi-Fi', 'Air Conditioning', 'Pool', 'Parking', 'Kitchen',
            'TV', 'Hot Water', 'Security', 'Generator', 'Laundry', 'Garden',
            'Balcony', 'Room Service', 'Restaurant'];

        $types = ['guesthouse', 'apartment', 'event_hall'];
        $quarter = $this->faker->randomElement($quarters);

        return [
            'host_id' => User::factory(),
            'type' => $this->faker->randomElement($types),
            'name' => $this->faker->randomElement($propertyNames) . ' ' . $this->faker->numberBetween(1, 50),
            'description' => $this->faker->paragraph(3),
            'address' => 'Rue ' . $this->faker->numberBetween(1, 999) . ', ' . $quarter,
            'quarter' => $quarter,
            'latitude' => $this->faker->latitude(3.82, 3.92),
            'longitude' => $this->faker->longitude(11.48, 11.56),
            'price_per_night' => $this->faker->randomElement([5000, 8000, 10000, 15000, 20000, 25000, 30000, 50000, 75000]),
            'amenities' => $this->faker->randomElements($amenities, $this->faker->numberBetween(3, 8)),
            'photos' => [],
            'image' => null,
            'rating' => $this->faker->randomFloat(1, 3.0, 5.0),
            'review_count' => $this->faker->numberBetween(0, 50),
            'is_verified' => $this->faker->boolean(80),
        ];
    }
}
