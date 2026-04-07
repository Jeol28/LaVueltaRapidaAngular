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
    perfil-admin/    - Admin profile page (view, edit credentials; reuses perfil CSS & PerfilInfoRowComponent)
  operador/
    perfil-operador/ - Operator profile page (view, edit; reuses perfil CSS & PerfilInfoRowComponent)
  cliente/
    perfil/          - Client profile page (view, edit, delete account)
    shared/
      perfil-info-row/ - Reusable info row component (icon + label + value)
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
- **Reusable components:** `PerfilInfoRowComponent` (icon + label + value row), `AdminHeroComponent` (admin page hero banner), `InputIconFieldComponent` (styled form inputs).

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
