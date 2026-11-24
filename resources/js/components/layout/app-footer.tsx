import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLElement> & {
    /** Texto secundário (ex.: período ou dica). */
    hint?: string;
};

export function AppFooter({ className, hint, children, ...props }: Props) {
    const year = new Date().getFullYear();

    return (
        <footer
            className={cn(
                'text-muted-foreground mt-auto border-t px-4 py-4 text-center text-xs sm:flex sm:items-center sm:justify-between sm:text-left',
                className
            )}
            {...props}
        >
            <p>Tecnoeletro | © {year}</p>
            {hint ? <p className="mt-2 max-w-xl sm:mt-0">{hint}</p> : null}
            {children}
        </footer>
    );
}
