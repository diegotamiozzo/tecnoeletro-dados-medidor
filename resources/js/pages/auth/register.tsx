import { login } from '@/routes';
import { store } from '@/routes/register';
import { useForm, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [mounted, setMounted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    
    // 1. Inicializamos o useForm aqui fora para ter acesso ao setData
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // 2. Captura segura do e-mail da URL (Client-side apenas)
    useEffect(() => {
        setMounted(true);
        const queryParams = new URLSearchParams(window.location.search);
        const emailFromUrl = queryParams.get('email');
        
        if (emailFromUrl) {
            setData('email', emailFromUrl);
        }
    }, []);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            post('/register', { 
                onFinish: () => reset('password', 'password_confirmation'),
            });
        };

    return (
        <AuthLayout
            title="Criar uma conta"
            description="Insira seus dados abaixo para criar sua conta"
        >
            <Head title="Cadastro" />

            {/* 3. Usamos a tag form nativa ou o componente Form apenas como wrapper visual */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus={!data.email}
                            autoComplete="name"
                            placeholder="Nome completo"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Endereço de e-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="email"
                            readOnly={mounted && !!new URLSearchParams(window.location.search).get('email')}
                            className={mounted && new URLSearchParams(window.location.search).get('email') ? 'bg-muted cursor-not-allowed' : ''}
                            placeholder="email@exemplo.com"
                        />
                        <InputError message={errors.email} />
                        {mounted && new URLSearchParams(window.location.search).get('email') && (
                            <p className="text-[11px] text-muted-foreground italic">
                                Este e-mail está vinculado ao seu convite de acesso.
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                autoComplete="new-password"
                                placeholder="Sua senha"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirmar senha
                        </Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                autoComplete="new-password"
                                placeholder="Confirme sua senha"
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPasswordConfirmation ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        disabled={processing}
                    >
                        {processing && <Spinner className="mr-2" />}
                        Criar conta
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
                    <TextLink href={login()}>
                        Entrar
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}