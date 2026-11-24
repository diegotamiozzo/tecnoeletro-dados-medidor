<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::timezone('America/Sao_Paulo');
Schedule::command('app:aggregate-hourly-data --periodo=hora')
    ->everyFiveMinutes()
    ->withoutOverlapping();