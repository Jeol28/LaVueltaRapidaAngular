import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing-page/landing/landing.component';
import { ProductosAdminComponent } from './admin/productos/productos-admin/productos-admin.component';
import { AddProductComponent } from './admin/productos/add-product/add-product.component';
import { OperariosAdminComponent } from './admin/operarios/operarios-admin/operarios-admin.component';
import { AddOperarioComponent } from './admin/operarios/add-operario/add-operario.component';
import { AdicionalesAdminComponent } from './admin/adicionales/adicionales-admin/adicionales-admin.component';
import { AddAdicionalComponent } from './admin/adicionales/add-adicional/add-adicional.component';
import { MenuComponent } from './menu/menu.component';
import { ProductoDetalleComponent } from './producto/producto-detalle/producto-detalle.component';
import { CarritoComponent } from './carrito/carrito.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PerfilComponent } from './perfiles/perfil/perfil.component';
import { PerfilOperadorComponent } from './perfiles/perfil-operador/perfil-operador.component';
import { PerfilAdminComponent } from './perfiles/perfil-admin/perfil-admin.component';
import { OperadorInicioComponent } from './operador/operador-inicio/operador-inicio.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'perfil-operador', component: PerfilOperadorComponent },
  { path: 'perfil-admin', component: PerfilAdminComponent },
  { path: 'operador/inicio', component: OperadorInicioComponent },

  // ── Productos ──
  { path: 'producto/menutabla',     component: ProductosAdminComponent },
  { path: 'producto/add',           component: AddProductComponent },
  { path: 'producto/update/:id',    component: AddProductComponent },
  { path: 'producto/:id',           component: ProductoDetalleComponent },

  // ── Operarios ──
  { path: 'admin/operarios',         component: OperariosAdminComponent },
  { path: 'admin/operarios/agregar', component: AddOperarioComponent },

  // ── Adicionales ──
  { path: 'admin/adicionales',            component: AdicionalesAdminComponent },
  { path: 'admin/adicionales/add',        component: AddAdicionalComponent },
  { path: 'admin/adicionales/update/:id', component: AddAdicionalComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
