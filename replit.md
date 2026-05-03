# La Vuelta Rápida

A Formula 1-themed pizzeria web application targeting a Bogotá, Colombia audience. Features racing-inspired branding with pizzas named after legendary F1 circuits.

## Tech Stack

- **Framework:** Angular 16
- **Language:** TypeScript 5.1
- **Styling:** CSS + Bootstrap Icons
- **Libraries:** Swiper (menu carousel), ngx-bootstrap, RxJS
- **Package Manager:** npm
- **Build Tool:** Angular CLI 16

## Project Structure

```
src/app/
  layout/
    header/          - Site header (handles auth state and role-based nav)
    footer/          - Site footer
  landing-page/      - Public landing page (hero, carousel, experience, features)
  auth/
    login/           - Login component (validates admin, operador, cliente)
    shared/          - Reusable auth UI (input-icon-field)
  admin/
    shared/          - Admin hero component
    productos/       - Product management (list, add, edit)
    operarios/       - Operator management (list, add, edit)
  perfiles/
    perfil/          - Client profile page (view, edit, delete account)
    perfil-operador/ - Operator profile page (view, edit)
    perfil-admin/    - Admin profile page (view, edit credentials)
    shared/
      perfil-info-row/ - Reusable info row component (icon + label + value)
  nuestra-historia/  - "Nuestra historia" public page (hero, timeline, cifras, valores)
                      reusable cards: nh-timeline-item, nh-valor-card
  trabaja-con-nosotros/ - "Trabaja con nosotros" public page (hero, beneficios,
                      vacantes, proceso) with reusable cards: tn-beneficio-card,
                      tn-vacante-card
  franquicias/       - "Franquicias" public page (hero, beneficios, modelos,
                      proceso) with reusable cards: fr-beneficio-card,
                      fr-modelo-card
  contacto/          - "Contacto" public page (hero, canales, sedes, FAQ
                      acordeón) with reusable items: ct-canal-card,
                      ct-sede-card, ct-faq-item
  ubicaciones/       - "Ubicaciones" public page (hero with stats, sedes
                      detalladas, próximas aperturas) with reusable cards:
                      ub-sede-card
  pago/              - VueltaPay payment gateway integrated with Mercado Pago.
                      Route /pago/:pedidoId shows F1-themed pedido summary +
                      single "Pagar" button → POST /api/mp/preference (proxied
                      to local Node mp-server) → redirect to Mercado Pago
                      Checkout Pro (real PSE, tarjeta, Efecty, etc).
                      Return URL /pago/resultado/:pedidoId reads MP query params
                      (collection_status, payment_id) and shows aprobado /
                      pendiente / rechazado / desconocido state, fetching full
                      payment detail from /api/mp/payment/:id. Auto-redirects
                      to /perfil#mis-pedidos on success.
                      Legacy F1-themed simulated checkout had methods Tarjeta /
                      PSE / Nequi / Daviplata. Carrito redirects here after
                      creating a pedido (state.total). Auto-redirect to
                      /perfil#mis-pedidos on success. Requires login.
  data/
    mock-data.ts     - Central mock data (CLIENTES, ADMINISTRADORES, OPERADORES, COMIDAS, etc.)
  models/            - TypeScript interfaces for all entities
  services/          - Business logic and CRUD for comidas, operadores, etc.
assets/Images/       - Racing and food imagery
styles.css           - Global styles
```

## Auth Roles

| Role       | Credentials               | Redirect after login       |
|------------|---------------------------|----------------------------|
| Admin      | admin / admin123          | /producto/menutabla        |
| Operador   | vale_op / vale123         | /producto/menutabla        |
| Cliente    | jorge / jorge123          | /menu                      |

- Admins see full nav: COMIDAS, OPERARIOS, DOMICILIARIOS, ADICIONALES
- Operadores see: COMIDAS only
- Clientes see: MENÚ, EXPERIENCIA, CAMPEONATO, EVENTOS F1 + carrito

## Key Features

- **Perfil (/perfil):** Accessible only to logged-in clients via clicking their username in the header. Shows a F1-themed driver card with all client data, edit mode for modifying info, and account deletion.
- **Login:** Unified login for all three roles with role-based routing.
- **Menú (/menu):** Public product catalog grouped by category. Each card links to `/producto/:id`.
- **Detalle de producto (/producto/:id):** Full product detail page with image, base price panel, customizable adicionales with real-time subtotal, add-to-cart button with toast notification, and a recommendations section showing other products in the same category.
- **Nuestra Historia (/nuestra-historia):** Public page linked from the footer. Built from reusable section components (`nh-hero`, `nh-timeline`, `nh-cifras`, `nh-valores`) and item/card components (`nh-timeline-item`, `nh-valor-card`). Fully responsive down to ~250px.
- **Trabaja con Nosotros (/trabaja-con-nosotros):** Public careers page linked from the footer. Sections: hero, beneficios (6 cards), vacantes (5 job listings with mailto postulation), proceso (4 steps). CTA links to `mailto:talento@lavueltarapida.co` and WhatsApp. Fully responsive down to ~250px.
- **Franquicias (/franquicias):** Public franchises page linked from the footer. Sections: hero with stats (sedes/modelos/inversión), beneficios (6 cards), modelos (3 franchise tiers: Box Express, Local Estándar destacado, Local Premium with investment/area/team/ROI metrics + included features), proceso (4 steps). CTA links to `mailto:franquicias@lavueltarapida.co` and WhatsApp. Fully responsive down to ~250px.
- **Contacto (/contacto):** Public contact page linked from the footer. Sections: hero, canales (4 channel cards: teléfono, pedidos, WhatsApp, información — each with its own accent color), sedes (3 sede cards Chapinero/Usaquén/Salitre with address, hours, phone and Google Maps link), FAQ accordion (6 collapsible Q&A items with toggle state per item). Final CTA links to `/menu` and WhatsApp. Fully responsive down to ~250px.
- **Ubicaciones (/ubicaciones):** Public locations page linked from the footer (more detailed than Contacto's sede cards). Sections: hero with stats strip (sedes activas, minutos promedio, barrios cubiertos), sedes activas (3 cards with per-day horarios, services chips, "cómo llegar" hints, parking info, ver-en-mapa + llamar buttons), zonas de cobertura (3 zone cards Norte/Centro/Occidente with barrios, tiempo range, envío desde and color dot), próximas aperturas (4 coming-soon cards with city, zone and target quarter). Final CTA links to `/menu` and `/contacto`. Fully responsive down to ~250px.
- **Reusable components:** `PerfilInfoRowComponent` (icon + label + value row), `AdminHeroComponent` (admin page hero banner), `InputIconFieldComponent` (styled form inputs), `CardsComponent` (clickable product card).

## Development

The app runs on port 5000 via Angular's dev server with all hosts allowed (required for Replit's proxy).

```bash
npm start       # runs ng serve on 0.0.0.0:5000
npm run build   # production build to dist/la-vuelta-rapida/
```

## Deployment

Configured as a static site deployment:
- **Build command:** `npm run build`
- **Public directory:** `dist/la-vuelta-rapida`
