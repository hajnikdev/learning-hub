import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  article = signal<any>(null);

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.http.get(`assets/articles/${id}.json`).subscribe((article) => {
          this.article.set(article);
        });
      }
    });
  }
}
