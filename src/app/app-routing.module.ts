import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing-page/landing.component';
import { MenuAdminComponent } from './menu/menu-admin/menu-admin.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'menu', component: MenuAdminComponent },
  { path: 'producto/menutabla', component: MenuAdminComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
