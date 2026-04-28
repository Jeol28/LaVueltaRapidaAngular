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

  currentRound: number = 9;

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
    }
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
    
    { name: 'Fernando Alonso', team: 'Aston Martin', points: 0 },
    { name: 'Lance Stroll', team: 'Aston Martin', points: 0 },
    
    { name: 'Oliver Bearman', team: 'Haas', points: 17 },
    { name: 'Esteban Ocon', team: 'Haas', points: 1 },
    
  //{ name: 'Nico Hulkenburg', team: 'Audi', points: 0 },
  //{ name: 'Gabriel Bortoleto', team: 'Audi', points: 2 },
    
    { name: 'Sergio Perez', team: 'Cadillac', points: 0 },
    { name: 'Valtteri Bottas', team: 'Cadillac', points: 0 },

    { name: 'Pierre Gasly', team: 'Alpine', points: 15 },
    { name: 'Franco Colapinto', team: 'Alpine', points: 1 },
    
  // { name: 'Sergio Perez', team: 'Cadillac', points: 0 },
  //  { name: 'Valtteri Bottas', team: 'Cadillac', points: 0 },
  ];

  constructores: Constructor[] = [
    { team: 'Mercedes-AMG PETRONAS F1', points: 43 },
    { team: 'Scuderia Ferrari HP', points: 27 },
    { team: 'McLaren Mastercard F1', points: 10 },
    { team: 'Oracle Red Bull Racing', points: 8 }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.sortAllTables();
    this.loadVideos();
  }

  switchTable(table: string): void {
    this.activeTable = table;
  }

  // ================= AUTO SORT LOGIC =================
  sortAllTables(): void {

    // Sort pilotos
    this.pilotos = this.pilotos
      .sort((a, b) => b.points - a.points)
      .map((p, index) => ({
        ...p,
        position: index + 1
      }));

    // Sort constructores
    this.constructores = this.constructores
      .sort((a, b) => b.points - a.points)
      .map((c, index) => ({
        ...c,
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