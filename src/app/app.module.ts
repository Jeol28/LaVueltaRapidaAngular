import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HeroComponent } from './landing/hero/hero.component';
import { SizeStamentComponent } from './landing/size-stament/size-stament.component';
import { MenuCarouselComponent } from './landing/menu-carousel/menu-carousel.component';
import { ExperienceComponent } from './landing/experience/experience.component';
import { FooterComponent } from './layout/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    SizeStamentComponent,
    MenuCarouselComponent,
    ExperienceComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
