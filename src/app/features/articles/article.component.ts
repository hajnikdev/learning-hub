import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { Subscription, combineLatest } from 'rxjs';

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

  private sub: Subscription;

  constructor(
    public route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {
    marked.use(
      gfmHeadingId({
        prefix: '', // optional, or e.g. 'article-'
      }),
    );

    this.sub = combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      ([params, queryParams]) => {
        const id = params.get('id');
        if (id) {
          const cheatsheet = queryParams.get('cheatsheet');
          const suffix = cheatsheet === 'true' ? '.cheatsheet' : '';
          this.http.get<Article>(`assets/articles/${id}.json`).subscribe({
            next: (meta) => {
              this.http
                .get(`assets/articles/${id}${suffix}.md`, { responseType: 'text' })
                .subscribe({
                  next: (mdContent) => {
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
                  },
                  error: () => {
                    if (suffix) {
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
                    }
                  },
                });
            },
            error: () => {
              if (suffix) {
                this.http.get<Article>(`assets/articles/${id}.json`).subscribe((meta) => {
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
            },
          });
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  goToCheatsheet() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.router.navigate([], {
        relativeTo: this.route,
        replaceUrl: true,
        queryParams: { cheatsheet: 'true' },
        queryParamsHandling: 'merge',
      });
    }
  }

  goToFullArticle() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.router.navigate([], {
        relativeTo: this.route,
        replaceUrl: true,
        queryParams: { cheatsheet: null },
        queryParamsHandling: 'merge',
      });
    }
  }
}
