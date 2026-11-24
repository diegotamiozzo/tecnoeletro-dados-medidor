import { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/logo-tecnoeletro.png"
            alt="Tecnoeletro Logo"
            className={cn('block object-contain', className)}
        />
    );
}