import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Piloto {
  name: string;
  team: string;
  points: number;
  position?: number; // 👈 IMPORTANT
}

interface Constructor {
  team: string;
  points: number;
  position?: number; // 👈 IMPORTANT
}


interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  videoUrl: string;
}

@Component({
  selector: 'app-f1-standings',
  templateUrl: './f1-standings.component.html',
  styleUrls: ['./f1-standings.component.css']
})
export class F1StandingsComponent implements OnInit {

  activeTable: string = 'pilotos';
  videos: VideoItem[] = [];
  loadingVideos: boolean = true;

  currentRound: number = 1;

  // ================= RACES (UNCHANGED) =================
  races = [
    {
      round: 1,
      name: 'FORMULA 1 QATAR AIRWAYS AUSTRALIAN GRAND PRIX 2026',
      circuit: 'Albert Park Circuit',
      date: '6-8 Marzo 2026',
      image: 'assets/Images/australia-track.png',
      bg: 'assets/Images/australia-flag.gif'
    },
    {
      round: 2,
      name: 'FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2026',
      circuit: 'Shanghai International Circuit',
      date: '13-15 Marzo 2026',
      image: 'assets/Images/china-track.webp',
      bg: 'assets/Images/china-flag.gif'
    },
    {
      round: 3,
      name: 'FORMULA 1 ARAMCO JAPANESE GRAND PRIX 2026',
      circuit: 'Suzuka Circuit',
      date: '27-29 Marzo 2026',
      image: 'assets/Images/japan-track.png',
      bg: 'assets/Images/japan-flag.gif'
    },
    {
      round: 4,
      name: 'FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2026',
      circuit: 'Miami International Autodrome',
      date: '01-03 Mayo 2026',
      image: 'assets/Images/miami-track.png',
      bg: 'assets/Images/usa-flag.gif'
    },
    {
      round: 5,
      name: 'FORMULA 1 LENOVO GRAND PRIX DU CANADA 2026',
      circuit: 'Circuit Gilles-Villeneuve',
      date: '22-24 Mayo 2026',
      image: 'assets/Images/canada-track.png',
      bg: 'assets/Images/canada-flag.gif'
    },
    {
      round: 6,
      name: 'FORMULA 1 LOUIS VUITTON GRAND PRIX DE MONACO 2026',
      circuit: 'Circuit de Monaco',
      date: '05-07 Junio 2026',
      image: 'assets/Images/monaco-track.png',
      bg: 'assets/Images/monaco-flag.gif'
    },
    {
      round: 7,
      name: 'FORMULA 1 MSC CRUISES GRAN PREMIO DE BARCELONA-CATALUNYA 2026',
      circuit: 'Circuit de Barcelona-Catalunya',
      date: '12-14 Junio 2026',
      image: 'assets/Images/barcelona-track.png',
      bg: 'assets/Images/spain-flag.gif'
    },
    {
      round: 8,
      name: 'FORMULA 1 LENOVO AUSTRIAN GRAND PRIX 2026',
      circuit: 'Red Bull Ring',
      date: '26-28 Junio 2026',
      image: 'assets/Images/austria-track.png',
      bg: 'assets/Images/austria-flag.gif'
    },
    {
      round: 9,
      name: 'FORMULA 1 PIRELLI BRITISH GRAND PRIX 2026',
      circuit: 'Silverstone Circuit',
      date: '03-05 Julio 2026',
      image: 'assets/Images/uk-track.png',
      bg: 'assets/Images/uk-flag.gif'
    },
    {
      round: 10,
      name: 'FORMULA 1 MOËT & CHANDON BELGIAN GRAND PRIX 2026',
      circuit: 'Circuit Spa/Francorchamps',
      date: '17-19 Julio 2026',
      image: 'assets/Images/belgium-track.png',
      bg: 'assets/Images/belgium-flag.gif'
    },
    {
      round: 11,
      name: 'FORMULA 1 AWS HUNGARIAN GRAND PRIX 2026',
      circuit: 'Hungaroring',
      date: '24-26 Julio 2026',
      image: 'assets/Images/hungary-track.png',
      bg: 'assets/Images/hungary-flag.gif'
    },
    {
      round: 12,
      name: 'FORMULA 1 HEINEKEN DUTCH GRAND PRIX 2026',
      circuit: 'Circuit Zandvoort',
      date: '21-23 Agosto 2026',
      image: 'assets/Images/netherlands-track.png',
      bg: 'assets/Images/netherlands-flag.gif'
    },
    {
      round: 13,
      name: 'FORMULA 1 PIRELLI GRAN PREMIO D’ITALIA 2026',
      circuit: 'Autodromo Nazionale Monza',
      date: '04-06 Septiembre 2026',
      image: 'assets/Images/italy-track.png',
      bg: 'assets/Images/italy-flag.gif'
    },
    {
      round: 14,
      name: 'FORMULA 1 TAG HEUER GRAN PREMIO DE ESPAÑA 2026',
      circuit: 'Madring',
      date: '11-13 Septiembre 2026',
      image: 'assets/Images/madrid-track.png',
      bg: 'assets/Images/spain-flag.gif'
    },
    {
      round: 15,
      name: 'FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2026',
      circuit: 'Baku City Circuit',
      date: '24-26 Septiembre 2026',
      image: 'assets/Images/azerbijan-track.png',
      bg: 'assets/Images/azerbaijan-flag.gif'
    },
    {
      round: 16,
      name: 'FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2026',
      circuit: 'Marina Bay Street Circuit',
      date: '09-11 Octubre 2026',
      image: 'assets/Images/singapore-track.png',
      bg: 'assets/Images/singapore-flag.gif'
    },
    {
      round: 17,
      name: 'FORMULA 1 MSC CRUISES UNITED STATES GRAND PRIX 2026',
      circuit: 'Circuit of the Americas',
      date: '23-25 Octubre 2026',
      image: 'assets/Images/austin-track.png',
      bg: 'assets/Images/usa-flag.gif'
    },
    {
      round: 18,
      name: 'FORMULA 1 GRAN PREMIO DE LA CIUDAD DE MÉXICO 2026',
      circuit: 'Autódromo Hermanos Rodríguez',
      date: '30-01 Octubre/Noviembre 2026',
      image: 'assets/Images/mexico-track.png',
      bg: 'assets/Images/mexico-flag.gif'
    },
    {
      round: 19,
      name: 'FORMULA 1 MSC CRUISES GRANDE PRÊMIO DE SÃO PAULO 2026',
      circuit: 'Autodromo José Carlos Pace',
      date: '06-08 Noviembre 2026',
      image: 'assets/Images/brazil-track.png',
      bg: 'assets/Images/brazil-flag.gif'
    },
    {
      round: 20,
      name: 'FORMULA 1 HEINEKEN LAS VEGAS GRAND PRIX 2026',
      circuit: 'Las Vegas Strip Circuit',
      date: '19-21 Noviembre 2026',
      image: 'assets/Images/vegas-track.png',
      bg: 'assets/Images/usa-flag.gif'
    },
    {
      round: 21,
      name: 'FORMULA 1 QATAR AIRWAYS QATAR GRAND PRIX 2026',
      circuit: 'Lusail International Circuit',
      date: '27-29 Noviembre 2026',
      image: 'assets/Images/qatar-track.png',
      bg: 'assets/Images/qatar-flag.gif'
    },
    {
      round: 22,
      name: 'FORMULA 1 ETIHAD AIRWAYS ABU DHABI GRAND PRIX 2026',
      circuit: 'Yas Marina Circuit',
      date: '27-29 Noviembre 2026',
      image: 'assets/Images/uae-track.png',
      bg: 'assets/Images/uae-flag.gif'
    },
  ];

