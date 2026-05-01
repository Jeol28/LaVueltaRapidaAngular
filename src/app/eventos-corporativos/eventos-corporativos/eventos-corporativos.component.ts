import { Component } from '@angular/core';

export interface ServicioItem {
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
}

export interface PaqueteCorporativo {
  nombre: string;
  subtitulo: string;
  precio: string;
  capacidad: string;
  color: string;
  destacado: boolean;
  items: string[];
}

@Component({
  selector: 'app-eventos-corporativos',
  templateUrl: './eventos-corporativos.component.html',
  styleUrls: ['./eventos-corporativos.component.css']
})
export class EventosCorporativosComponent {

  readonly servicios: ServicioItem[] = [
    {
      icono: '🖥️',
      titulo: 'PANTALLAS Y PROYECCIÓN',
      descripcion: 'Pantallas de alta definición disponibles para presentaciones, transmisiones en vivo o activaciones de marca durante tu evento.',
      color: '#e10600'
    },
    {
      icono: '🍕',
      titulo: 'CATERING CORPORATIVO',
      descripcion: 'Menú personalizado para tu equipo. Desde coffee breaks hasta banquetes completos con las mejores pizzas de Bogotá.',
      color: '#f0a500'
    },
    {
      icono: '🏎️',
      titulo: 'AMBIENTACIÓN TEMÁTICA',
      descripcion: 'Decoración F1 exclusiva que transforma nuestro restaurante en el pit lane perfecto para tu evento corporativo.',
      color: '#4a9eff'
    },
    {
      icono: '🎙️',
      titulo: 'SONIDO PROFESIONAL',
      descripcion: 'Equipos de sonido de alta calidad para presentaciones, discursos o simplemente para crear el ambiente perfecto.',
      color: '#22c55e'
    },
    {
      icono: '🤝',
      titulo: 'COORDINACIÓN DEDICADA',
      descripcion: 'Un anfitrión corporativo exclusivo coordina cada detalle antes y durante tu evento para que todo salga perfecto.',
      color: '#a855f7'
    },
    {
      icono: '🅿️',
      titulo: 'ZONA EXCLUSIVA',
      descripcion: 'Área privada del restaurante disponible para tu equipo. Sin interrupciones, sin ruido externo — solo tu empresa.',
      color: '#ffd700'
    },
  ];

  readonly paquetes: PaqueteCorporativo[] = [
    {
      nombre: 'REUNIÓN',
      subtitulo: 'Ideal para equipos pequeños',
      precio: 'Desde $180.000',
      capacidad: 'Hasta 10 personas',
      color: '#555',
      destacado: false,
      items: [
        'Zona privada reservada',
        'Coffee break incluido',
        'Menú ejecutivo por persona',
        'Pantalla para presentaciones',
        'Sonido básico',
        'Coordinador de evento',
      ]
    },
    {
      nombre: 'TEAM BUILDING',
      subtitulo: 'La experiencia completa',
      precio: 'Desde $380.000',
      capacidad: 'Hasta 30 personas',
      color: '#e10600',
      destacado: true,
      items: [
        'Zona VIP exclusiva',
        'Coffee break + almuerzo completo',
        'Menú F1 premium por persona',
        'Ambientación temática F1',
        'Sistema de sonido profesional',
        'Pantallas HD para presentaciones',
        'Actividades de integración F1',
        'Coordinador dedicado',
        'Material de bienvenida para cada asistente',
      ]
    },
    {
      nombre: 'LANZAMIENTO',
      subtitulo: 'Para eventos de alto impacto',
      precio: 'Desde $700.000',
      capacidad: 'Hasta 60 personas',
      color: '#ffd700',
      destacado: false,
      items: [
        'Restaurante completo disponible',
        'Catering premium personalizado',
        'Ambientación y branding corporativo',
        'Sistema audiovisual completo',
        'Transmisión en vivo opcional',
        'Fotógrafo profesional incluido',
        'Barra de bebidas ilimitada',
        'Producción del evento completa',
        'Coordinación pre y durante el evento',
      ]
    },
  ];
}
