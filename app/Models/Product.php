<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'description', 'price', 'stock', 'unit'];

    protected function casts(): array
    {
        return ['price' => 'decimal:2'];
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
