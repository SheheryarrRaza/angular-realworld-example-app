import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesCountService {
  readonly count = signal<number | null>(null);

  constructor(private readonly http: HttpClient) {}

  load(): Observable<number | null> {
    return this.http.get<{ favoritesCount: number }>('/user/favorites/count').pipe(
      map(data => data.favoritesCount),
      catchError(() => of(null)),
      tap(count => this.count.set(count)),
    );
  }

  adjust(delta: number): void {
    this.count.update(count => (count === null ? null : Math.max(0, count + delta)));
  }

  clear(): void {
    this.count.set(null);
  }
}
