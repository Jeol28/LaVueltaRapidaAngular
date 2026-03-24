import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MenuAdminComponent } from './menu/menu-admin/menu-admin.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'menu', component: MenuAdminComponent },
  { path: 'producto/menutabla', component: MenuAdminComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
