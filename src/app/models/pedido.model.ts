import { Cliente } from './cliente.model';
import { Domiciliario } from './domiciliario.model';
import { EstadoPedido } from './estado-pedido.model';
import { LineaPedido } from './linea-pedido.model';

export interface Pedido {
  id: number;
  fechaCreacion: string;
  fechaEntrega: string;
  estado: EstadoPedido;
  cliente: Cliente;
  lineasPedido: LineaPedido[];
  domiciliario: Domiciliario | null;
}
