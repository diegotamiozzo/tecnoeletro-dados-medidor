<?php

namespace Database\Factories;

use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeviceFactory extends Factory
{
    protected $model = Device::class;

    public function definition(): array
    {
        return [
            'mac_address' => strtoupper(bin2hex(random_bytes(6))),
            'pin' => str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT),
            'name' => $this->faker->word() . ' Meter',
            'is_active' => true,
            'is_generate' => $this->faker->boolean(),
            'nominal_voltage' => $this->faker->randomElement([127, 220, 380]),
        ];
    }
}
