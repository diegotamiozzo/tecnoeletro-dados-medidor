# Copilot Instructions

## Project overview

This is a Laravel 12 application for registering meter devices, sharing them with users, and displaying aggregated electrical measurements.

- Backend: PHP 8.2+, Laravel 12, Laravel Fortify, Inertia Laravel.
- Frontend: React 19, TypeScript, Inertia React, Vite 7, Tailwind CSS 4, shadcn/ui and Radix UI.
- Authentication: Fortify plus the custom two-factor/settings controllers in `app/Http/Controllers/Settings`.
- Main domain flow: meter readings arrive in `dados_brutos`, `app:aggregate-hourly-data` creates hourly/daily rows in `dados_agregados`, and the dashboard reads the aggregated rows.

## Setup and commands

Use Windows PowerShell syntax where shell commands are shown.

```powershell
composer install
npm install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate
composer run dev
```

For a complete first-time setup/build, `composer run setup` also creates `.env`, generates the key,
runs migrations forcefully, installs npm dependencies, and builds Vite assets.

`composer run dev` starts the Laravel server, queue listener, and Vite together. The queue listener is required for dashboard refresh jobs and mail notifications. Start the pieces separately only when debugging one process:

```powershell
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

### Tests

PHP tests use Pest. `composer test` clears the config cache and runs the full Artisan test suite.

```powershell
composer test
php artisan test
php artisan test tests/Unit/AnomalyDetectionServiceTest.php
php artisan test tests/Feature/AgregacaoDadosFixTest.php
php artisan test --filter="detects voltage anomaly"
vendor/bin/pest tests/Unit/AnomalyDetectionServiceTest.php
```

The PHPUnit configuration uses an in-memory SQLite database, array cache, and synchronous queues. Use this test database behavior when writing and running tests; do not depend on a local `.env` database for test setup.

### Frontend checks

```powershell
npm run build
npm run build:ssr
npm run types
npm run lint
npm run format:check
npm run format
```

`npm run lint` runs ESLint with `--fix`, while `format:check` is the non-mutating formatting check.

### PHP formatting

```powershell
vendor/bin/pint
vendor/bin/pint --test
```

### Aggregation command

```powershell
php artisan app:aggregate-hourly-data --periodo=hora
php artisan app:aggregate-hourly-data --periodo=dia --device_id=1 --from=2026-05-19 --to=2026-05-20
php artisan admin:create --email=admin@exemplo.com --name="Admin" --password=senha123
```

The queue job `AggregateDashboardData` invokes the aggregation Artisan command and stores its status under `dashboard:refresh:status:{deviceId}` in cache. It also runs anomaly detection for the newly aggregated period.

Use `--from` and `--to` with `YYYY-MM-DD`; the command defaults to processing unprocessed
rows older than the current timestamp. It upserts by `[device_id, periodo_inicio]`, marks matching
raw rows processed, and deletes processed raw rows older than 30 days in batches of 5,000.
The dashboard refresh job uses a 300-second cache lock and reports `queued`, `running`, `done`,
or `failed` under `dashboard:refresh:status:{deviceId}`.

## Architecture and key flows

### Routes and controllers

- `routes/web.php` defines public routes, authenticated device routes, and the `/admin/devices` routes protected by `auth`, `verified`, and `admin`.
- `routes/settings.php` defines profile, password, appearance, and two-factor settings.
- `App\Http\Controllers\DeviceController` owns device linking, owner/viewer sharing, dashboard queries, refresh jobs, and CSV export.
- `App\Http\Controllers\Admin\DeviceController` manages the global device registry and exposes its owner in the admin response.
- `App\Http\Middleware\IsAdmin` enforces the `is_admin` flag for administrative routes.

When changing a route, keep backend route names and generated frontend Wayfinder imports in sync. Wayfinder output lives in `resources/js/actions`, `resources/js/routes`, and `resources/js/wayfinder`; those generated folders are maintained by the Vite Wayfinder plugin.

### Device access model

`devices` is many-to-many with `users` through `device_user`, where the pivot `role` is `owner` or `viewer`.

- A MAC address plus six-digit PIN claims an unowned, active device as an owner.
- Owners can edit the device and maintain the viewer share list.
- Existing registered emails become `viewer` pivots; unknown emails create `device_invites`.
- Destroying an owned device removes it and its viewers/invites; destroying a shared link removes only the viewer relationship.
- Dashboard authorization must be enforced through `findDevice`: admins may access any device, while normal users must still be attached to the device.

Preserve these owner/viewer distinctions when changing controllers or UI actions.

### Readings and aggregation

The database distinguishes:

- `DadoBruto` / `dados_brutos`: individual readings with `timestamp_leitura` and `processado`.
- `DadoAgregado` / `dados_agregados`: one hourly or daily row per `device_id` and `periodo_inicio`.

The aggregation command calculates averages/minimum/maximum/last values for instantaneous metrics and consumption/last values for cumulative energies. It upserts on `[device_id, periodo_inicio]`, marks source rows processed, and removes processed raw rows older than 30 days.

When changing metric names or aggregation mappings, update all relevant layers together:

- raw/aggregated migrations,
- `DadoBruto` and `DadoAgregado` casts,
- the `AggregateHourlyData` SQL column lists,
- dashboard controller mappings,
- `ChartPoint`, `SummaryCard`, and dashboard chart components.

The dashboard treats null readings as missing data, not zero. Negative aggregate energy consumption is treated as a meter reset and normalized to zero by the aggregation command.

Raw metric names are the database column names (for example `tensao_l1_n`).
Hourly/daily columns use explicit suffixes: `_media`, `_min`, `_max`, `_ultima`, or `_consumo`.
Do not rename a metric in only one layer or add a chart key without updating the backend
payload and `resources/js/components/dashboard/types.ts`.

The aggregation SQL is DB-specific: it uses `DATE_FORMAT(...)` to build hourly/daily periods.
Preserve that behavior when changing grouping logic and verify both the targeted Pest tests and
the command against the database engine used for the change.

### Frontend/Inertia patterns

- Pages belong in `resources/js/pages` and layouts in `resources/js/layouts`.
- Shared UI primitives live in `resources/js/components/ui`; domain components live in `resources/js/components/dashboard` and `resources/js/components/devices`.
- Use `@/` for imports under `resources/js`; this alias is configured in `tsconfig.json`.
- Inertia pages receive props from Laravel and normally use `useForm`, `router`, or `usePage` for mutations and navigation.
- Theme initialization is in `resources/js/hooks/use-appearance.tsx` and runs from `resources/js/app.tsx`.
- Inertia props shared globally by `HandleInertiaRequests` include `auth`, `appUrl`, and `sidebarOpen`.

### Notifications and anomaly detection

`AnomalyDetectionService` evaluates phase-neutral voltage against `nominal_voltage` on the device, falling back to `DEFAULT_NOMINAL_VOLTAGE` (`220.0`). It also checks power factor below `0.92` and frequency outside `59.9`-`60.1` Hz.

Notifications are throttled with `ANOMALY_NOTIFICATION_THROTTLE_MINUTES` (default 30 minutes). Keep the aggregation and direct dashboard refresh paths synchronized when metric keys or notification behavior change.

## Testing and verification conventions

- PHPUnit/Pest uses in-memory SQLite, array cache, array mail, and synchronous queues regardless
  of the local `.env`; do not assume those tests exercise a MySQL/PostgreSQL connection.
- Focus aggregation regressions with `php artisan test tests/Feature/AgregacaoDadosFixTest.php`.
- Focus anomaly detection with `php artisan test tests/Unit/AnomalyDetectionServiceTest.php`.
- Run a single named Pest test with `php artisan test --filter="test name"`.
- For route/controller changes, include authorization coverage: admins bypass attachment with
  `findDevice`, while regular users must have an owner/viewer attachment.
- After changing routes or controller method names, rebuild or run Wayfinder generation through
  Vite because frontend imports come from `resources/js/actions`, `resources/js/routes`, and
  `resources/js/wayfinder`.
