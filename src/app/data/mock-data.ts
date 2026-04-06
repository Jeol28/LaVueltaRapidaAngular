import { Adicional } from '../models/adicional.model';
import { Administrador } from '../models/administrador.model';
import { Carrito } from '../models/carrito.model';
import { Categoria } from '../models/categoria.model';
import { Cliente } from '../models/cliente.model';
import { Comida } from '../models/comida.model';
import { Domiciliario } from '../models/domiciliario.model';
import { LineaPedido } from '../models/linea-pedido.model';
import { LineaPedidoAdicional } from '../models/linea-pedido-adicional.model';
import { Operador } from '../models/operador.model';
import { Pedido } from '../models/pedido.model';

// ─── ADICIONALES ──────────────────────────────────────────────────────────────

export const ADICIONALES: Adicional[] = [
  { id: 1, name: 'Extra Queso',       price: 3500,  available: true  },
  { id: 2, name: 'Pepperoni Extra',   price: 4000,  available: true  },
  { id: 3, name: 'Jalapeños',         price: 2500,  available: true  },
  { id: 4, name: 'Champiñones',       price: 3000,  available: true  },
  { id: 5, name: 'Aceituna Negra',    price: 2500,  available: true  },
  { id: 6, name: 'Tocineta Crispy',   price: 4500,  available: false },
];

// ─── CATEGORÍAS ───────────────────────────────────────────────────────────────

export const CATEGORIAS: Categoria[] = [
  {
    id: 1,
    name: 'Pizzas Clásicas',
    adicionales: [ADICIONALES[0], ADICIONALES[1], ADICIONALES[2]],
  },
  {
    id: 2,
    name: 'Pizzas Especiales',
    adicionales: [ADICIONALES[0], ADICIONALES[3], ADICIONALES[4]],
  },
  {
    id: 3,
    name: 'Pizzas Vegetarianas',
    adicionales: [ADICIONALES[2], ADICIONALES[3], ADICIONALES[4]],
  },
];

// ─── COMIDAS ──────────────────────────────────────────────────────────────────

export const COMIDAS: Comida[] = [
  {
    id: 1,
    name: 'Pizza Monaco',
    description: 'Mozzarella, tomate, albahaca fresca y aceite de oliva. El circuito más elegante en tu paladar.',
    price: 38000,
    image: 'assets/Images/pizza-margherita.png',
    available: true,
    category: CATEGORIAS[0],
  },
  {
    id: 2,
    name: 'Pizza Monza',
    description: 'Pepperoni, doble queso y salsa barbecue. Velocidad máxima de sabor.',
    price: 40000,
    image: 'assets/Images/pizza-pepperoni.png',
    available: true,
    category: CATEGORIAS[0],
  },
  {
    id: 3,
    name: 'Pizza Silverstone',
    description: 'Pollo BBQ, cebolla caramelizada, pimentón y mozzarella ahumada.',
    price: 42000,
    image: 'assets/Images/pizza-prosciutto.png',
    available: true,
    category: CATEGORIAS[1],
  },
  {
    id: 4,
    name: 'Pizza Spa',
    description: 'Jamón serrano, rúcula, tomates cherry y parmesano. La tradición belga en cada bocado.',
    price: 44000,
    image: 'assets/Images/pizza-quattro-formaggi.png',
    available: true,
    category: CATEGORIAS[1],
  },
  {
    id: 5,
    name: 'Pizza Diavola',
    description: 'Salami picante, jalapeños, salsa arrabbiata y mozzarella. Para los pilotos que no le temen al calor.',
    price: 41000,
    image: 'assets/Images/pizza-diavola.png',
    available: true,
    category: CATEGORIAS[0],
  },
  {
    id: 6,
    name: 'Pizza Jardín Suzuka',
    description: 'Tomate cherry, espinaca, champiñones, pimentón rojo y queso de cabra. Inspirada en los jardines de Japón.',
    price: 39000,
    image: 'assets/Images/pizza-margherita.png',
    available: true,
    category: CATEGORIAS[2],
  },
];

// ─── CLIENTES ─────────────────────────────────────────────────────────────────

export const CLIENTES: Cliente[] = [
  {
    id: 1,
    name: 'Jorge',
    apellido: 'Martínez',
    email: 'jorge.martinez@email.com',
    username: 'jorge',
    password: 'jorge123',
    direccion: 'Calle 100 # 15-20, Bogotá',
    telefono: '3001234567',
  },
  {
    id: 2,
    name: 'Laura',
    apellido: 'Gómez',
    email: 'laura.gomez@email.com',
    username: 'laurag',
    password: 'laura123',
    direccion: 'Carrera 7 # 45-10, Bogotá',
    telefono: '3109876543',
  },
  {
    id: 3,
    name: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    username: 'carlosr',
    password: 'carlos123',
    direccion: 'Av. El Dorado # 68-50, Bogotá',
    telefono: '3205554321',
  },
];

