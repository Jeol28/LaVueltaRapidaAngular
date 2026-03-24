import { Cliente } from './cliente.model';
import { LineaPedido } from './linea-pedido.model';

export interface Carrito {
  id: number;
  cliente: Cliente;
  activo: boolean;
  lineasPedido: LineaPedido[];
}
