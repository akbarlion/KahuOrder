<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['guest_name', 'guest_phone', 'total_price', 'notes'];

    protected $appends = ['status'];

    protected function casts(): array
    {
        return ['total_price' => 'decimal:2'];
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function approval()
    {
        return $this->hasOne(Approval::class);
    }

    public function getStatusAttribute(): string
    {
        if (!$this->relationLoaded('approval')) {
            return 'pending';
        }

        return $this->approval?->status ?? 'pending';
    }
}
