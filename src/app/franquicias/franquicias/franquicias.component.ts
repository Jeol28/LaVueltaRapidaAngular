import { Component } from '@angular/core';

export interface BeneficioFranquiciaItem {
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
}

export interface ModeloFranquiciaItem {
  nombre: string;
  etiqueta: string;
  inversion: string;
  area: string;
  empleados: string;
  retorno: string;
  descripcion: string;
  incluye: string[];
  destacado?: boolean;
}

export interface PasoFranquicia {
  numero: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-franquicias',
  templateUrl: './franquicias.component.html',
  styleUrls: ['./franquicias.component.css']
})
export class FranquiciasComponent {
  beneficios: BeneficioFranquiciaItem[] = [
    {
      icono: '🏆',
      titulo: 'MARCA PROBADA',
      descripcion: 'Te apoyas en una marca con identidad fuerte, posicionada y con clientes fieles desde el día uno.',
      color: '#e10600'
    },
    {
      icono: '📚',
      titulo: 'CAPACITACIÓN COMPLETA',
      descripcion: 'Formación operativa, en cocina, servicio y administración para ti y todo tu equipo antes de abrir.',
      color: '#ffb800'
    },
    {
      icono: '🍕',
      titulo: 'RECETAS EXCLUSIVAS',
      descripcion: 'Acceso al recetario completo, proveedores certificados y procesos de cocina ya optimizados.',
      color: '#10b981'
    },
    {
      icono: '📣',
      titulo: 'MARKETING CENTRAL',
      descripcion: 'Campañas, redes sociales y material gráfico desarrollado por la marca, listo para tu sede.',
      color: '#3b82f6'
    },
    {
      icono: '🛠️',
      titulo: 'SOPORTE 360°',
      descripcion: 'Acompañamiento continuo en operación, tecnología, inventario y atención al cliente.',
      color: '#a855f7'
    },
    {
      icono: '💸',
      titulo: 'RETORNO ATRACTIVO',
      descripcion: 'Modelo de negocio validado con retorno de inversión proyectado entre 18 y 30 meses.',
      color: '#f97316'
    }
  ];

  modelos: ModeloFranquiciaItem[] = [
    {
      nombre: 'BOX EXPRESS',
      etiqueta: 'Punto rápido',
      inversion: 'Desde COP 95M',
      area: '20 - 35 m²',
      empleados: '3 - 5 personas',
      retorno: '18 - 24 meses',
      descripcion: 'Formato pequeño para zonas comerciales, food courts y centros empresariales. Foco 100 % en pedidos para llevar y a domicilio.',
      incluye: [
        'Equipos de cocina industriales',
        'Mobiliario y branding completo',
        'Capacitación inicial del equipo',
        'Soporte operativo el primer año'
      ]
    },
    {
      nombre: 'LOCAL ESTÁNDAR',
      etiqueta: 'Más popular',
      inversion: 'Desde COP 220M',
      area: '60 - 90 m²',
      empleados: '8 - 12 personas',
      retorno: '24 - 30 meses',
      descripcion: 'Local con salón para 30-40 comensales, barra y zona de pedidos para llevar. El formato más equilibrado y rentable.',
      incluye: [
        'Diseño arquitectónico F1 completo',
        'Equipos profesionales de pizza',
        'Sistema POS y carta digital',
        'Plan de marketing de apertura',
        'Soporte operativo continuo'
      ],
      destacado: true
    },
    {
      nombre: 'LOCAL PREMIUM',
      etiqueta: 'Experiencia F1',
      inversion: 'Desde COP 450M',
      area: '120 - 180 m²',
      empleados: '15 - 22 personas',
      retorno: '28 - 36 meses',
      descripcion: 'Local insignia con experiencia F1 inmersiva: pantallas de carreras en vivo, simulador, eventos privados y capacidad para 80+ personas.',
      incluye: [
        'Diseño completo + simulador F1',
        'Pantallas y sistema de transmisión',
        'Cocina ampliada y barra completa',
        'Programa de eventos corporativos',
        'Manager dedicado el primer semestre'
      ]
    }
  ];

  proceso: PasoFranquicia[] = [
    {
      numero: '01',
      titulo: 'CONTÁCTANOS',
      descripcion: 'Cuéntanos tu interés, ciudad y presupuesto. Recibirás el dossier completo del modelo de franquicia.',
      icono: '📩'
    },
    {
      numero: '02',
      titulo: 'EVALUACIÓN',
      descripcion: 'Revisión de tu perfil, experiencia y capacidad financiera. Te orientamos sobre el modelo ideal para ti.',
      icono: '🔍'
    },
    {
      numero: '03',
      titulo: 'PROPUESTA',
      descripcion: 'Análisis de la zona, propuesta económica formal y firma del precontrato de franquicia.',
      icono: '📄'
    },
    {
      numero: '04',
      titulo: 'APERTURA',
      descripcion: 'Construcción del local, capacitación, soporte de apertura y la mejor inauguración para tu sede.',
      icono: '🏁'
    }
  ];
}
