import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';

interface Article {
  title: string;
  content: string;
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  article = signal<Article | null>(null);
  htmlContent = signal<SafeHtml>('');

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
    marked.use(
      gfmHeadingId({
        prefix: '' // optional, or e.g. 'article-'
      })
    );
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        // Load metadata from JSON
        this.http.get<Article>(`assets/articles/${id}.json`).subscribe((meta) => {
          // Load markdown content
          this.http
            .get(`assets/articles/${id}.md`, { responseType: 'text' })
            .subscribe((mdContent) => {
              this.article.set({
                ...meta,
                content: mdContent,
              });
              const parsed = marked.parse(mdContent || '');
              if (typeof parsed === 'string') {
                this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(parsed));
              } else if (parsed instanceof Promise) {
                parsed.then((html) => {
                  this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(html));
                });
              }
            });
        });
      }
    });
  }
}
