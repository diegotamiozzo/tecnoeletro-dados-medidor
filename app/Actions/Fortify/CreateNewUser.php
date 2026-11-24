<?php

namespace App\Actions\Fortify;

use App\Models\DeviceInvite;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        try {
            return DB::transaction(function () use ($input) {
                $user = User::create([
                    'name' => $input['name'],
                    'email' => $input['email'],
                    'password' => Hash::make($input['password']),
                ]);

                $pendingInvites = DeviceInvite::where('email', $input['email'])
                    ->whereNull('accepted_at')
                    ->lockForUpdate()
                    ->get();

                foreach ($pendingInvites as $invite) {
                    // syncWithoutDetaching evita duplicidade na tabela pivô
                    $user->devices()->syncWithoutDetaching([
                        $invite->device_id => ['role' => 'viewer']
                    ]);

                    // Marca o convite como aceito
                    $invite->update(['accepted_at' => now()]);
                }

                return $user;
            });
        } catch (\Illuminate\Database\QueryException $e) {
            // Caso ocorra uma race condition onde o e-mail foi inserido por outro processo 
            // entre a validação e a transação (Erro de integridade 23000)
            if ($e->getCode() === '23000') {
                throw ValidationException::withMessages([
                    'email' => [__('Este e-mail já foi registrado por outro usuário.')],
                ]);
            }
            throw $e;
        }
    }
}