<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\DeviceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// -------------------------------------------------------
// Rotas autenticadas — usuários comuns
// -------------------------------------------------------
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('devices', [DeviceController::class, 'index'])->name('dashboard');
    Route::post('devices', [DeviceController::class, 'store'])->name('devices.store');
    Route::put('devices/{id}', [DeviceController::class, 'update'])->name('devices.update');
    Route::delete('devices/{id}', [DeviceController::class, 'destroy'])->name('devices.destroy');
    Route::get('devices/{id}/dashboard', [DeviceController::class, 'dashboard'])->name('devices.dashboard');
    Route::post('devices/{id}/dashboard/refresh', [DeviceController::class, 'refreshDashboardData'])->name('devices.dashboard.refresh');
    Route::get('devices/{id}/dashboard/refresh/status', [DeviceController::class, 'refreshDashboardStatus'])->name('devices.dashboard.refresh.status');
    Route::get('devices/{id}/dashboard/export', [DeviceController::class, 'exportDashboardData'])->name('devices.dashboard.export');
});

// -------------------------------------------------------
// Rotas administrativas — somente administradores
// -------------------------------------------------------
Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Redireciona /admin para a lista de dispositivos
        Route::redirect('/', '/admin/devices');

        Route::get('devices', [Admin\DeviceController::class, 'index'])->name('devices.index');
        Route::post('devices', [Admin\DeviceController::class, 'store'])->name('devices.store');
        Route::put('devices/{device}', [Admin\DeviceController::class, 'update'])->name('devices.update');
        Route::delete('devices/{device}', [Admin\DeviceController::class, 'destroy'])->name('devices.destroy');
    });

require __DIR__.'/settings.php';