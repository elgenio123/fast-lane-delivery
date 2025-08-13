<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\PaymentMethodEnum;
use App\Enums\PaymentStatusEnum;
use App\Enums\DeliveryStatusEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('delivery_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('driver_id')->nullable()->constrained('users')->onDelete('set null');

            $table->enum('status', enum_to_string_array(DeliveryStatusEnum::cases()))->default(DeliveryStatusEnum::PENDING->value)
                ->comment('Delivery status: pending, accepted, in_progress, completed, cancelled');

            $table->text('pickup_address');
            $table->decimal('pickup_latitude', 10, 7);
            $table->decimal('pickup_longitude', 10, 7);

            $table->json('dropoff_address');
            $table->decimal('dropoff_latitude', 10, 7);
            $table->decimal('dropoff_longitude', 10, 7);

            $table->text('package_description');
            $table->decimal('estimated_fare', 8, 2);
            $table->enum('payment_method', enum_to_string_array(PaymentMethodEnum::cases()))
                ->default(PaymentMethodEnum::CASH->value)
                ->comment('Payment method: cash, card, mobile money');
            $table->enum('payment_status', enum_to_string_array(PaymentStatusEnum::cases()))->default(PaymentStatusEnum::PENDING->value)
                ->comment('Payment status: pending, completed, cancelled');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_orders');
    }
};
