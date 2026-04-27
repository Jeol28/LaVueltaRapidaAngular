import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  // Datos de pilotos
  pilotos = [
    { position: 1, name: 'George Russell', team: 'Mercedes', points: 25 },
    { position: 2, name: 'Kimi Antonelli', team: 'Mercedes', points: 18 },
    { position: 3, name: 'Charles Leclerc', team: 'Ferrari', points: 15 },
    { position: 4, name: 'Lewis Hamilton', team: 'Ferrari', points: 12 },
    { position: 5, name: 'Lando Norris', team: 'McLaren', points: 10 },
    { position: 6, name: 'Max Verstappen', team: 'Red Bull', points: 8 },
    { position: 7, name: 'Oliver Bearman', team: 'Haas', points: 6 },
    { position: 8, name: 'Arvid Lindblad', team: 'Racing Bulls', points: 4 },
    { position: 9, name: 'Gabriel Bortoleto', team: 'Audi', points: 2 },
    { position: 10, name: 'Pierre Gasly', team: 'Alpine', points: 1 },
    { position: 11, name: 'Esteban Ocon', team: 'Haas', points: 0 },
    { position: 12, name: 'Alexander Albon', team: 'Williams', points: 0 },
    { position: 13, name: 'Liam Lawson', team: 'Racing Bulls', points: 0 },
    { position: 14, name: 'Franco Colapinto', team: 'Alpine', points: 0 },
    { position: 15, name: 'Carlos Sainz', team: 'Williams', points: 0 },
    { position: 16, name: 'Sergio Perez', team: 'Cadillac', points: 0 },
    { position: 17, name: 'Isack Hadjar', team: 'Racing Bulls', points: 0 },
    { position: 18, name: 'Oscar Piastri', team: 'McLaren', points: 0 },
    { position: 19, name: 'Nico Hulkenburg', team: 'Audi', points: 0 },
    { position: 20, name: 'Fernando Alonso', team: 'Aston Martin', points: 0 },
    { position: 21, name: 'Valtteri Bottas', team: 'Cadillac', points: 0 },
    { position: 22, name: 'Lance Stroll', team: 'Aston Martin', points: 0 }
  ];

  // Datos de constructores
  constructores = [
    { position: 1, team: 'Mercedes-AMG PETRONAS F1', points: 43 },
    { position: 2, team: 'Scuderia Ferrari HP', points: 27 },
    { position: 3, team: 'McLaren Mastercard F1', points: 10 },
    { position: 4, team: 'Oracle Red Bull Racing', points: 8 },
    { position: 5, team: 'TGR Haas F1', points: 6 },
    { position: 6, team: 'Visa Cash App Racing Bulls F1', points: 4 },
    { position: 7, team: 'Audi Revolut F1', points: 2 },
    { position: 8, team: 'BWT Alpine F1', points: 1 },
    { position: 9, team: 'Atlassian Williams F1', points: 0 },
    { position: 10, team: 'Cadillac F1', points: 0 },
    { position: 11, team: 'Aston Martin Aramco F1', points: 0 }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  switchTable(table: string): void {
    this.activeTable = table;
  }

  loadVideos(): void {
    const API_KEY = 'AIzaSyDduusVLhf4BehAD7GnYLLnAeopFPefsdo';
    const CHANNEL_ID = 'UCB_qr75-ydFVKSF9Dmo6izg';
    const MAX_RESULTS = 8;

    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${MAX_RESULTS}`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data.items) {
          this.videos = data.items
            .filter((item: any) => item.id.videoId)
            .map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high.url,
              publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
              videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));
        }
        this.loadingVideos = false;
      },
      error: (err) => {
        console.error('Error loading F1 videos:', err);
        this.loadingVideos = false;
      }
    });
  }
}
