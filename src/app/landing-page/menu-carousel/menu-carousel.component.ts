import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Comida } from '../../models/comida.model';
import { ComidaService } from '../../services/comida.service';

@Component({
  selector: 'app-menu-carousel',
  templateUrl: './menu-carousel.component.html',
  styleUrls: ['./menu-carousel.component.css']
})
export class MenuCarouselComponent implements OnInit, AfterViewInit {

  comidas: Comida[] = [];

  constructor(private comidaService: ComidaService) {}

  ngOnInit(): void {
    this.comidaService.getAll().subscribe(comidas => {
      this.comidas = comidas;
      this.initializeSwiper();
    });
  }

  ngAfterViewInit(): void {
    // Keep empty; Swiper initialization happens after data is loaded.
  }

  private initializeSwiper(): void {
    new Swiper('.menu-swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 1.2,
      spaceBetween: 16,
      loop: true,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      breakpoints: {
        480: {
          slidesPerView: 2,
          spaceBetween: 16
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 18
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20
        },
        1280: {
          slidesPerView: 5,
          spaceBetween: 20
        }
      }
    });
  }
}
