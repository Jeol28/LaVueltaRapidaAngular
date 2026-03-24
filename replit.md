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
src/
  app/
    header/          - Site header component
    footer/          - Site footer component
    hero/            - Hero/landing section
    menu-carousel/   - Pizza menu with Swiper carousel
    experience/      - Restaurant atmosphere + OpenStreetMap
    size-stament/    - Pizza sizes / brand statement
  assets/Images/     - Racing and food imagery
  styles.css         - Global styles
  main.ts            - App entry point
angular.json         - Angular CLI workspace config
```

## Development

The app runs on port 5000 via Angular's dev server with all hosts allowed (required for Replit's proxy).

```bash
npm start   # runs ng serve on 0.0.0.0:5000
npm run build  # production build to dist/la-vuelta-rapida/
```

## Deployment

Configured as a static site deployment:
- **Build command:** `npm run build`
- **Public directory:** `dist/la-vuelta-rapida`
