<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = ['public_code', 'guest_name', 'guest_phone', 'total_price', 'notes'];

    protected $appends = ['status'];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            $order->public_code ??= static::generatePublicCode();
        });
    }

    protected function casts(): array
    {
        return ['total_price' => 'decimal:2'];
    }

    public static function generatePublicCode(): string
    {
        do {
            $code = 'KO-'.Str::upper(Str::random(10));
        } while (static::where('public_code', $code)->exists());

        return $code;
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
        if (! $this->relationLoaded('approval')) {
            return 'pending';
        }

        return $this->approval?->status ?? 'pending';
    }
}
