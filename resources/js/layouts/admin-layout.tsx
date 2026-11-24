import AppLogoIcon from '@/components/app-logo-icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
                    {/* Logo + badge */}
                    <Link href="/admin/devices" className="flex items-center gap-2.5">
                        <AppLogoIcon className="h-7 w-auto" />
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-semibold text-foreground">
                                Tecnoeletro
                            </span>
                        </div>
                    </Link>

                    {/* Nav */}
                    <nav className="ml-6 hidden items-center gap-1 md:flex">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/devices">
                                <LayoutGrid className="size-4" />
                                Equipamentos
                            </Link>
                        </Button>
                    </nav>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Voltar ao app + user menu */}
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/devices">← Voltar ao App</Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-8 rounded-full p-0">
                                <Avatar className="size-8">
                                    <AvatarFallback className="bg-amber-100 text-amber-700 text-xs font-semibold dark:bg-amber-900/30 dark:text-amber-400">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="font-normal">
                                <p className="text-sm font-medium">{auth.user.name}</p>
                                <p className="text-xs text-muted-foreground">{auth.user.email}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings/profile">
                                    <Settings className="size-4" /> Configurações
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/logout" method="post" as="button" className="w-full">
                                    <LogOut className="size-4" /> Sair
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Page title bar */}
            {title && (
                <div className="border-b border-border bg-muted/40 px-4 py-3">
                    <div className="mx-auto max-w-7xl">
                        <h1 className="text-sm font-medium text-foreground">{title}</h1>
                    </div>
                </div>
            )}

            {/* Content */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
                {children}
            </main>
        </div>
    );
}
