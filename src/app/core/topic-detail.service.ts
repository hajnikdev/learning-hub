import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TopicSection {
  id: string;
  title: string;
  articles: { id: string; title: string; content: string }[];
}

export interface TopicDetail {
  id: string;
  title: string;
  sections: TopicSection[];
}

@Injectable({ providedIn: 'root' })
export class TopicDetailService {
  constructor(private http: HttpClient) {}

  getTopicDetail(id: string): Observable<TopicDetail> {
    return this.http.get<TopicDetail>(`assets/topics/${id}.json`);
  }
}
