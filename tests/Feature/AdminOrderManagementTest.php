<?php

use App\Models\Approval;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows admins to open order management', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::create([
        'name' => 'Keranjang Panen',
        'price' => 25000,
        'stock' => 10,
        'unit' => 'pcs',
    ]);

    $this->post('/order', [
        'guest_name' => 'Budi',
        'guest_phone' => '081234567890',
        'items' => [
            ['product_id' => $product->id, 'qty' => 1],
        ],
    ]);

    $this->actingAs($admin)
        ->get('/admin/orders')
        ->assertOk();
});

it('blocks non admin users from order management', function () {
    $staff = User::factory()->create(['role' => 'staff']);

    $this->actingAs($staff)
        ->get('/admin/orders')
        ->assertForbidden();
});

it('filters admin orders by status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = Product::create([
        'name' => 'Keranjang Panen',
        'price' => 25000,
        'stock' => 10,
        'unit' => 'pcs',
    ]);

    $this->post('/order', [
        'guest_name' => 'Pending Buyer',
        'guest_phone' => '081111111111',
        'items' => [
            ['product_id' => $product->id, 'qty' => 1],
        ],
    ]);

    $this->post('/order', [
        'guest_name' => 'Approved Buyer',
        'guest_phone' => '082222222222',
        'items' => [
            ['product_id' => $product->id, 'qty' => 1],
        ],
    ]);

    Approval::create([
        'order_id' => Order::where('guest_name', 'Approved Buyer')->firstOrFail()->id,
        'approved_by' => $admin->id,
        'status' => 'approved',
        'approved_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get('/admin/orders?status=pending')
        ->assertOk()
        ->assertSee('Pending Buyer')
        ->assertDontSee('Approved Buyer');
});
