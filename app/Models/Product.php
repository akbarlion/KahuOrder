<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'description', 'price', 'stock', 'unit', 'image_url'];

    protected function casts(): array
    {
        return ['price' => 'decimal:2'];
    }

    public function getImageUrlAttribute(?string $value): ?string
    {
        return $value ? asset('storage/' . $value) : null;
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
