# E-Commerce — Laravel + Inertia React SPA

## Stack
- Laravel 13 + PHP 8.3+, Inertia.js v3 (React 19), Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite` plugin), shadcn/ui (new-york style, JSX)
- SQLite (dev + test), database session/cache/queue
- `@/` alias → `resources/js/`

## Commands
| Command | Notes |
|---|---|
| `composer setup` | Full bootstrap: install, `.env`, `key:generate`, `migrate`, `npm i --ignore-scripts`, `npm run build` |
| `composer dev` | 4 concurrent: `php artisan serve`, `queue:listen`, `pail` (logs), `vite` |
| `composer test` | `config:clear` then `php artisan test` |
| `npm run dev` | Vite dev only |
| `npm run build` | Vite production build |

**`.npmrc` has `ignore-scripts=true`** — postinstall scripts need `--ignore-scripts=false`.

## Routes (`routes/web.php`)
- **Public (guest):** `/`, `/cart`, `/fragrances/{id}` (explicit `whereNumber`)
- **Auth (guest):** `/login`, `/register`
- **Auth (logged-in):** `/admin/*`, `/cart/*`, `/orders`, `/checkout`
- **Logout:** `POST /logout` (auth middleware)

No explicit admin middleware — role check (`user->role === 'admin'`) is in `AuthController` only (redirect after login/register).

## Cart architecture (critical detail)
- **Guest:** Cart stored in `localStorage` key `fragrance_cart`, cross-tab synced via `storage` event.
- **Logged in:** Cart fetched from `GET /cart/items` on mount. All mutations (`addToCart`, `updateQty`, `removeItem`, `clearCart`) call `fetch()` to server endpoints — **not** Inertia's `router.post()` (endpoints return JSON, not Inertia responses).
- **CSRF token** is in `<meta name="csrf-token">` (`resources/views/app.blade.php`). All `fetch()` calls read it via `document.querySelector('meta[name="csrf-token"]')?.content`.
- `POST /cart/sync` **replaces all items** (deletes all + re-inserts). Used by `addToCart` and `updateQty`.
- `POST /cart/remove` deletes a single `CartItem` by `product_id`.
- `POST /cart/clear` deletes all `CartItem` for the user.
- Login/register merges client cart to server via `request->input('cart')`.

## Admin
- `AdminController` uses implicit route model binding on `Product $product`.
- Routes: product CRUD, order listing/update.

## Shared props (`HandleInertiaRequests.php`)
Only `auth.user` → `{ id, name, email }`.

## JS conventions
- `cn()` in `@/lib/utils.js` (clsx + tailwind-merge)
- `currency()` in `@/data/fragrances.js` — formats as PHP (₱)
- Tailwind v4: no `tailwind.config.js` — `@theme inline` CSS vars, `@custom-variant dark`.

## Testing
- SQLite `:memory:` (phpunit.xml), no external DB.
- PHPUnit 12. Suites: `tests/Unit`, `tests/Feature`. Standard `RefreshDatabase` pattern.
- Single test: `php artisan test --filter=TestName` or `vendor/bin/phpunit tests/Feature/FooTest.php`.
- **No `ProductFactory`** exists — only `UserFactory`.
- Seeders: `AdminDatabaseSeeder` (admin: dancedreck456@gmail.com / 1234), `UserDatabaseSeeder` (3 users, password: password).

## Missing / incomplete
- `OrderController` is referenced in routes but **does not exist** yet.
- `app/Actions/` directory exists but is empty.
- No ProductFactory — create one if tests need products.
