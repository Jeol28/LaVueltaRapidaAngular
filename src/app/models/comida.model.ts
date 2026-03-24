import { Categoria } from './categoria.model';

export interface Comida {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  category: Categoria;
}
