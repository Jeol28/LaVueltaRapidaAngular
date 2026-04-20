import { LineaPedido } from './linea-pedido.model';

export interface CarritoBackend {
  id: number;
  lineas: LineaPedido[];
}
