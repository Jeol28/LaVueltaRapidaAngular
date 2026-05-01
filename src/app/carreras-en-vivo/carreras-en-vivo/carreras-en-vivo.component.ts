import { Component } from '@angular/core';

export interface ExperienciaItem {
  sigla: string;   // emoji
  nombre: string;  // título de la card
  descripcion: string;
  color: string;
}

interface RaceInfo {
  round: number;
  shortName: string;
  circuit: string;
  location: string;
  date: string;
  image: string;
  endDate: string;
}

@Component({
  selector: 'app-carreras-en-vivo',
  templateUrl: './carreras-en-vivo.component.html',
  styleUrls: ['./carreras-en-vivo.component.css']
})
export class CarrerasEnVivoComponent {

  private readonly today = new Date();

  private readonly races: RaceInfo[] = [
    { round: 1,  shortName: 'GP AUSTRALIA',     circuit: 'Albert Park Circuit',            location: 'Melbourne, Australia',      date: '6–8 Mar 2026',      endDate: '2026-03-08', image: 'assets/Images/australia-track.png'   },
    { round: 2,  shortName: 'GP CHINA',          circuit: 'Shanghai International Circuit', location: 'Shanghái, China',           date: '13–15 Mar 2026',    endDate: '2026-03-15', image: 'assets/Images/china-track.png'       },
    { round: 3,  shortName: 'GP JAPÓN',          circuit: 'Suzuka Circuit',                 location: 'Suzuka, Japón',             date: '27–29 Mar 2026',    endDate: '2026-03-29', image: 'assets/Images/japan-track.png'       },
    { round: 4,  shortName: 'GP MIAMI',          circuit: 'Miami International Autodrome',  location: 'Miami, Estados Unidos',     date: '1–3 May 2026',      endDate: '2026-05-03', image: 'assets/Images/miami-track.png'       },
    { round: 5,  shortName: 'GP CANADÁ',         circuit: 'Circuit Gilles-Villeneuve',      location: 'Montreal, Canadá',          date: '22–24 May 2026',    endDate: '2026-05-24', image: 'assets/Images/canada-track.png'      },
    { round: 6,  shortName: 'GP MÓNACO',         circuit: 'Circuit de Monaco',              location: 'Mónaco',                    date: '5–7 Jun 2026',      endDate: '2026-06-07', image: 'assets/Images/monaco-track.png'      },
    { round: 7,  shortName: 'GP BARCELONA',      circuit: 'Circuit de Barcelona-Catalunya', location: 'Barcelona, España',         date: '12–14 Jun 2026',    endDate: '2026-06-14', image: 'assets/Images/barcelona-track.png'   },
    { round: 8,  shortName: 'GP AUSTRIA',        circuit: 'Red Bull Ring',                  location: 'Spielberg, Austria',        date: '26–28 Jun 2026',    endDate: '2026-06-28', image: 'assets/Images/austria-track.png'     },
    { round: 9,  shortName: 'GP GRAN BRETAÑA',   circuit: 'Silverstone Circuit',            location: 'Silverstone, Reino Unido',  date: '3–5 Jul 2026',      endDate: '2026-07-05', image: 'assets/Images/uk-track.png'          },
    { round: 10, shortName: 'GP BÉLGICA',        circuit: 'Circuit Spa-Francorchamps',      location: 'Spa, Bélgica',              date: '17–19 Jul 2026',    endDate: '2026-07-19', image: 'assets/Images/belgium-track.png'     },
    { round: 11, shortName: 'GP HUNGRÍA',        circuit: 'Hungaroring',                    location: 'Budapest, Hungría',         date: '24–26 Jul 2026',    endDate: '2026-07-26', image: 'assets/Images/hungary-track.png'     },
    { round: 12, shortName: 'GP PAÍSES BAJOS',   circuit: 'Circuit Zandvoort',              location: 'Zandvoort, Países Bajos',   date: '21–23 Ago 2026',    endDate: '2026-08-23', image: 'assets/Images/netherlands-track.png' },
    { round: 13, shortName: 'GP ITALIA',         circuit: 'Autodromo Nazionale Monza',      location: 'Monza, Italia',             date: '4–6 Sep 2026',      endDate: '2026-09-06', image: 'assets/Images/italy-track.png'       },
    { round: 14, shortName: 'GP MADRID',         circuit: 'Madring',                        location: 'Madrid, España',            date: '11–13 Sep 2026',    endDate: '2026-09-13', image: 'assets/Images/madrid-track.png'      },
    { round: 15, shortName: 'GP AZERBAIYÁN',     circuit: 'Baku City Circuit',              location: 'Bakú, Azerbaiyán',          date: '24–26 Sep 2026',    endDate: '2026-09-26', image: 'assets/Images/azerbijan-track.png'   },
    { round: 16, shortName: 'GP SINGAPUR',       circuit: 'Marina Bay Street Circuit',      location: 'Singapur',                  date: '9–11 Oct 2026',     endDate: '2026-10-11', image: 'assets/Images/singapore-track.png'   },
    { round: 17, shortName: 'GP ESTADOS UNIDOS', circuit: 'Circuit of the Americas',        location: 'Austin, Estados Unidos',    date: '23–25 Oct 2026',    endDate: '2026-10-25', image: 'assets/Images/austin-track.png'      },
    { round: 18, shortName: 'GP MÉXICO',         circuit: 'Autódromo Hermanos Rodríguez',   location: 'Ciudad de México, México',  date: '30 Oct–1 Nov 2026', endDate: '2026-11-01', image: 'assets/Images/mexico-track.png'      },
    { round: 19, shortName: 'GP BRASIL',         circuit: 'Autodromo José Carlos Pace',     location: 'São Paulo, Brasil',         date: '6–8 Nov 2026',      endDate: '2026-11-08', image: 'assets/Images/brazil-track.png'      },
    { round: 20, shortName: 'GP LAS VEGAS',      circuit: 'Las Vegas Strip Circuit',        location: 'Las Vegas, Estados Unidos', date: '19–21 Nov 2026',    endDate: '2026-11-21', image: 'assets/Images/vegas-track.png'       },
    { round: 21, shortName: 'GP QATAR',          circuit: 'Lusail International Circuit',   location: 'Lusail, Qatar',             date: '27–29 Nov 2026',    endDate: '2026-11-29', image: 'assets/Images/qatar-track.png'       },
    { round: 22, shortName: 'GP ABU DABI',       circuit: 'Yas Marina Circuit',             location: 'Abu Dabi, EAU',             date: '4–6 Dic 2026',      endDate: '2026-12-06', image: 'assets/Images/uae-track.png'         },
  ];

