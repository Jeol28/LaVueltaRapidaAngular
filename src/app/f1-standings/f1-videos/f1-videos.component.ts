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
  selector: 'app-f1-videos',
  templateUrl: './f1-videos.component.html',
  styleUrls: ['./f1-videos.component.css']
})
export class F1VideosComponent implements OnInit {
  videos: VideoItem[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    const API_KEY = 'AIzaSyDduusVLhf4BehAD7GnYLLnAeopFPefsdo';
    const CHANNEL_ID = 'UCB_qr75-ydFVKSF9Dmo6izg';
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=8`;

    this.http.get<any>(url).subscribe({
      next: data => {
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
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