  get nextRace() {
    return this.races.find(r => r.round === this.currentRound);
  }

  // ================= RAW DATA (ONLY EDIT POINTS HERE) =================
  pilotos: Piloto[] = [
    
    { name: 'Lando Norris', team: 'McLaren', points: 25 },
    { name: 'Oscar Piastri', team: 'McLaren', points: 21 },

    { name: 'George Russell', team: 'Mercedes', points: 63 },
    { name: 'Kimi Antonelli', team: 'Mercedes', points: 72 },

    { name: 'Max Verstappen', team: 'Red Bull', points: 12 },

    { name: 'Arvid Lindblad', team: 'Racing Bulls', points: 4 },

    { name: 'Isack Hadjar', team: 'Red Bull', points: 4 },

    { name: 'Charles Leclerc', team: 'Ferrari', points: 49 },
    { name: 'Lewis Hamilton', team: 'Ferrari', points: 41 },
    
    { name: 'Nico Hulkenburg', team: 'Audi', points: 0 },

    { name: 'Alex Albon', team: 'Williams', points: 0 },

    { name: 'Gabriel Bortoleto', team: 'Audi', points: 2 },
    
    { name: 'Carlos Sainz', team: 'Williams', points: 2 },

    { name: 'Liam Lawson', team: 'Racing Bulls', points: 10 },
  //{ name: 'Arvid Lindblad', team: 'Racing Bulls', points: 4 },

    { name: 'Sergio Perez', team: 'Cadillac', points: 0 },
    { name: 'Valtteri Bottas', team: 'Cadillac', points: 0 },
    
    { name: 'Fernando Alonso', team: 'Aston Martin', points: 0 },
    { name: 'Lance Stroll', team: 'Aston Martin', points: 0 },
    
    { name: 'Oliver Bearman', team: 'Haas', points: 17 },
    { name: 'Esteban Ocon', team: 'Haas', points: 1 },
    
  //{ name: 'Nico Hulkenburg', team: 'Audi', points: 0 },
  //{ name: 'Gabriel Bortoleto', team: 'Audi', points: 2 },

    { name: 'Pierre Gasly', team: 'Alpine', points: 15 },
    { name: 'Franco Colapinto', team: 'Alpine', points: 1 },
    
  // { name: 'Sergio Perez', team: 'Cadillac', points: 0 },
  //  { name: 'Valtteri Bottas', team: 'Cadillac', points: 0 },
  ];

