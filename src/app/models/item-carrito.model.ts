import { Adicional } from './adicional.model';
import { Comida } from './comida.model';

export interface ItemCarrito {
  lineaId?: number;
  comida: Comida;
  adicionales: Adicional[];
  cantidad: number;
}
