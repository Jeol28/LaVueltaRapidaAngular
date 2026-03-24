import { Comida } from './comida.model';
import { LineaPedidoAdicional } from './linea-pedido-adicional.model';

export interface LineaPedido {
  id: number;
  cantidad: number;
  comida: Comida;
  adicionales: LineaPedidoAdicional[];
  carritoId: number | null;
  pedidoId: number | null;
}
