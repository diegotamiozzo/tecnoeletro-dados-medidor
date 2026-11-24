import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-md border border-border bg-background dark:bg-muted">
                <AppLogoIcon className="size-10 text-foreground" />
            </div>

            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-semibold leading-tight text-foreground">
                    Tecnoeletro
                </span>

                <span className="truncate text-xs text-muted-foreground">
                    Interface de Controle
                </span>
            </div>
        </>
    );
}