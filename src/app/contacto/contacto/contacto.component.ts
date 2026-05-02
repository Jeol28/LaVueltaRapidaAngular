import { Component } from '@angular/core';

export interface CanalContacto {
  icono: string;
  titulo: string;
  detalle: string;
  enlace: string;
  ctaTexto: string;
  externo?: boolean;
  color: string;
}

export interface SedeContacto {
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  mapsUrl: string;
  destacada?: boolean;
}

export interface FaqItem {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  canales: CanalContacto[] = [
    {
      icono: '📞',
      titulo: 'LLÁMANOS',
      detalle: '+57 300 123 4567',
      enlace: 'tel:+573001234567',
      ctaTexto: 'Llamar ahora',
      color: '#e10600'
    },
    {
      icono: '📩',
      titulo: 'PEDIDOS',
      detalle: 'pedidos@lavueltarapida.co',
      enlace: 'mailto:pedidos@lavueltarapida.co',
      ctaTexto: 'Enviar correo',
      color: '#ffb800'
    },
    {
      icono: '💬',
      titulo: 'WHATSAPP',
      detalle: 'Respuesta en menos de 5 minutos',
      enlace: 'https://wa.me/573001234567',
      ctaTexto: 'Escribir por WhatsApp',
      externo: true,
      color: '#10b981'
    },
    {
      icono: '✉️',
      titulo: 'INFORMACIÓN',
      detalle: 'hola@lavueltarapida.co',
      enlace: 'mailto:hola@lavueltarapida.co',
      ctaTexto: 'Enviar correo',
      color: '#3b82f6'
    }
  ];

  sedes: SedeContacto[] = [
    {
      nombre: 'CHAPINERO',
      direccion: 'Calle 67 # 10-23, Bogotá',
      telefono: '+57 300 123 4567',
      horario: 'Lun a Dom · 11:30 a.m. - 11:00 p.m.',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Calle+67+%2310-23+Bogot%C3%A1',
      destacada: true
    },
    {
      nombre: 'USAQUÉN',
      direccion: 'Carrera 6 # 119-45, Bogotá',
      telefono: '+57 300 234 5678',
      horario: 'Lun a Dom · 12:00 p.m. - 11:00 p.m.',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Carrera+6+%23119-45+Bogot%C3%A1'
    },
    {
      nombre: 'SALITRE',
      direccion: 'Av. Calle 26 # 68-35, Bogotá',
      telefono: '+57 300 345 6789',
      horario: 'Lun a Dom · 11:30 a.m. - 10:30 p.m.',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av+Calle+26+%2368-35+Bogot%C3%A1'
    }
  ];

  faqs: FaqItem[] = [
    {
      pregunta: '¿Hacen domicilios a toda Bogotá?',
      respuesta: 'Sí, cada sede cubre las zonas cercanas. Al hacer tu pedido te confirmamos si tu dirección entra dentro del radio de cobertura. Tiempo promedio: 35 minutos.'
    },
    {
      pregunta: '¿Cuánto tarda mi pedido?',
      respuesta: 'En sede preparamos tu pizza en menos de 15 minutos. A domicilio el tiempo promedio es 35 minutos, dependiendo del tráfico y la zona.'
    },
    {
      pregunta: '¿Aceptan tarjeta y pagos digitales?',
      respuesta: 'Aceptamos efectivo, tarjeta débito y crédito, Nequi, Daviplata y PSE. En sede también puedes pagar con datáfono al momento de la entrega.'
    },
    {
      pregunta: '¿Puedo reservar para un grupo grande?',
      respuesta: 'Sí. Para grupos de 10 personas o más en sede, escríbenos por WhatsApp con al menos 24 horas de anticipación y te confirmamos disponibilidad.'
    },
    {
      pregunta: '¿Tienen opciones vegetarianas o sin gluten?',
      respuesta: 'Sí. Toda nuestra carta tiene opciones vegetarianas marcadas y manejamos masa sin gluten bajo pedido (con un costo adicional).'
    },
    {
      pregunta: '¿Cómo organizo un evento corporativo o un cumpleaños?',
      respuesta: 'Visita nuestras secciones de Cumpleaños y Eventos Corporativos en el sitio. También puedes escribirnos directamente a hola@lavueltarapida.co.'
    }
  ];
}
