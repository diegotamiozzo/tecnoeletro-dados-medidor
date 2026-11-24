<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'mac_address',
        'pin',
        'name',
        'is_active',
        'is_generate', // <-- ADICIONEI ESTA LINHA
        'nominal_voltage',
    ];

    protected $casts = [
        'nominal_voltage' => 'float',
    ];

    /**
     * Relacionamento: Um dispositivo pode ter vários convites pendentes.
     */
    public function invites(): HasMany
    {
        return $this->hasMany(DeviceInvite::class);
    }

    /**
     * Relacionamento: Muitos para Muitos com usuários.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('role')
                    ->withTimestamps();
    }

    /**
     * Mutator para o MAC Address.
     */
    protected function macAddress(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', $value)),
        );
    }
}