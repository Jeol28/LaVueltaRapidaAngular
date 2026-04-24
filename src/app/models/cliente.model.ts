export interface Cliente {
  id: number;
  name: string;
  apellido: string;
  email: string;
  username: string;
  password?: string;
  currentPassword?: string;
  direccion: string;
  telefono: string;
}
