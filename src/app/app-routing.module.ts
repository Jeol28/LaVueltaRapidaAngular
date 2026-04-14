import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing-page/landing/landing.component';
import { MenuComponent } from './menu/menu.component';
import { ProductoDetalleComponent } from './producto/producto-detalle/producto-detalle.component';
import { CarritoComponent } from './carrito/carrito.component';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

import { PerfilComponent } from './perfiles/perfil/perfil.component';
import { PerfilOperadorComponent } from './perfiles/perfil-operador/perfil-operador.component';
import { PerfilAdminComponent } from './perfiles/perfil-admin/perfil-admin.component';

import { OperadorInicioComponent } from './operador/operador-inicio/operador-inicio.component';

import { ProductosAdminComponent } from './admin/productos/productos-admin/productos-admin.component';
import { AddProductComponent } from './admin/productos/add-product/add-product.component';

import { OperariosAdminComponent } from './admin/operarios/operarios-admin/operarios-admin.component';
import { AddOperarioComponent } from './admin/operarios/add-operario/add-operario.component';

const routes: Routes = [
  // 🏠 Public routes
  { path: '', component: LandingComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'carrito', component: CarritoComponent },

  // 🔐 Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 👤 Profiles
  { path: 'perfil', component: PerfilComponent },
  { path: 'perfil-operador', component: PerfilOperadorComponent },
  { path: 'perfil-admin', component: PerfilAdminComponent },

  // 👨‍🍳 Operador
  { path: 'operador/inicio', component: OperadorInicioComponent },

  // 📦 Admin - Productos
  { path: 'producto/menutabla', component: ProductosAdminComponent },
  { path: 'producto/add', component: AddProductComponent },
  { path: 'producto/update/:id', component: AddProductComponent },

  // 🔥 IMPORTANT: dynamic route AFTER static ones
  { path: 'producto/:id', component: ProductoDetalleComponent },

  // 🧑‍🔧 Admin - Operarios
  { path: 'admin/operarios', component: OperariosAdminComponent },
  { path: 'admin/operarios/agregar', component: AddOperarioComponent },

  // ❌ fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}