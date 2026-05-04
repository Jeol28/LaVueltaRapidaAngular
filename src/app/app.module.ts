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

import { DomiciliariosAdminComponent } from './admin/domiciliarios/domiciliarios-admin/domiciliarios-admin.component';
import { TablaDomiciliariosComponent } from './admin/domiciliarios/tabla-domiciliarios/tabla-domiciliarios.component';
import { AddDomiciliarioComponent } from './admin/domiciliarios/add-domiciliario/add-domiciliario.component';

import { PedidosAdminComponent } from './admin/pedidos/pedidos-admin/pedidos-admin.component';
import { TablaPedidosAdminComponent } from './admin/pedidos/tabla-pedidos/tabla-pedidos.component';

import { MenuComponent } from './menu/menu.component';
import { ProductoDetalleComponent } from './producto/producto-detalle/producto-detalle.component';
import { CarritoComponent } from './carrito/carrito.component';
import { PagoComponent } from './pago/pago.component';
import { ResultadoPagoComponent } from './pago/resultado/resultado-pago.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { InputIconFieldComponent } from './auth/shared/input-icon-field/input-icon-field.component';
import { AuthFormCardComponent } from './auth/shared/auth-form-card/auth-form-card.component';
import { RecuperarComponent } from './auth/recuperar/recuperar.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

import { PerfilComponent } from './perfiles/perfil/perfil.component';
import { PerfilInfoRowComponent } from './perfiles/shared/perfil-info-row/perfil-info-row.component';
import { PerfilOperadorComponent } from './perfiles/perfil-operador/perfil-operador.component';
import { PerfilAdminComponent } from './perfiles/perfil-admin/perfil-admin.component';
import { OperadorInicioComponent } from './operador/operador-inicio/operador-inicio.component';
import { OperadorHeroComponent } from './operador/shared/operador-hero/operador-hero.component';
import { TablaPedidosComponent } from './operador/tabla-pedidos/tabla-pedidos.component';

import { TerminosComponent } from './terminos/terminos.component';
import { TcHeroComponent } from './terminos/tc-hero/tc-hero.component';
import { TcSeccionComponent } from './terminos/tc-seccion/tc-seccion.component';

import { PrivacidadComponent } from './privacidad/privacidad.component';
import { PpHeroComponent } from './privacidad/pp-hero/pp-hero.component';
import { PpSeccionComponent } from './privacidad/pp-seccion/pp-seccion.component';

import { UbicacionesComponent } from './ubicaciones/ubicaciones/ubicaciones.component';
import { UbHeroComponent } from './ubicaciones/ub-hero/ub-hero.component';
import { UbSedesComponent } from './ubicaciones/ub-sedes/ub-sedes.component';
import { UbSedeCardComponent } from './ubicaciones/ub-sede-card/ub-sede-card.component';
import { UbProximaComponent } from './ubicaciones/ub-proxima/ub-proxima.component';

import { ContactoComponent } from './contacto/contacto/contacto.component';
import { CtHeroComponent } from './contacto/ct-hero/ct-hero.component';
import { CtCanalesComponent } from './contacto/ct-canales/ct-canales.component';
import { CtCanalCardComponent } from './contacto/ct-canal-card/ct-canal-card.component';
import { CtSedesComponent } from './contacto/ct-sedes/ct-sedes.component';
import { CtSedeCardComponent } from './contacto/ct-sede-card/ct-sede-card.component';
import { CtFaqComponent } from './contacto/ct-faq/ct-faq.component';
import { CtFaqItemComponent } from './contacto/ct-faq-item/ct-faq-item.component';

import { FranquiciasComponent } from './franquicias/franquicias/franquicias.component';
import { FrHeroComponent } from './franquicias/fr-hero/fr-hero.component';
import { FrBeneficiosComponent } from './franquicias/fr-beneficios/fr-beneficios.component';
import { FrBeneficioCardComponent } from './franquicias/fr-beneficio-card/fr-beneficio-card.component';
import { FrModelosComponent } from './franquicias/fr-modelos/fr-modelos.component';
import { FrModeloCardComponent } from './franquicias/fr-modelo-card/fr-modelo-card.component';
import { FrProcesoComponent } from './franquicias/fr-proceso/fr-proceso.component';

import { TrabajaConNosotrosComponent } from './trabaja-con-nosotros/trabaja-con-nosotros/trabaja-con-nosotros.component';
import { TnHeroComponent } from './trabaja-con-nosotros/tn-hero/tn-hero.component';
import { TnBeneficiosComponent } from './trabaja-con-nosotros/tn-beneficios/tn-beneficios.component';
import { TnBeneficioCardComponent } from './trabaja-con-nosotros/tn-beneficio-card/tn-beneficio-card.component';
import { TnVacantesComponent } from './trabaja-con-nosotros/tn-vacantes/tn-vacantes.component';
import { TnVacanteCardComponent } from './trabaja-con-nosotros/tn-vacante-card/tn-vacante-card.component';
import { TnProcesoComponent } from './trabaja-con-nosotros/tn-proceso/tn-proceso.component';

import { NuestraHistoriaComponent } from './nuestra-historia/nuestra-historia/nuestra-historia.component';
import { NhHeroComponent } from './nuestra-historia/nh-hero/nh-hero.component';
import { NhTimelineComponent } from './nuestra-historia/nh-timeline/nh-timeline.component';
import { NhTimelineItemComponent } from './nuestra-historia/nh-timeline-item/nh-timeline-item.component';
import { NhValoresComponent } from './nuestra-historia/nh-valores/nh-valores.component';
import { NhValorCardComponent } from './nuestra-historia/nh-valor-card/nh-valor-card.component';
import { NhCifrasComponent } from './nuestra-historia/nh-cifras/nh-cifras.component';

