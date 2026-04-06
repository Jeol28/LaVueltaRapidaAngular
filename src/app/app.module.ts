import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
