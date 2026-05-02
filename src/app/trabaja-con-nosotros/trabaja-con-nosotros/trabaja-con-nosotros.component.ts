import { Component } from '@angular/core';

export interface BeneficioItem {
  icono: string;
  titulo: string;
  descripcion: string;
  color: string;
}

export interface VacanteItem {
  cargo: string;
  area: string;
  modalidad: string;
  ubicacion: string;
  descripcion: string;
  requisitos: string[];
  destacada?: boolean;
}

export interface PasoProceso {
  numero: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-trabaja-con-nosotros',
  templateUrl: './trabaja-con-nosotros.component.html',
  styleUrls: ['./trabaja-con-nosotros.component.css']
})
export class TrabajaConNosotrosComponent {
  beneficios: BeneficioItem[] = [
    {
      icono: '💰',
      titulo: 'SALARIO COMPETITIVO',
      descripcion: 'Sueldo por encima del mínimo, propinas semanales y bonos por desempeño en cada turno.',
      color: '#e10600'
    },
    {
      icono: '📈',
      titulo: 'CRECIMIENTO REAL',
      descripcion: 'Plan de carrera claro: de auxiliar a líder de turno y, después, a coordinador de sede.',
      color: '#ffb800'
    },
    {
      icono: '🍕',
      titulo: 'BENEFICIOS DEL EQUIPO',
      descripcion: 'Comida durante tu turno, descuento del 50 % para tu familia y kit La Vuelta Rápida.',
      color: '#10b981'
    },
    {
      icono: '🏎️',
      titulo: 'AMBIENTE F1',
      descripcion: 'Trabaja rodeado de pasión por las carreras: música, eventos y la mejor energía cada día.',
      color: '#3b82f6'
    },
    {
      icono: '🎓',
      titulo: 'CAPACITACIÓN PAGA',
      descripcion: 'Aprende de verdad: pizza artesanal, servicio al cliente, manejo de horno y caja.',
      color: '#a855f7'
    },
    {
      icono: '🤝',
      titulo: 'CONTRATO DIRECTO',
      descripcion: 'Vinculación directa con la empresa, prestaciones de ley y todas las garantías legales.',
      color: '#f97316'
    }
  ];

  vacantes: VacanteItem[] = [
    {
      cargo: 'Pizzero / Cocinero',
      area: 'Cocina',
      modalidad: 'Tiempo completo',
      ubicacion: 'Bogotá · Chapinero',
      descripcion: 'Responsable de preparar y hornear nuestras pizzas artesanales siguiendo nuestras recetas y estándares de calidad.',
      requisitos: [
        'Mínimo 1 año de experiencia en cocina',
        'Conocimiento básico de hornos artesanales',
        'Disponibilidad para trabajar fines de semana'
      ],
      destacada: true
    },
    {
      cargo: 'Mesero / Mesera',
      area: 'Salón',
      modalidad: 'Medio tiempo',
      ubicacion: 'Bogotá · Usaquén',
      descripcion: 'Atención al cliente en mesa, manejo de comanda digital y construcción de la mejor experiencia para el comensal.',
      requisitos: [
        'Excelente actitud de servicio',
        'Bachillerato culminado',
        'Experiencia previa deseable (no obligatoria)'
      ]
    },
    {
      cargo: 'Domiciliario',
      area: 'Logística',
      modalidad: 'Tiempo completo',
      ubicacion: 'Bogotá · Todas las sedes',
      descripcion: 'Entrega de pedidos a domicilio en moto propia con tiempos récord y la mejor presentación.',
      requisitos: [
        'Moto propia con documentos al día',
        'Pase de conducción vigente',
        'Conocimiento de Bogotá'
      ]
    },
    {
      cargo: 'Cajero / Cajera',
      area: 'Atención',
      modalidad: 'Tiempo completo',
      ubicacion: 'Bogotá · Chapinero',
      descripcion: 'Manejo de caja, cierre diario, atención a clientes en barra y coordinación con cocina.',
      requisitos: [
        'Manejo básico de Excel',
        'Experiencia mínima de 6 meses en caja',
        'Atención al detalle'
      ]
    },
    {
      cargo: 'Auxiliar de Cocina',
      area: 'Cocina',
      modalidad: 'Medio tiempo',
      ubicacion: 'Bogotá · Usaquén',
      descripcion: 'Apoyo en preparación de ingredientes, organización de la cocina y mantenimiento de los estándares de higiene.',
      requisitos: [
        'Curso de manipulación de alimentos vigente',
        'Disponibilidad inmediata',
        'Trabajo en equipo'
      ]
    }
  ];

  proceso: PasoProceso[] = [
    {
      numero: '01',
      titulo: 'APLICA',
      descripcion: 'Envíanos tu hoja de vida indicando el cargo de tu interés. Revisamos cada postulación con cuidado.',
      icono: '📨'
    },
    {
      numero: '02',
      titulo: 'ENTREVISTA',
      descripcion: 'Si tu perfil encaja, te invitamos a una entrevista corta en la sede para conocernos en persona.',
      icono: '💬'
    },
    {
      numero: '03',
      titulo: 'PRUEBA EN PISTA',
      descripcion: 'Día de prueba pagado en la sede para que veas cómo trabajamos y nosotros veamos tu talento en acción.',
      icono: '🏁'
    },
    {
      numero: '04',
      titulo: 'BIENVENIDO',
      descripcion: 'Firma de contrato, capacitación inicial y entrega del kit oficial. ¡Bienvenido al equipo!',
      icono: '🏆'
    }
  ];
}