  get proximaCarrera(): RaceInfo | undefined {
    return this.races.find(r => new Date(r.endDate) >= this.today);
  }

  get proximasCarreras(): RaceInfo[] {
    return this.races.filter(r => new Date(r.endDate) >= this.today).slice(1, 6);
  }

  readonly experiencia: ExperienciaItem[] = [
    {
      sigla: '🖥️',
      nombre: 'PANTALLAS GIGANTES',
      descripcion: 'Vive cada vuelta en nuestras pantallas de alta definición. Ningún ángulo se pierde — desde la salida hasta el podio.',
      color: '#e10600'
    },
    {
      sigla: '🍕',
      nombre: 'MENÚ EXCLUSIVO DE CARRERA',
      descripcion: 'Pizzas temáticas y bebidas especiales diseñadas para cada Gran Premio. Comer bien mientras ves F1 es parte de la experiencia.',
      color: '#f0a500'
    },
    {
      sigla: '🏎️',
      nombre: 'AMBIENTE DE PADDOCK',
      descripcion: 'Decoración F1 auténtica, comentarios en vivo y la emoción colectiva de vivir cada adelantamiento con otros fanáticos.',
      color: '#4a9eff'
    },
    {
      sigla: '🎟️',
      nombre: 'RESERVA TU MESA',
      descripcion: 'Los fines de semana de carrera se llenan rápido. Asegura tu lugar con anticipación y llega sin preocupaciones.',
      color: '#22c55e'
    },
  ];
}
