<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'items',
        'total',
        'status',
        'shipping_address',
        'payment_method',
    ];

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'shipping_address' => 'array',
            'total' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
