import { Component } from '@angular/core';

export interface HitoTimeline {
  anio: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

export interface ValorItem {
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
}

export interface CifraItem {
  valor: string;
  etiqueta: string;
}

@Component({
  selector: 'app-nuestra-historia',
  templateUrl: './nuestra-historia.component.html',
  styleUrls: ['./nuestra-historia.component.css']
})
export class NuestraHistoriaComponent {
  hitos: HitoTimeline[] = [
    {
      anio: '2018',
      titulo: 'EL ARRANQUE',
      descripcion: 'Todo empezó en un food truck en el norte de Bogotá. Una pareja de fanáticos de la F1 con un horno artesanal y una idea: pizzas con la misma precisión de un equipo de boxes.',
      icono: '🏁'
    },
    {
      anio: '2020',
      titulo: 'PRIMERA SEDE',
      descripcion: 'Abrimos nuestro primer local en Chapinero, decorado como un pit lane real. Cada mesa lleva el nombre de un circuito legendario y las paredes celebran a los grandes de la F1.',
      icono: '🏎️'
    },
    {
      anio: '2022',
      titulo: 'NUEVAS PISTAS',
      descripcion: 'Llegaron dos sedes más en la ciudad y nació nuestra comunidad de hinchas que se reúne cada Gran Premio a vivir las carreras en pantalla gigante.',
      icono: '📺'
    },
    {
      anio: '2024',
      titulo: 'VUELTA RÁPIDA',
      descripcion: 'Lanzamos el servicio de domicilios express con tiempos récord en Bogotá. Pizza caliente, masa esponjosa y entrega en menos de 30 minutos.',
      icono: '⚡'
    },
    {
      anio: '2026',
      titulo: 'PODIO',
      descripcion: 'Hoy somos la pizzería F1 favorita de la ciudad, con miles de clientes felices, eventos cada fin de semana y el mismo amor por la velocidad y el buen sabor.',
      icono: '🏆'
    }
  ];

  valores: ValorItem[] = [
    {
      icono: '⚡',
      titulo: 'VELOCIDAD',
      descripcion: 'Tiempos de entrega récord. Cada minuto cuenta cuando se trata del mejor sabor.',
      color: '#e10600'
    },
    {
      icono: '🔥',
      titulo: 'PASIÓN',
      descripcion: 'Cada pizza la hacemos a mano, con masa propia, ingredientes seleccionados y mucho corazón.',
      color: '#ffb800'
    },
    {
      icono: '🎯',
      titulo: 'PRECISIÓN',
      descripcion: 'Como un equipo de boxes: cada paso medido, cada receta probada, cero improvisación.',
      color: '#3b82f6'
    },
    {
      icono: '🤝',
      titulo: 'COMUNIDAD',
      descripcion: 'Más que clientes, una afición. Carreras en vivo, eventos F1 y la mejor energía de la ciudad.',
      color: '#10b981'
    }
  ];

  cifras: CifraItem[] = [
    { valor: '50K+', etiqueta: 'CLIENTES FELICES' },
    { valor: '8', etiqueta: 'AÑOS ACELERANDO' },
    { valor: '4', etiqueta: 'SEDES EN BOGOTÁ' },
    { valor: '100%', etiqueta: 'PASIÓN F1' }
  ];
}
