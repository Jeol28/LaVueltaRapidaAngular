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
  wins: number;
}

@Injectable({ providedIn: 'root' })
export class F1Service {
  private readonly DRIVERS_API      = 'https://api.jolpi.ca/ergast/f1/current/driverstandings/';
  private readonly CONSTRUCTORS_API = 'https://api.jolpi.ca/ergast/f1/2026/constructorstandings/';

  constructor(private http: HttpClient) {}

  getDriverStandings(): Observable<Piloto[]> {
    return this.http.get<any>(this.DRIVERS_API).pipe(
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

  getConstructorStandings(): Observable<Constructor[]> {
    return this.http.get<any>(this.CONSTRUCTORS_API).pipe(
      map(res => {
        const list = res?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
        return list.map((c: any): Constructor => ({
          position: +c.position,
          team: c.Constructor?.name ?? '—',
          points: +c.points,
          wins: +c.wins
        }));
      })
    );
  }


}