import { F1StandingsComponent } from './f1-standings/main/f1-standings.component';
import { EventosComponent } from './eventos/eventos/eventos.component';
import { CarrerasEnVivoComponent } from './carreras-en-vivo/carreras-en-vivo/carreras-en-vivo.component';
import { CumpleanosComponent } from './cumpleanos/cumpleanos/cumpleanos.component';
import { EventosCorporativosComponent } from './eventos-corporativos/eventos-corporativos/eventos-corporativos.component';
import { EcHeroComponent } from './eventos-corporativos/ec-hero/ec-hero.component';
import { EcServicioCardComponent } from './eventos-corporativos/ec-servicio-card/ec-servicio-card.component';
import { EcServiciosComponent } from './eventos-corporativos/ec-servicios/ec-servicios.component';
import { EcPaqueteCardComponent } from './eventos-corporativos/ec-paquete-card/ec-paquete-card.component';
import { EcPaquetesComponent } from './eventos-corporativos/ec-paquetes/ec-paquetes.component';
import { CbHeroComponent } from './cumpleanos/cb-hero/cb-hero.component';
import { CbIncluyeCardComponent } from './cumpleanos/cb-incluye-card/cb-incluye-card.component';
import { CbIncluyeComponent } from './cumpleanos/cb-incluye/cb-incluye.component';
import { CbPaqueteCardComponent } from './cumpleanos/cb-paquete-card/cb-paquete-card.component';
import { CbPaquetesComponent } from './cumpleanos/cb-paquetes/cb-paquetes.component';
import { ClvHeroComponent } from './carreras-en-vivo/clv-hero/clv-hero.component';
import { ClvProximaCarreraComponent } from './carreras-en-vivo/clv-proxima-carrera/clv-proxima-carrera.component';
import { ClvPlataformaCardComponent } from './carreras-en-vivo/clv-plataforma-card/clv-plataforma-card.component';
import { ClvSeccionPlataformasComponent } from './carreras-en-vivo/clv-seccion-plataformas/clv-seccion-plataformas.component';
import { EventosHeroComponent } from './eventos/eventos-hero/eventos-hero.component';
import { EventoCardComponent } from './eventos/evento-card/evento-card.component';
import { EventosSeccionComponent } from './eventos/eventos-seccion/eventos-seccion.component';
import { F1HeroComponent } from './f1-standings/f1-hero/f1-hero.component';
import { F1TabControlsComponent } from './f1-standings/f1-tab-controls/f1-tab-controls.component';
import { F1DriversTableComponent } from './f1-standings/f1-drivers-table/f1-drivers-table.component';
import { F1ConstructorsTableComponent } from './f1-standings/f1-constructors-table/f1-constructors-table.component';
import { F1VideosComponent } from './f1-standings/f1-videos/f1-videos.component';

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

    DomiciliariosAdminComponent,
    TablaDomiciliariosComponent,
    AddDomiciliarioComponent,

    PedidosAdminComponent,
    TablaPedidosAdminComponent,

    MenuComponent,
    ProductoDetalleComponent,
    CarritoComponent,
    PagoComponent,
    ResultadoPagoComponent,
    LoginComponent,
    RegisterComponent,
    InputIconFieldComponent,
    AuthFormCardComponent,
    RecuperarComponent,
    ResetPasswordComponent,

    PerfilComponent,
    PerfilInfoRowComponent,
    PerfilOperadorComponent,
    PerfilAdminComponent,
    OperadorInicioComponent,
    OperadorHeroComponent,
    TablaPedidosComponent,

    TerminosComponent,
    TcHeroComponent,
    TcSeccionComponent,

    PrivacidadComponent,
    PpHeroComponent,
    PpSeccionComponent,

    UbicacionesComponent,
    UbHeroComponent,
    UbSedesComponent,
    UbSedeCardComponent,
    UbProximaComponent,

    ContactoComponent,
    CtHeroComponent,
    CtCanalesComponent,
    CtCanalCardComponent,
    CtSedesComponent,
    CtSedeCardComponent,
    CtFaqComponent,
    CtFaqItemComponent,

    FranquiciasComponent,
    FrHeroComponent,
    FrBeneficiosComponent,
    FrBeneficioCardComponent,
    FrModelosComponent,
    FrModeloCardComponent,
    FrProcesoComponent,

    TrabajaConNosotrosComponent,
    TnHeroComponent,
    TnBeneficiosComponent,
    TnBeneficioCardComponent,
    TnVacantesComponent,
    TnVacanteCardComponent,
    TnProcesoComponent,

    NuestraHistoriaComponent,
    NhHeroComponent,
    NhTimelineComponent,
    NhTimelineItemComponent,
    NhValoresComponent,
    NhValorCardComponent,
    NhCifrasComponent,

    F1StandingsComponent,
    F1HeroComponent,
    EventosComponent,
    CarrerasEnVivoComponent,
    CumpleanosComponent,
    CbHeroComponent,
    CbIncluyeCardComponent,
    CbIncluyeComponent,
    CbPaqueteCardComponent,
    CbPaquetesComponent,
    EventosCorporativosComponent,
    EcHeroComponent,
    EcServicioCardComponent,
    EcServiciosComponent,
    EcPaqueteCardComponent,
    EcPaquetesComponent,
    ClvHeroComponent,
    ClvProximaCarreraComponent,
    ClvPlataformaCardComponent,
    ClvSeccionPlataformasComponent,
    EventosHeroComponent,
    EventoCardComponent,
    EventosSeccionComponent,
    F1TabControlsComponent,
    F1DriversTableComponent,
    F1ConstructorsTableComponent,
    F1VideosComponent,
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
