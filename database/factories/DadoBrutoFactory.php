<?php

namespace Database\Factories;

use App\Models\DadoBruto;
use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;

class DadoBrutoFactory extends Factory
{
    protected $model = DadoBruto::class;

    public function definition(): array
    {
        return [
            'device_id' => Device::factory(),
            'timestamp_leitura' => $this->faker->dateTimeThisYear(),
            'tensao_l1_n' => $this->faker->numberBetween(200, 240),
            'tensao_l2_n' => $this->faker->numberBetween(200, 240),
            'tensao_l3_n' => $this->faker->numberBetween(200, 240),
            'tensao_l1_l2' => $this->faker->numberBetween(300, 380),
            'tensao_l2_l3' => $this->faker->numberBetween(300, 380),
            'tensao_l3_l1' => $this->faker->numberBetween(300, 380),
            'corrente_l1' => $this->faker->numberBetween(0, 50) / 10,
            'corrente_l2' => $this->faker->numberBetween(0, 50) / 10,
            'corrente_l3' => $this->faker->numberBetween(0, 50) / 10,
            'corrente_neutro' => $this->faker->numberBetween(0, 20) / 10,
            'potencia_ativa_total' => $this->faker->numberBetween(100, 5000),
            'potencia_reativa_total' => $this->faker->numberBetween(0, 3000),
            'potencia_aparente_total' => $this->faker->numberBetween(1000, 6000),
            'fator_potencia_total' => $this->faker->numberBetween(80, 100) / 100,
            'frequencia' => $this->faker->numberBetween(5950, 6050) / 100,
            'energia_ativa_importada' => $this->faker->numberBetween(1000, 10000),
            'energia_ativa_exportada' => 0,
            'energia_reativa_importada' => $this->faker->numberBetween(0, 5000),
            'energia_reativa_exportada' => 0,
            'processado' => 0,
        ];
    }
}
