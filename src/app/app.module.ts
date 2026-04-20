import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HeroComponent } from './landing-page/hero/hero.component';
import { SizeStamentComponent } from './landing-page/size-stament/size-stament.component';
import { MenuCarouselComponent } from './landing-page/menu-carousel/menu-carousel.component';
import { ExperienceComponent } from './landing-page/experience/experience.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LandingComponent } from './landing-page/landing/landing.component';
import { CardsComponent } from './cards/cards.component';
import { FeaturesComponents } from './landing-page/features/features.component';

import { AdminHeroComponent } from './admin/shared/admin-hero/admin-hero.component';

import { ProductosAdminComponent } from './admin/productos/productos-admin/productos-admin.component';
import { TablaProductosComponent } from './admin/productos/tabla-productos/tabla-productos.component';
import { AddProductComponent } from './admin/productos/add-product/add-product.component';

import { OperariosAdminComponent } from './admin/operarios/operarios-admin/operarios-admin.component';
import { TablaOperariosComponent } from './admin/operarios/tabla-operarios/tabla-operarios.component';
import { AddOperarioComponent } from './admin/operarios/add-operario/add-operario.component';

import { AdicionalesAdminComponent } from './admin/adicionales/adicionales-admin/adicionales-admin.component';
import { TablaAdicionalesComponent } from './admin/adicionales/tabla-adicionales/tabla-adicionales.component';
import { AddAdicionalComponent } from './admin/adicionales/add-adicional/add-adicional.component';

import { MenuComponent } from './menu/menu.component';
import { ProductoDetalleComponent } from './producto/producto-detalle/producto-detalle.component';
import { CarritoComponent } from './carrito/carrito.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { InputIconFieldComponent } from './auth/shared/input-icon-field/input-icon-field.component';

import { PerfilComponent } from './perfiles/perfil/perfil.component';
import { PerfilInfoRowComponent } from './perfiles/shared/perfil-info-row/perfil-info-row.component';
import { PerfilOperadorComponent } from './perfiles/perfil-operador/perfil-operador.component';
import { PerfilAdminComponent } from './perfiles/perfil-admin/perfil-admin.component';
import { OperadorInicioComponent } from './operador/operador-inicio/operador-inicio.component';
import { OperadorHeroComponent } from './operador/shared/operador-hero/operador-hero.component';
import { TablaPedidosComponent } from './operador/tabla-pedidos/tabla-pedidos.component';
import { OperadorProductosComponent } from './operador/operador-productos/operador-productos.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    SizeStamentComponent,
    MenuCarouselComponent,
    ExperienceComponent,
    FooterComponent,
    LandingComponent,
    CardsComponent,
    FeaturesComponents,

    AdminHeroComponent,

    ProductosAdminComponent,
    TablaProductosComponent,
    AddProductComponent,

    OperariosAdminComponent,
    TablaOperariosComponent,
    AddOperarioComponent,

    AdicionalesAdminComponent,
    TablaAdicionalesComponent,
    AddAdicionalComponent,

    MenuComponent,
    ProductoDetalleComponent,
    CarritoComponent,
    LoginComponent,
    RegisterComponent,
    InputIconFieldComponent,

    PerfilComponent,
    PerfilInfoRowComponent,
    PerfilOperadorComponent,
    PerfilAdminComponent,
    OperadorInicioComponent,
    OperadorHeroComponent,
    TablaPedidosComponent,
    OperadorProductosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
