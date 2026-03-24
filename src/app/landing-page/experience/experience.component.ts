import { Component } from '@angular/core';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {

  features = [
    {
      icon: 'assets/Images/Transmision.png',
      title: 'Transmisiones en vivo',
      desc: 'Disfruta cada carrera en pantallas HD mientras saboreas tu pizza.'
    },
    {
      icon: 'assets/Images/Ambiente.png',
      title: 'Ambiente de circuito',
      desc: 'Decoración auténtica que te transporta al paddock de F1.'
    },
    {
      icon: 'assets/Images/Ranking.png',
      title: 'Ranking de pilotos',
      desc: 'Compite con otros clientes por el primer lugar en el leaderboard.'
    },
    {
      icon: 'assets/Images/atmosfera.png',
      title: 'Atmósfera competitiva',
      desc: 'Siente la adrenalina de la competencia en cada bocado.'
    }
  ];

}
