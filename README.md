# Ecommerce Frontend (Next.js 16)

Frontend de e-commerce en **Next.js 16 (App Router) + TypeScript + Tailwind CSS** que consume la
API REST de Laravel 12 (Sanctum + Stripe). Flujo completo: catálogo → carrito → orden → pago con
Stripe → confirmación e historial.

## Arquitectura

| Necesidad | Solución |
| --- | --- |
| Lecturas (catálogo, detalle, historial) | **Server Components** con `fetch` en el servidor (`lib/api/*`) |
| Mutaciones (login, registro, crear orden, pagar) | **Server Actions** (`app/actions/*`) llamadas desde formularios con `onSubmit` + `React.SubmitEvent` |
| Token de sesión | Cookie **httpOnly** (`token`, `SameSite=Lax`, `Secure` en producción): la crean las Server Actions de login/registro y la eliminan **Route Handlers** (`/api/auth/logout`, `/api/auth/expired`). El navegador nunca ve el token |
| Rutas protegidas | `proxy.ts` (cookie presente) + `requireUser()` en cada página (validez real contra `/auth/me`) |
| Carrito | Estado local (`localStorage`) con `useSyncExternalStore` (`lib/cart-store.ts`) |
| Datos al día tras mutaciones | `updateTag()` / `revalidatePath()` en `app/actions/orders.ts` |
| Carga y errores | `loading.tsx` y `error.tsx` por segmento + `<Suspense>` en catálogo e historial |
| Tipos | Carpeta `types/` (`User`, `Product`, `Order`, `CartItem`, `ApiError`…) |

```
app/
  actions/        auth.ts, orders.ts   (Server Actions)
  checkout/       page, loading, error, success/
  orders/         page, loading, error, [id]/
  products/[id]/  page, loading, error
  login/ register/ cart/
components/       auth, cart, layout, orders, products, ui
lib/              api/ (client, products, orders, errors), session.ts, cart-store.ts, format.ts
types/            tipos compartidos
proxy.ts          protección rápida de rutas
```

## Configuración

1. Copia el archivo de ejemplo y ajusta la URL base de la API:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   # .env.example
   API_BASE_URL=http://localhost:8000/api
   ```

   `API_BASE_URL` incluye `/api` y **no** lleva `NEXT_PUBLIC_` (solo la usa el servidor).

2. Levanta la API Laravel (`php artisan serve`, puerto 8000 por defecto) con MySQL activo y las
   migraciones/seeders aplicados (`php artisan migrate --seed`).

## Ejecutar el proyecto

```bash
npm install
npm run dev        # http://localhost:3000
```

Producción:

```bash
npm run build
npm start
```

## Rutas implementadas

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Catálogo con búsqueda y paginación (`GET /products`) | Público |
| `/products/[id]` | Detalle de producto (`GET /products/{id}`) | Público |
| `/register` | Registro (`POST /auth/register`) | Público |
| `/login` | Inicio de sesión (`POST /auth/login`) | Público |
| `/cart` | Carrito (estado local) | Público |
| `/checkout` | Crea la orden (`POST /orders`) y el pago (`POST /orders/{id}/pay`) → Stripe | Protegido |
| `/checkout/success?order_id=` | Confirmación de compra (`GET /orders/{id}`) | Protegido |
| `/orders` | Historial del usuario (`GET /orders/user/{id}`) | Protegido |
| `/orders/[id]` | Detalle de una orden, con botón de pago si está pendiente | Protegido |
| `/profile` | Mi perfil: datos de la cuenta (solo lectura) | Protegido |

Endpoints adicionales usados: `GET /auth/me` (sesión) y `POST /auth/logout` (revoca el token).

### Route Handlers del frontend

| Ruta | Método | Función |
| --- | --- | --- |
| `/api/auth/logout` | POST | Revoca el token en la API, borra la cookie httpOnly y redirige a `/` |
| `/api/auth/expired` | GET | Sesión vencida/revocada: borra la cookie obsoleta y redirige a `/login?next=...` |

### Flujo de autenticación

1. `/login` y `/register` envían el formulario (`onSubmit` con `React.SubmitEvent`) a una
   **Server Action** que llama a la API; si responde con un token, se guarda en la cookie httpOnly.
2. Los errores de la API (422, credenciales inválidas, cuenta inactiva) se muestran por campo y
   tras el éxito se redirige a la ruta original (`?next=`, validada para evitar open redirects).
3. `proxy.ts` bloquea rápido las rutas protegidas sin cookie, y `requireUser()` valida el token
   contra `/auth/me` en cada página protegida.

## Flujo de pago con Stripe

1. En `/checkout` se crea la orden y se solicita la sesión de Stripe Checkout; el usuario es
   redirigido a `checkout_url`.
2. Stripe notifica a la API por webhook (`POST /stripe/webhook`) y la orden pasa a `paid`.
   En local: `stripe listen --forward-to localhost:8000/api/stripe/webhook`.
3. Al volver, `/checkout/success?order_id=ID` muestra la confirmación y vacía el carrito.
4. Si el webhook no ha llegado, el botón **"Consultar estado del pago"** (Server Action →
   `POST /orders/{id}/sync-payment`) hace que la API consulte la sesión en Stripe y actualice la
   orden. Está en la confirmación, el historial y el detalle de órdenes pendientes.

> Backend: la API usa `FRONTEND_URL` (por defecto `http://localhost:3000`) para construir
> `success_url` (`/checkout/success?order_id={id}`) y `cancel_url` (`/orders/{id}`).

## Evidencias

### Rendimiento (Lighthouse)

Medido sobre el build de producción (`npm run build && npm start`), con la API local activa.
Reportes completos en la carpeta [`docs/`](./docs):

| Página | Dispositivo | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Catálogo `/` | Escritorio ([reporte](./docs/lighthouse-catalogo-escritorio.report.html)) | 100 | 100 | 100 | 100 | 0.7 s | 10 ms | 0 |
| Catálogo `/` | Móvil ([reporte](./docs/lighthouse-catalogo-movil.report.html)) | 92 | 100 | 100 | 100 | 3.0 s | 110 ms | 0 |
| Producto `/products/1` | Escritorio ([reporte](./docs/lighthouse-producto-escritorio.report.html)) | 100 | 100 | 100 | 100 | 0.6 s | 0 ms | 0 |
| Producto `/products/1` | Móvil ([reporte](./docs/lighthouse-producto-movil.report.html)) | 97 | 100 | 100 | 100 | 2.4 s | 100 ms | 0 |

> Los `.html` se abren en el navegador (descárgalos desde GitHub con *Download raw file*; GitHub
> no los renderiza). Los `.json` incluyen los mismos datos en crudo.

### Endpoints consumidos (Swagger)

Captura de la documentación de la API (`/api/documentation`): _agregar en `docs/swagger-endpoints.png`_.

### Flujo completo de compra

Captura o video del recorrido catálogo → carrito → checkout → Stripe → confirmación:
_agregar en `docs/flujo-compra.png` (o `.mp4`)_.
