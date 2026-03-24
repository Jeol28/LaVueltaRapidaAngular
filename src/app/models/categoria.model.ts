import { Adicional } from './adicional.model';

export interface Categoria {
  id: number;
  name: string;
  adicionales: Adicional[];
}
