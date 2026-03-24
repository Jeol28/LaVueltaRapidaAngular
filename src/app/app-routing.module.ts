import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './landing/home/home.component';
import { MenuAdminComponent } from './menu/menu-admin/menu-admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu-admin', component: MenuAdminComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
