import { Injectable } from '@angular/core';
import { Comida } from '../models/comida.model';
import { CATEGORIAS, COMIDAS } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class ComidaService {

  getAll(): Comida[] {
    return COMIDAS;
  }

  getById(id: number): Comida | undefined {
    return COMIDAS.find(c => c.id === id);
  }

  getRecomendaciones(comida: Comida): Comida[] {
    return COMIDAS.filter(c => c.available && c.id !== comida.id && c.category.id === comida.category.id);
  }

  add(data: { name: string; description: string; price: number | null; categoryId: number | null; image: string; available: boolean }): void {
    const category = CATEGORIAS.find(c => c.id === data.categoryId);
    if (!category) return;
    const newId = COMIDAS.length > 0 ? Math.max(...COMIDAS.map(c => c.id)) + 1 : 1;
    COMIDAS.push({
      id: newId,
      name: data.name,
      description: data.description,
      price: data.price ?? 0,
      image: data.image,
      available: data.available,
      category
    });
  }

  update(id: number, data: { name: string; description: string; price: number | null; categoryId: number | null; image: string; available: boolean }): void {
    const index = COMIDAS.findIndex(c => c.id === id);
    if (index === -1) return;
    const category = CATEGORIAS.find(c => c.id === data.categoryId);
    if (!category) return;
    COMIDAS[index] = {
      ...COMIDAS[index],
      name: data.name,
      description: data.description,
      price: data.price ?? 0,
      image: data.image,
      available: data.available,
      category
    };
  }

  delete(id: number): void {
    const index = COMIDAS.findIndex(c => c.id === id);
    if (index !== -1) COMIDAS.splice(index, 1);
  }
}
