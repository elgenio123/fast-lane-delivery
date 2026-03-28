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

            $table->string('status')->default('pending')
                ->comment('Delivery status: pending, accepted, in_transit, delivered, cancelled');

            $table->text('pickup_address');
            $table->decimal('pickup_latitude', 10, 7);
            $table->decimal('pickup_longitude', 10, 7);

            $table->text('dropoff_address');
            $table->decimal('dropoff_latitude', 10, 7);
            $table->decimal('dropoff_longitude', 10, 7);

            $table->text('package_description');
            $table->decimal('estimated_fare', 8, 2);
            $table->string('payment_method')->default('cash')
                ->comment('Payment method: cash, mobile_money');
            $table->string('payment_status')->default('PENDING')
                ->comment('Payment status: PENDING, APPROVED, CANCELLED');

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
