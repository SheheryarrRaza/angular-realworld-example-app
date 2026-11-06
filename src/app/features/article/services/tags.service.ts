import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface TagCount {
  tag: string;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class TagsService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<TagCount[]> {
    return this.http.get<{ tagCounts: TagCount[] }>('/tags').pipe(map(data => data.tagCounts));
  }
}
