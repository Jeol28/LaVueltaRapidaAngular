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
import { HeroMenuComponent } from './menu/hero-menu/hero-menu.component';
import { TablaMenuComponent } from './menu/tabla-menu/tabla-menu.component';
import { MenuAdminComponent } from './menu/menu-admin/menu-admin.component';
import { LandingComponent } from './landing-page/landing/landing.component';
import { AddProductComponent } from './menu/add-product/add-product.component';
import { CardsComponent } from './cards/cards.component';
import { FeaturesComponents } from './landing-page/features/features.component';

import { OperariosAdminComponent } from './operarios/operarios-admin/operarios-admin.component';
import { HeroOperariosComponent } from './operarios/hero-operarios/hero-operarios.component';
import { TablaOperariosComponent } from './operarios/tabla-operarios/tabla-operarios.component';
import { AddOperarioComponent } from './operarios/add-operario/add-operario.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    SizeStamentComponent,
    MenuCarouselComponent,
    ExperienceComponent,
    FooterComponent,
    HeroMenuComponent,
    TablaMenuComponent,
    MenuAdminComponent,
    LandingComponent,
    AddProductComponent,
    CardsComponent,
    FeaturesComponents,

    OperariosAdminComponent,
    HeroOperariosComponent,
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