// ─── DOMICILIARIOS ────────────────────────────────────────────────────────────

export const DOMICILIARIOS: Domiciliario[] = [
  { id: 1, nombre: 'Andrés Pérez',   cedula: '1020304050', celular: '3001112233', disponible: true  },
  { id: 2, nombre: 'Felipe Torres',  cedula: '1030405060', celular: '3104445566', disponible: false },
  { id: 3, nombre: 'Miguel Vargas',  cedula: '1040506070', celular: '3207778899', disponible: true  },
];

// ─── ADMINISTRADORES ──────────────────────────────────────────────────────────

export const ADMINISTRADORES: Administrador[] = [
  { id: 1, usuario: 'admin',      contrasena: 'admin123'  },
  { id: 2, usuario: 'superadmin', contrasena: 'super123'  },
];

// ─── OPERADORES ───────────────────────────────────────────────────────────────

export const OPERADORES: Operador[] = [
  { id: 1, nombre: 'Valentina Ruiz',  usuario: 'vale_op',   contrasena: 'vale123'  },
  { id: 2, nombre: 'Santiago Mora',   usuario: 'santi_op',  contrasena: 'santi123' },
];

// ─── LÍNEAS DE PEDIDO (ADICIONALES POR LÍNEA) ─────────────────────────────────

const lineaAdicional1: LineaPedidoAdicional = { id: 1, adicional: ADICIONALES[0] };
const lineaAdicional2: LineaPedidoAdicional = { id: 2, adicional: ADICIONALES[1] };
const lineaAdicional3: LineaPedidoAdicional = { id: 3, adicional: ADICIONALES[3] };

// ─── LÍNEAS DE PEDIDO ─────────────────────────────────────────────────────────

export const LINEAS_PEDIDO: LineaPedido[] = [
  {
    id: 1,
    cantidad: 2,
    comida: COMIDAS[0],
    adicionales: [lineaAdicional1],
    carritoId: null,
    pedidoId: 1,
  },
  {
    id: 2,
    cantidad: 1,
    comida: COMIDAS[4],
    adicionales: [lineaAdicional2],
    carritoId: null,
    pedidoId: 1,
  },
  {
    id: 3,
    cantidad: 1,
    comida: COMIDAS[2],
    adicionales: [lineaAdicional3],
    carritoId: null,
    pedidoId: 2,
  },
  {
    id: 4,
    cantidad: 1,
    comida: COMIDAS[1],
    adicionales: [],
    carritoId: 1,
    pedidoId: null,
  },
  {
    id: 5,
    cantidad: 2,
    comida: COMIDAS[5],
    adicionales: [],
    carritoId: 1,
    pedidoId: null,
  },
];

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────

export const PEDIDOS: Pedido[] = [
  {
    id: 1,
    fechaCreacion: '2026-03-24T12:30:00',
    fechaEntrega:  '2026-03-24T13:00:00',
    estado: 'ENTREGADO',
    cliente: CLIENTES[0],
    lineasPedido: [LINEAS_PEDIDO[0], LINEAS_PEDIDO[1]],
    domiciliario: DOMICILIARIOS[1],
  },
  {
    id: 2,
    fechaCreacion: '2026-03-24T15:00:00',
    fechaEntrega:  '2026-03-24T15:35:00',
    estado: 'ENVIADO',
    cliente: CLIENTES[1],
    lineasPedido: [LINEAS_PEDIDO[2]],
    domiciliario: DOMICILIARIOS[0],
  },
  {
    id: 3,
    fechaCreacion: '2026-03-24T17:20:00',
    fechaEntrega:  '2026-03-24T17:55:00',
    estado: 'COCINANDO',
    cliente: CLIENTES[2],
    lineasPedido: [],
    domiciliario: null,
  },
];

// ─── CARRITOS ─────────────────────────────────────────────────────────────────

export const CARRITOS: Carrito[] = [
  {
    id: 1,
    cliente: CLIENTES[0],
    activo: true,
    lineasPedido: [LINEAS_PEDIDO[3], LINEAS_PEDIDO[4]],
  },
  {
    id: 2,
    cliente: CLIENTES[2],
    activo: true,
    lineasPedido: [],
  },
];
