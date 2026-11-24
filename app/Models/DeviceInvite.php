<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceInvite extends Model
{
    protected $fillable = [
        'device_id',
        'invited_by',
        'email',
        'accepted_at'
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }
}