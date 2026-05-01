import { Component } from '@angular/core';

export interface EventoF1 {
  round: number;
  shortName: string;
  circuit: string;
  location: string;
  date: string;
  endDate: string;  // ISO YYYY-MM-DD — último día del fin de semana de carrera
  image: string;
  flag: string;
  completed: boolean;
}

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

  private readonly today = new Date();

  private readonly raw: Omit<EventoF1, 'completed'>[] = [
    { round: 1,  shortName: 'GP AUSTRALIA',     circuit: 'Albert Park Circuit',            location: 'Melbourne, Australia',      date: '6–8 Mar 2026',      endDate: '2026-03-08', image: 'assets/Images/australia-track.png',   flag: 'assets/Images/australia-flag.gif'   },
    { round: 2,  shortName: 'GP CHINA',          circuit: 'Shanghai International Circuit', location: 'Shanghái, China',           date: '13–15 Mar 2026',    endDate: '2026-03-15', image: 'assets/Images/china-track.png',       flag: 'assets/Images/china-flag.gif'       },
    { round: 3,  shortName: 'GP JAPÓN',          circuit: 'Suzuka Circuit',                 location: 'Suzuka, Japón',             date: '27–29 Mar 2026',    endDate: '2026-03-29', image: 'assets/Images/japan-track.png',       flag: 'assets/Images/japan-flag.gif'       },
    { round: 4,  shortName: 'GP MIAMI',          circuit: 'Miami International Autodrome',  location: 'Miami, Estados Unidos',     date: '1–3 May 2026',      endDate: '2026-05-03', image: 'assets/Images/miami-track.png',       flag: 'assets/Images/usa-flag.gif'         },
    { round: 5,  shortName: 'GP CANADÁ',         circuit: 'Circuit Gilles-Villeneuve',      location: 'Montreal, Canadá',          date: '22–24 May 2026',    endDate: '2026-05-24', image: 'assets/Images/canada-track.png',      flag: 'assets/Images/canada-flag.gif'      },
    { round: 6,  shortName: 'GP MÓNACO',         circuit: 'Circuit de Monaco',              location: 'Mónaco',                    date: '5–7 Jun 2026',      endDate: '2026-06-07', image: 'assets/Images/monaco-track.png',      flag: 'assets/Images/monaco-flag.gif'      },
    { round: 7,  shortName: 'GP BARCELONA',      circuit: 'Circuit de Barcelona-Catalunya', location: 'Barcelona, España',         date: '12–14 Jun 2026',    endDate: '2026-06-14', image: 'assets/Images/barcelona-track.png',   flag: 'assets/Images/spain-flag.gif'       },
    { round: 8,  shortName: 'GP AUSTRIA',        circuit: 'Red Bull Ring',                  location: 'Spielberg, Austria',        date: '26–28 Jun 2026',    endDate: '2026-06-28', image: 'assets/Images/austria-track.png',     flag: 'assets/Images/austria-flag.gif'     },
    { round: 9,  shortName: 'GP GRAN BRETAÑA',   circuit: 'Silverstone Circuit',            location: 'Silverstone, Reino Unido',  date: '3–5 Jul 2026',      endDate: '2026-07-05', image: 'assets/Images/uk-track.png',          flag: 'assets/Images/uk-flag.gif'          },
    { round: 10, shortName: 'GP BÉLGICA',        circuit: 'Circuit Spa-Francorchamps',      location: 'Spa, Bélgica',              date: '17–19 Jul 2026',    endDate: '2026-07-19', image: 'assets/Images/belgium-track.png',     flag: 'assets/Images/belgium-flag.gif'     },
    { round: 11, shortName: 'GP HUNGRÍA',        circuit: 'Hungaroring',                    location: 'Budapest, Hungría',         date: '24–26 Jul 2026',    endDate: '2026-07-26', image: 'assets/Images/hungary-track.png',     flag: 'assets/Images/hungary-flag.gif'     },
    { round: 12, shortName: 'GP PAÍSES BAJOS',   circuit: 'Circuit Zandvoort',              location: 'Zandvoort, Países Bajos',   date: '21–23 Ago 2026',    endDate: '2026-08-23', image: 'assets/Images/netherlands-track.png', flag: 'assets/Images/netherlands-flag.gif' },
    { round: 13, shortName: 'GP ITALIA',         circuit: 'Autodromo Nazionale Monza',      location: 'Monza, Italia',             date: '4–6 Sep 2026',      endDate: '2026-09-06', image: 'assets/Images/italy-track.png',       flag: 'assets/Images/italy-flag.gif'       },
    { round: 14, shortName: 'GP ESPAÑA',         circuit: 'Madring',                        location: 'Madrid, España',            date: '11–13 Sep 2026',    endDate: '2026-09-13', image: 'assets/Images/madrid-track.png',      flag: 'assets/Images/spain-flag.gif'       },
    { round: 15, shortName: 'GP AZERBAIYÁN',     circuit: 'Baku City Circuit',              location: 'Bakú, Azerbaiyán',          date: '24–26 Sep 2026',    endDate: '2026-09-26', image: 'assets/Images/azerbaijan-track.png',   flag: 'assets/Images/azerbaijan-flag.gif'  },
    { round: 16, shortName: 'GP SINGAPUR',       circuit: 'Marina Bay Street Circuit',      location: 'Singapur',                  date: '9–11 Oct 2026',     endDate: '2026-10-11', image: 'assets/Images/singapore-track.png',   flag: 'assets/Images/singapore-flag.gif'   },
    { round: 17, shortName: 'GP ESTADOS UNIDOS', circuit: 'Circuit of the Americas',        location: 'Austin, Estados Unidos',    date: '23–25 Oct 2026',    endDate: '2026-10-25', image: 'assets/Images/austin-track.png',      flag: 'assets/Images/usa-flag.gif'         },
    { round: 18, shortName: 'GP MÉXICO',         circuit: 'Autódromo Hermanos Rodríguez',   location: 'Ciudad de México, México',  date: '30 Oct–1 Nov 2026', endDate: '2026-11-01', image: 'assets/Images/mexico-track.png',      flag: 'assets/Images/mexico-flag.gif'      },
    { round: 19, shortName: 'GP BRASIL',         circuit: 'Autodromo José Carlos Pace',     location: 'São Paulo, Brasil',         date: '6–8 Nov 2026',      endDate: '2026-11-08', image: 'assets/Images/brazil-track.png',      flag: 'assets/Images/brazil-flag.gif'      },
    { round: 20, shortName: 'GP LAS VEGAS',      circuit: 'Las Vegas Strip Circuit',        location: 'Las Vegas, Estados Unidos', date: '19–21 Nov 2026',    endDate: '2026-11-21', image: 'assets/Images/vegas-track.png',       flag: 'assets/Images/usa-flag.gif'         },
    { round: 21, shortName: 'GP QATAR',          circuit: 'Lusail International Circuit',   location: 'Lusail, Qatar',             date: '27–29 Nov 2026',    endDate: '2026-11-29', image: 'assets/Images/qatar-track.png',       flag: 'assets/Images/qatar-flag.gif'       },
    { round: 22, shortName: 'GP ABU DABI',       circuit: 'Yas Marina Circuit',             location: 'Abu Dabi, EAU',             date: '4–6 Dic 2026',      endDate: '2026-12-06', image: 'assets/Images/uae-track.png',         flag: 'assets/Images/uae-flag.gif'         },
  ];

  readonly eventos: EventoF1[] = this.raw.map(e => ({
    ...e,
    completed: new Date(e.endDate) < this.today
  }));

  get nextRound(): number {
    return this.eventos.find(e => !e.completed)?.round ?? 0;
  }

  get proximos(): EventoF1[] { return this.eventos.filter(e => !e.completed); }
  get pasados():  EventoF1[] { return this.eventos.filter(e => e.completed); }
}
