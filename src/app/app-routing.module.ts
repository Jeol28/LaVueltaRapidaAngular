import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing-page/landing/landing.component';
import { MenuAdminComponent } from './menu/menu-admin/menu-admin.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'producto/menutabla', component: MenuAdminComponent },
  { path: 'producto/add', component: AddProductComponent },
  { path: 'producto/update/:id', component: AddProductComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
