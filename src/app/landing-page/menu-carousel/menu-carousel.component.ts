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
    this.comidas = this.comidaService.getAll();
  }

  ngAfterViewInit(): void {
    new Swiper('.menu-swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 20,
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
        768: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }
    });
  }
}
