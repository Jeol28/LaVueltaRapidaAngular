import { Component } from '@angular/core';

export interface IncluyeItem {
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
}

export interface PaqueteCumpleanos {
  nombre: string;
  subtitulo: string;
  precio: string;
  capacidad: string;
  color: string;
  destacado: boolean;
  items: string[];
}

@Component({
  selector: 'app-cumpleanos',
  templateUrl: './cumpleanos.component.html',
  styleUrls: ['./cumpleanos.component.css']
})
export class CumpleanosComponent {

  readonly incluye: IncluyeItem[] = [
    {
      icono: '🏎️',
      titulo: 'DECORACIÓN F1 EXCLUSIVA',
      descripcion: 'Mesa temática con banderines de cuadros, globos rojos y negros, y ambientación de paddock para hacer único tu día.',
      color: '#e10600'
    },
    {
      icono: '🍕',
      titulo: 'MENÚ ESPECIAL DE CUMPLEAÑOS',
      descripcion: 'Pizza temática personalizada con el nombre del cumpleañero y bebidas a elección. La mejor pizza de Bogotá en tu día especial.',
      color: '#f0a500'
    },
    {
      icono: '🎂',
      titulo: 'PASTEL SORPRESA',
      descripcion: 'Pastel temático de Fórmula 1 con velas incluidas. Coordinamos la entrada con nuestra canción especial de La Vuelta Rápida.',
      color: '#4a9eff'
    },
    {
      icono: '📸',
      titulo: 'ZONA DE FOTOS',
      descripcion: 'Backdrop exclusivo F1 para que el recuerdo de tu cumpleaños sea tan épico como una vuelta en el pit lane.',
      color: '#22c55e'
    },
    {
      icono: '🎟️',
      titulo: 'MESA RESERVADA',
      descripcion: 'Tu espacio asegurado sin preocupaciones. Nosotros preparamos todo antes de tu llegada para que solo disfrutes.',
      color: '#a855f7'
    },
    {
      icono: '🏁',
      titulo: 'ATENCIÓN DEDICADA',
      descripcion: 'Un anfitrión exclusivo para tu grupo durante toda la celebración. En La Vuelta Rápida eres el piloto del día.',
      color: '#ffd700'
    },
  ];

  readonly paquetes: PaqueteCumpleanos[] = [
    {
      nombre: 'BÁSICO',
      subtitulo: 'La experiencia esencial',
      precio: 'Desde $120.000',
      capacidad: 'Hasta 6 personas',
      color: '#555',
      destacado: false,
      items: [
        'Mesa reservada',
        'Decoración básica F1',
        'Pizza de cumpleaños (1 pizza grande)',
        'Bebidas incluidas (x6)',
        'Velas y canción sorpresa',
      ]
    },
    {
      nombre: 'PREMIUM',
      subtitulo: 'La experiencia completa',
      precio: 'Desde $250.000',
      capacidad: 'Hasta 12 personas',
      color: '#e10600',
      destacado: true,
      items: [
        'Mesa reservada zona especial',
        'Decoración premium F1 completa',
        'Pizzas ilimitadas (2h)',
        'Bebidas incluidas (x12)',
        'Pastel temático F1',
        'Zona de fotos con backdrop',
        'Anfitrión dedicado',
      ]
    },
    {
      nombre: 'VIP PADDOCK',
      subtitulo: 'La experiencia definitiva',
      precio: 'Desde $450.000',
      capacidad: 'Hasta 20 personas',
      color: '#ffd700',
      destacado: false,
      items: [
        'Zona VIP exclusiva del restaurante',
        'Decoración full F1 personalizada',
        'Menú completo premium por persona',
        'Barra de bebidas ilimitada (3h)',
        'Pastel personalizado con foto',
        'Backdrop + fotógrafo incluido',
        'Anfitrión + DJ de ambiente',
        'Recordatorio temático para cada invitado',
      ]
    },
  ];
}
