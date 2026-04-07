import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing-page/landing/landing.component';
import { ProductosAdminComponent } from './admin/productos/productos-admin/productos-admin.component';
import { AddProductComponent } from './admin/productos/add-product/add-product.component';
import { OperariosAdminComponent } from './admin/operarios/operarios-admin/operarios-admin.component';
import { AddOperarioComponent } from './admin/operarios/add-operario/add-operario.component';
import { LoginComponent } from './auth/login/login.component';
import { PerfilComponent } from './cliente/perfil/perfil.component';
import { PerfilOperadorComponent } from './operador/perfil-operador/perfil-operador.component';
import { PerfilAdminComponent } from './admin/perfil-admin/perfil-admin.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'perfil-operador', component: PerfilOperadorComponent },
  { path: 'perfil-admin', component: PerfilAdminComponent },

  // ── Productos ──
  { path: 'producto/menutabla',     component: ProductosAdminComponent },
  { path: 'producto/add',           component: AddProductComponent },
  { path: 'producto/update/:id',    component: AddProductComponent },

  // ── Operarios ──
  { path: 'admin/operarios',         component: OperariosAdminComponent },
  { path: 'admin/operarios/agregar', component: AddOperarioComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
