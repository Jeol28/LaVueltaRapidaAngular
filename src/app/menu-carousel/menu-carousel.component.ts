import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-menu-carousel',
  templateUrl: './menu-carousel.component.html',
  styleUrls: ['./menu-carousel.component.css']
})
export class MenuCarouselComponent implements AfterViewInit {

  comidas = [
    {
      id: 1,
      name: 'Monza',
      description: 'Pizza clásica italiana',
      price: 25000,
      image: 'assets/Images/pizza-diavola.png'
    },
    {
      id: 2,
      name: 'Silverstone',
      description: 'Con pepperoni y queso',
      price: 28000,
      image: 'assets/Images/pizza-margherita.png'
    },

    {
      id: 3,
      name: 'Spa',
      description: 'Pizza con jamón y champiñones',
      price: 30000,
      image: 'assets/Images/pizza-pepperoni.png'
    },
    {
      id: 4,
      name: 'Suzuka',
      description: 'Pizza vegetariana con verduras frescas',
      price: 27000,
      image: 'assets/Images/pizza-prosciutto.png'
    },
    {
      id: 5,
      name: 'Interlagos',
      description: 'Pizza con pollo, maíz y salsa BBQ',
      price: 32000,
      image: 'assets/Images/pizza-quattro-formaggi.png'
    }

  ];

  ngAfterViewInit(): void {
    new Swiper('.menu-swiper', {
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