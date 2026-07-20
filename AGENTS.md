# E-Commerce — Laravel + Inertia React SPA

## Stack
- Laravel 13 + PHP 8.3+
- Inertia.js v3 (React 19), Vite 8, Tailwind CSS v4 (@tailwindcss/vite plugin)
- shadcn/ui (new-york style, **JSX only** — `tsx: false`), icons: lucide-react
- SQLite by default (dev + test), database session/cache/queue drivers

## Commands
| Command | What it does |
|---|---|
| `composer setup` | Full bootstrap: `composer install`, copy `.env`, `key:generate`, `migrate`, `npm install --ignore-scripts`, `npm run build` |
| `composer dev` | Runs 4 processes concurrently: `php artisan serve`, `queue:listen`, `pail` (logs), `vite` |
| `composer test` | `config:clear` then `php artisan test` |
| `npm run dev` | Vite dev server only |
| `npm run build` | Vite production build |

**`.npmrc` sets `ignore-scripts=true`** — postinstall scripts won't run unless you pass `--ignore-scripts=false`.

## Key architecture
- **PHP routes** in `routes/web.php` — three groups: public (guest), auth (login/register), admin (auth middleware).
- **Inertia pages** live in `resources/js/Pages/{Name}.jsx` — resolved automatically from controller `Inertia::render('PublicView/Dashboard')`.
- **Shared props** via `HandleInertiaRequests.php` — only `auth.user` fields: `id`, `name`, `email`.
- **Admin** checks `user->role === 'admin'` for redirect (no explicit admin middleware — role check is in `AuthController`).
- **Cart** is client-side only — stored in `localStorage` key `fragrance_cart` (see `resources/js/hooks/useCart.js`). Cross-tab sync via `storage` event.
- `app/Actions/` directory exists but is empty.

## JS conventions
- `@/` alias → `resources/js/`
- `cn()` for class merging in `@/lib/utils.js` (clsx + tailwind-merge)
- `currency()` helper in `@/data/fragrances.js` — formats as PHP (₱)
- Components in `@/components/ui/` are shadcn/ui generated (JSX, not TSX)
- Tailwind v4: no `tailwind.config.js` — CSS variables in `@theme inline`, custom dark variant via `@custom-variant dark`.

## Testing
- **SQLite `:memory:`** in testing (phpunit.xml). No external DB needed.
- Tests use PHPUnit 12. Suites: `tests/Unit`, `tests/Feature`. Standard `RefreshDatabase` pattern expected.
- Run single test: `php artisan test --filter=TestName` or `vendor/bin/phpunit tests/Feature/FooTest.php`.

## DB / migrations
- Default DB: `database/database.sqlite` (file-based). `DB_CONNECTION=sqlite` in `.env`.
- Migrations in `database/migrations/` — includes users, cache, jobs, products. Product has `user_id` FK and `quantity` field.
- Factories: `database/factories/UserFactory.php` only. No ProductFactory yet.
- Seeders: `AdminDatabaseSeeder`, `UserDatabaseSeeder`.

## Route model binding
- `AdminController` uses implicit binding on `Product $product`.
- Public routes: `fragrances/{id}` uses explicit `whereNumber`.
