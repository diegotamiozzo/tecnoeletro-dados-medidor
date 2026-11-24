import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    appUrl: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

/**
 * Interface para os Dispositivos (Equipamentos)
 */
export interface Device {
    id: number;
    mac_address: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Pivot da relação many-to-many com User
    pivot: {
        user_id: number;
        device_id: number;
        role: 'owner' | 'viewer';
    };
    // Relacionamento com usuários (opcional, para quando carregar com 'users')
    users?: Array<{
        id: number;
        name: string;
        email: string;
        pivot: {
            role: string;
        };
    }>;
}

/**
 * Interface para Convites de Dispositivos
 */
export interface DeviceInvite {
    id: number;
    device_id: number;
    email: string;
    token: string;
    role: string;
    expires_at: string;
    created_at: string;
}