import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing-page/landing/landing.component';
import { MenuAdminComponent } from './admin/productos/productos-admin/menu-admin.component';
import { AddProductComponent } from './admin/productos/add-product/add-product.component';
import { OperariosAdminComponent } from './admin/operarios/operarios-admin/operarios-admin.component';
import { AddOperarioComponent } from './admin/operarios/add-operario/add-operario.component';

const routes: Routes = [
  { path: '', component: LandingComponent },

  // ── Comidas ──
  { path: 'producto/menutabla',     component: MenuAdminComponent },
  { path: 'producto/add',           component: AddProductComponent },
  { path: 'producto/update/:id',    component: AddProductComponent },

  // ── Operarios ──
  { path: 'admin/operarios',         component: OperariosAdminComponent },
  { path: 'admin/operarios/agregar', component: AddOperarioComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
