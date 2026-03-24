import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {

  @ViewChild('statsSection') statsSection!: ElementRef;

  // valores reales
  clientesHoy = 156;
  entregaMin = 30;
  rating = 4.9;

  // valores animados (lo que se muestra)
  clientesHoyDisplay = 0;
  entregaDisplay = '0min';
  ratingDisplay = '0★';

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.statsSection.nativeElement);
  }

  startCounters() {
    this.animateCounter(this.clientesHoy, 1800, (val) => {
      this.clientesHoyDisplay = val;
    });

    this.animateCounter(this.entregaMin, 1800, (val) => {
      this.entregaDisplay = val + 'min';
    });

    this.animateCounter(this.rating, 1800, (val) => {
      this.ratingDisplay = val + '★';
    });
  }

  animateCounter(target: number, duration: number, callback: (val: any) => void) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    const update = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const value = isFloat
        ? (target * eased).toFixed(1)
        : Math.round(target * eased);

      callback(value);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
}