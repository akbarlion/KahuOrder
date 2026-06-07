<?php

use App\Models\Order;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('public_code', 16)->nullable()->unique()->after('id');
            $table->index('guest_phone');
        });

        Order::query()
            ->whereNull('public_code')
            ->each(function (Order $order) {
                $order->forceFill(['public_code' => Order::generatePublicCode()])->save();
            });

        Schema::table('approvals', function (Blueprint $table) {
            $table->unique('order_id');
        });
    }

    public function down(): void
    {
        Schema::table('approvals', function (Blueprint $table) {
            $table->dropUnique(['order_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['guest_phone']);
            $table->dropUnique(['public_code']);
            $table->dropColumn('public_code');
        });
    }
};
