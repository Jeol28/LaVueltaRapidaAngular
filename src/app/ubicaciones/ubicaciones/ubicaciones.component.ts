import { Component } from '@angular/core';

export interface HorarioDia {
  dia: string;
  rango: string;
}

export interface SedeUbicacion {
  nombre: string;
  zona: string;
  direccion: string;
  telefono: string;
  mapsUrl: string;
  comoLlegar: string;
  servicios: string[];
  horario: HorarioDia[];
  parqueadero: string;
  imagenIcono: string;
  destacada?: boolean;
}

export interface ZonaCobertura {
  nombre: string;
  barrios: string[];
  tiempoMin: number;
  tiempoMax: number;
  envioDesde: number;
  color: string;
}

export interface ProximaApertura {
  ciudad: string;
  zona: string;
  fecha: string;
}

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent {
  sedes: SedeUbicacion[] = [
    {
      nombre: 'CHAPINERO',
      zona: 'Zona G · Centro',
      direccion: 'Calle 67 # 10-23, Bogotá',
      telefono: '+57 300 123 4567',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Calle+67+%2310-23+Bogot%C3%A1',
      comoLlegar: 'A 3 cuadras del Parque Lourdes. TransMilenio: estación Calle 63.',
      servicios: ['Salón en sede', 'Pantallas F1', 'Domicilio', 'Para llevar', 'Pago con tarjeta'],
      horario: [
        { dia: 'Lun a Jue', rango: '11:30 a.m. - 10:30 p.m.' },
        { dia: 'Vie y Sáb', rango: '11:30 a.m. - 11:30 p.m.' },
        { dia: 'Domingo',   rango: '12:00 p.m. - 10:00 p.m.' }
      ],
      parqueadero: 'Parqueadero asociado a 1 cuadra · COP 4.000/hora',
      imagenIcono: '🏁',
      destacada: true
    },
    {
      nombre: 'USAQUÉN',
      zona: 'Norte · Zona Rosa Norte',
      direccion: 'Carrera 6 # 119-45, Bogotá',
      telefono: '+57 300 234 5678',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Carrera+6+%23119-45+Bogot%C3%A1',
      comoLlegar: 'Frente al Parque de Usaquén. Buseta: ruta K23 baja en Cra. 7 con 119.',
      servicios: ['Salón en sede', 'Terraza', 'Pantallas F1', 'Domicilio', 'Para llevar'],
      horario: [
        { dia: 'Lun a Jue', rango: '12:00 p.m. - 10:30 p.m.' },
        { dia: 'Vie y Sáb', rango: '12:00 p.m. - 11:30 p.m.' },
        { dia: 'Domingo',   rango: '12:00 p.m. - 10:00 p.m.' }
      ],
      parqueadero: 'Parqueadero propio · 12 cupos gratis durante el consumo',
      imagenIcono: '🏎️'
    },
    {
      nombre: 'SALITRE',
      zona: 'Occidente · Cerca a Salitre Plaza',
      direccion: 'Av. Calle 26 # 68-35, Bogotá',
      telefono: '+57 300 345 6789',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av+Calle+26+%2368-35+Bogot%C3%A1',
      comoLlegar: 'A 200 m de Salitre Plaza. TransMilenio: estación Salitre - El Greco.',
      servicios: ['Salón en sede', 'Zona kids', 'Pantallas F1', 'Domicilio', 'Para llevar'],
      horario: [
        { dia: 'Lun a Jue', rango: '11:30 a.m. - 10:00 p.m.' },
        { dia: 'Vie y Sáb', rango: '11:30 a.m. - 11:00 p.m.' },
        { dia: 'Domingo',   rango: '11:30 a.m. - 10:00 p.m.' }
      ],
      parqueadero: 'Parqueadero del centro comercial · 2 horas gratis',
      imagenIcono: '🏆'
    }
  ];

  zonas: ZonaCobertura[] = [
    {
      nombre: 'NORTE',
      barrios: ['Usaquén', 'Cedritos', 'Santa Bárbara', 'Country Club', 'Chicó Norte', 'Multicentro'],
      tiempoMin: 25,
      tiempoMax: 40,
      envioDesde: 5000,
      color: '#e10600'
    },
    {
      nombre: 'CENTRO',
      barrios: ['Chapinero', 'Quinta Camacho', 'La Soledad', 'Teusaquillo', 'La Macarena', 'La Candelaria'],
      tiempoMin: 20,
      tiempoMax: 35,
      envioDesde: 4000,
      color: '#ffb800'
    },
    {
      nombre: 'OCCIDENTE',
      barrios: ['Salitre', 'Modelia', 'Hayuelos', 'Ciudad Salitre', 'Capellanía', 'Engativá'],
      tiempoMin: 25,
      tiempoMax: 45,
      envioDesde: 5000,
      color: '#10b981'
    }
  ];

  proximasAperturas: ProximaApertura[] = [
    { ciudad: 'Bogotá', zona: 'Suba · Plaza Imperial',          fecha: 'Q3 2026' },
    { ciudad: 'Bogotá', zona: 'Sur · Centro Mayor',             fecha: 'Q4 2026' },
    { ciudad: 'Medellín', zona: 'El Poblado · Provenza',        fecha: 'Q1 2027' },
    { ciudad: 'Cali',     zona: 'Granada · Av. 9 Norte',        fecha: 'Q2 2027' }
  ];
}
