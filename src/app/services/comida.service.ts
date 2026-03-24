import { Injectable } from '@angular/core';
import { Comida } from '../models/comida.model';
import { Categoria } from '../models/categoria.model';
import { COMIDAS, CATEGORIAS } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class ComidaService {

  private comidas: Comida[] = COMIDAS.map(c => ({ ...c }));
  private nextId: number = Math.max(...COMIDAS.map(c => c.id)) + 1;

  getAll(): Comida[] {
    return this.comidas;
  }

  getById(id: number): Comida | undefined {
    return this.comidas.find(c => c.id === id);
  }

  add(data: { name: string; description: string; price: number | null; categoryId: number | null; image: string; available: boolean }): void {
    const cat = CATEGORIAS.find(c => c.id === Number(data.categoryId))!;
    this.comidas.push({
      id: this.nextId++,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      image: data.image,
      available: data.available,
      category: cat
    });
  }

  update(id: number, data: { name: string; description: string; price: number | null; categoryId: number | null; image: string; available: boolean }): void {
    const idx = this.comidas.findIndex(c => c.id === id);
    if (idx === -1) return;
    const cat = CATEGORIAS.find(c => c.id === Number(data.categoryId))!;
    this.comidas[idx] = {
      ...this.comidas[idx],
      name: data.name,
      description: data.description,
      price: Number(data.price),
      image: data.image,
      available: data.available,
      category: cat
    };
  }

  delete(id: number): void {
    this.comidas = this.comidas.filter(c => c.id !== id);
  }
}
