import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Topic {
  id: string;
  title: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class TopicsService {
  constructor(private http: HttpClient) {}

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>('assets/topics.json');
  }
}
