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
import { AddProductComponent } from './add-product/add-product.component';

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
    AddProductComponent
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
