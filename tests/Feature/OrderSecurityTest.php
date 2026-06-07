<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeProduct(array $overrides = []): Product
{
    return Product::create(array_merge([
        'name' => 'Kopi Susu',
        'description' => 'Botol siap minum',
        'price' => 15000,
        'stock' => 5,
        'unit' => 'botol',
    ], $overrides));
}

it('creates orders with a public code and reserves stock atomically', function () {
    $product = makeProduct(['stock' => 5]);

    $response = $this->post('/order', [
        'guest_name' => 'Budi',
        'guest_phone' => '0812-3456-7890',
        'items' => [
            ['product_id' => $product->id, 'qty' => 2],
            ['product_id' => $product->id, 'qty' => 1],
        ],
    ]);

    $order = Order::with('items')->firstOrFail();

    $response->assertRedirect(route('orders.show', $order->public_code));
    expect($order->public_code)->toStartWith('KO-')
        ->and($order->guest_phone)->toBe('081234567890')
        ->and($order->items)->toHaveCount(1)
        ->and($order->items->first()->qty)->toBe(3)
        ->and($product->fresh()->stock)->toBe(2);
});

it('rejects orders that exceed available stock', function () {
    $product = makeProduct(['stock' => 2]);

    $response = $this->from('/order')->post('/order', [
        'guest_name' => 'Budi',
        'guest_phone' => '081234567890',
        'items' => [
            ['product_id' => $product->id, 'qty' => 3],
        ],
    ]);

    $response->assertRedirect('/order');
    $response->assertSessionHasErrors('items');
    expect(Order::count())->toBe(0)
        ->and($product->fresh()->stock)->toBe(2);
});

it('only exposes guest order details through the public code', function () {
    $product = makeProduct();

    $this->post('/order', [
        'guest_name' => 'Budi',
        'guest_phone' => '081234567890',
        'items' => [
            ['product_id' => $product->id, 'qty' => 1],
        ],
    ]);

    $order = Order::firstOrFail();

    $this->get("/orders/{$order->id}")->assertNotFound();
    $this->get("/orders/{$order->public_code}")->assertOk();
});

it('restores reserved stock when an admin rejects an order', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = makeProduct(['stock' => 5]);

    $this->post('/order', [
        'guest_name' => 'Budi',
        'guest_phone' => '081234567890',
        'items' => [
            ['product_id' => $product->id, 'qty' => 2],
        ],
    ]);

    $order = Order::firstOrFail();

    expect($product->fresh()->stock)->toBe(3);

    $this->actingAs($admin)
        ->post(route('approvals.reject', $order), ['note' => 'Stok dialihkan'])
        ->assertRedirect(route('approvals.index'));

    expect($product->fresh()->stock)->toBe(5)
        ->and($order->approval()->first()->status)->toBe('rejected');
});

it('prevents an order from being approved twice', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = makeProduct();

    $this->post('/order', [
        'guest_name' => 'Budi',
        'guest_phone' => '081234567890',
        'items' => [
            ['product_id' => $product->id, 'qty' => 1],
        ],
    ]);

    $order = Order::firstOrFail();

    $this->actingAs($admin)
        ->post(route('approvals.approve', $order))
        ->assertRedirect(route('approvals.index'));

    $this->actingAs($admin)
        ->post(route('approvals.approve', $order))
        ->assertConflict();

    expect($order->approval()->count())->toBe(1);
});
