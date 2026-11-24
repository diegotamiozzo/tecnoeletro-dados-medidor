<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create {--email= : E-mail do administrador} {--name= : Nome do administrador} {--password= : Senha}';
    protected $description = 'Cria ou promove um usuário como administrador do sistema';

    public function handle(): void
    {
        $email = $this->option('email') ?? $this->ask('E-mail do administrador');
        $name  = $this->option('name')  ?? $this->ask('Nome', 'Administrador');
        $password = $this->option('password') ?? $this->secret('Senha (mínimo 8 caracteres)');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name'              => $name,
                'password'          => Hash::make($password),
                'is_admin'          => true,
                'email_verified_at' => now(),
            ]
        );

        $user->update(['is_admin' => true]);

        $this->info("✓ Administrador '{$user->name}' ({$user->email}) configurado com sucesso.");
    }
}