  teamMap: { [key: string]: string } = {
  'Mercedes': 'Mercedes-AMG PETRONAS F1',
  'Ferrari': 'Scuderia Ferrari HP',
  'McLaren': 'McLaren Mastercard F1',
  'Red Bull': 'Oracle Red Bull Racing',
  'Racing Bulls': 'Visa Cash App Racing Bulls F1',
  'Aston Martin': 'Aston Martin Aramco F1',
  'Alpine': 'BWT Alpine F1',
  'Haas': 'TGR Haas F1',
  'Williams': 'Atlassian Williams F1',
  'Audi': 'Audi Revolut F1',
  'Cadillac': 'Cadillac F1'
};

constructores: Constructor[] = [];

generateConstructors(): void {
  const teamPoints: { [team: string]: number } = {};
  const teamDriverCount: { [team: string]: number } = {};

  // 1. Agrupar pilotos por equipo (máximo 2 como en F1 real)
  this.pilotos.forEach(p => {
    const officialName = this.teamMap[p.team] || p.team;

    if (!teamPoints[officialName]) {
      teamPoints[officialName] = 0;
      teamDriverCount[officialName] = 0;
    }

    // 👇 SOLO contar máximo 2 pilotos por equipo
    if (teamDriverCount[officialName] < 2) {
      teamPoints[officialName] += p.points;
      teamDriverCount[officialName]++;
    }
  });

  // 2. Convertir a array
  this.constructores = Object.keys(teamPoints).map(team => ({
    team,
    points: teamPoints[team]
  }));

  // 3. Ordenar + asignar posiciones
  this.constructores = this.constructores
    .sort((a, b) => b.points - a.points)
    .map((c, index) => ({
      ...c,
      position: index + 1
    }));
}

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  this.updateStandings();
  this.loadVideos();
}

  switchTable(table: string): void {
    this.activeTable = table;
  }

  updateStandings(): void {
  this.sortPilotos();
  this.generateConstructors();
}

  // ================= AUTO SORT LOGIC =================
  sortPilotos(): void {
  this.pilotos = this.pilotos
    .sort((a, b) => b.points - a.points)
    .map((p, index) => ({
      ...p,
      position: index + 1
    }));
}

  // ================= YOUTUBE (UNCHANGED + SAFE) =================
  loadVideos(): void {
    const API_KEY = 'AIzaSyDduusVLhf4BehAD7GnYLLnAeopFPefsdo';
    const CHANNEL_ID = 'UCB_qr75-ydFVKSF9Dmo6izg';
    const MAX_RESULTS = 8;

    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${MAX_RESULTS}`;

    this.loadingVideos = true;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data?.items) {
          this.videos = data.items
            .filter((item: any) => item.id?.videoId)
            .map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails?.high?.url,
              publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
              videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));
        }

        this.loadingVideos = false;
      },
      error: (err) => {
        console.error('YouTube API ERROR:', err);
        this.loadingVideos = false;
      }
    });
  }
}