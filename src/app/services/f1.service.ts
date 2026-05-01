import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Piloto {
  position: number;
  name: string;
  team: string;
  points: number;
  wins: number;
}

export interface Constructor {
  position: number;
  team: string;
  points: number;
}

@Injectable({ providedIn: 'root' })
export class F1Service {
  private readonly API = 'https://api.jolpi.ca/ergast/f1/current/driverstandings/';

  constructor(private http: HttpClient) {}

  getDriverStandings(): Observable<Piloto[]> {
    return this.http.get<any>(this.API).pipe(
      map(res => {
        const list = res?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
        return list.map((d: any): Piloto => ({
          position: +d.position,
          name: `${d.Driver.givenName} ${d.Driver.familyName}`,
          team: d.Constructors?.[0]?.name ?? '—',
          points: +d.points,
          wins: +d.wins
        }));
      })
    );
  }

  generateConstructors(pilotos: Piloto[]): Constructor[] {
    const pts: { [team: string]: number } = {};
    const cnt: { [team: string]: number } = {};

    pilotos.forEach(p => {
      if (!pts[p.team]) { pts[p.team] = 0; cnt[p.team] = 0; }
      if (cnt[p.team] < 2) { pts[p.team] += p.points; cnt[p.team]++; }
    });

    return Object.keys(pts)
      .map(team => ({ team, points: pts[team], position: 0 }))
      .sort((a, b) => b.points - a.points)
      .map((c, i) => ({ ...c, position: i + 1 }));
  }

  getTeamClass(team: string): string {
    const map: { [k: string]: string } = {
      'McLaren': 'mclaren', 'McLaren Mastercard F1': 'mclaren',
      'Mercedes': 'mercedes', 'Mercedes-AMG PETRONAS F1 Team': 'mercedes',
      'Ferrari': 'ferrari', 'Scuderia Ferrari HP': 'ferrari',
      'Red Bull': 'redbull', 'Oracle Red Bull Racing': 'redbull',
      'RB F1 Team': 'rb', 'Racing Bulls': 'rb', 'Visa Cash App Racing Bulls F1': 'rb',
      'Aston Martin': 'aston', 'Aston Martin Aramco F1': 'aston',
      'Alpine': 'alpine', 'Alpine F1 Team': 'alpine', 'BWT Alpine F1': 'alpine',
      'Haas': 'haas', 'Haas F1 Team': 'haas', 'TGR Haas F1': 'haas',
      'Williams': 'williams', 'Atlassian Williams F1': 'williams',
      'Kick Sauber': 'audi', 'Audi': 'audi', 'Audi Revolut F1': 'audi',
      'Cadillac': 'cadillac', 'Cadillac F1': 'cadillac',
    };
    return map[team] ?? '';
  }
}
