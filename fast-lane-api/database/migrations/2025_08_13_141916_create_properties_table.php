<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\PropertyEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', enum_to_string_array(PropertyEnum::cases()))
                ->default(PropertyEnum::GUESTHOUSE->value)
                ->comment('Property type: guesthouse, event_hall, apartment, restaurant');
            $table->string('name');
            $table->text('description');
            $table->string('address');
            $table->string('quarter')->comment('Neighborhood in Yaoundé');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('image')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
