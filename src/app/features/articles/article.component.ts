import { Component, HostListener, signal } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { Subscription } from 'rxjs';
import { TopicDetailService } from '../../core/topic-detail.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

interface Article {
  title: string;
  content: string;
  cheatsheet: string;
}

@Component({
  selector: 'app-article',
  imports: [LoaderComponent],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {
  isLoading = signal(true);
  article = signal<Article | null>(null);
  htmlContent = signal<SafeHtml>('');
  isEditing = signal(false);
  editedTitle = signal('');
  editedContent = signal('');
  editedCheatsheet = signal('');
  isSaving = signal(false);
  editError = signal('');
  isCheatsheetView = signal(false);

  private sub: Subscription;
  private articleSub?: Subscription;
  private querySub: Subscription;

  constructor(
    public route: ActivatedRoute,
    private topicDetailService: TopicDetailService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {
    marked.use(
      gfmHeadingId({
        prefix: '', // optional, or e.g. 'article-'
      }),
    );

    this.querySub = this.route.queryParamMap.subscribe((queryParams) => {
      this.isCheatsheetView.set(queryParams.get('cheatsheet') === 'true');
      void this.renderPreview();
    });

    this.sub = this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (!id) {
        this.article.set(null);
        this.htmlContent.set('');
        this.isLoading.set(false);
        return;
      }

      this.isLoading.set(true);

      this.articleSub?.unsubscribe();
      this.articleSub = this.topicDetailService.getArticleById(id).subscribe((articleData) => {
        if (!articleData) {
          this.article.set(null);
          this.htmlContent.set('');
          this.isLoading.set(false);
          return;
        }

        this.article.set({
          title: articleData.title,
          content: articleData.content,
          cheatsheet: articleData.cheatsheet || '',
        });
        this.editedTitle.set(articleData.title);
        this.editedContent.set(articleData.content || '');
        this.editedCheatsheet.set(articleData.cheatsheet || '');
        this.editError.set('');
        void this.renderPreview();
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.querySub?.unsubscribe();
    this.articleSub?.unsubscribe();
  }

  goToCheatsheet() {
    this.closeMobileActionMenus();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isCheatsheetView.set(true);
      this.router.navigate([], {
        relativeTo: this.route,
        replaceUrl: true,
        queryParams: { cheatsheet: 'true' },
        queryParamsHandling: 'merge',
      });
    }
  }

  goToFullArticle() {
    this.closeMobileActionMenus();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isCheatsheetView.set(false);
      this.router.navigate([], {
        relativeTo: this.route,
        replaceUrl: true,
        queryParams: { cheatsheet: null },
        queryParamsHandling: 'merge',
      });
    }
  }

  toggleEdit(): void {
    this.closeMobileActionMenus();
    const article = this.article();
    if (!article) {
      return;
    }

    if (!this.isEditing()) {
      this.editedTitle.set(article.title);
      this.editedContent.set(article.content || '');
      this.editedCheatsheet.set(article.cheatsheet || '');
      this.editError.set('');
      this.isEditing.set(true);
      return;
    }

    this.isEditing.set(false);
    this.editError.set('');
  }

  async saveArticle(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.isSaving.set(true);
    this.editError.set('');

    try {
      await this.topicDetailService.updateArticle(
        id,
        this.editedTitle(),
        this.editedContent(),
        this.editedCheatsheet(),
      );
      this.isEditing.set(false);
    } catch (error) {
      this.editError.set(error instanceof Error ? error.message : 'Failed to save article.');
    } finally {
      this.isSaving.set(false);
    }
  }

  @HostListener('document:click')
  handleOutsideClick(): void {
    this.closeMobileActionMenus();
  }

  onActionMenuToggle(event: Event): void {
    const menu = event.currentTarget as HTMLDetailsElement | null;
    if (!menu?.open) {
      return;
    }

    this.closeMobileActionMenus(menu);
  }

  @HostListener('window:keydown', ['$event'])
  async handleEditorShortcuts(event: KeyboardEvent): Promise<void> {
    if (!this.isEditing()) {
      return;
    }

    const isSaveShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
    if (isSaveShortcut) {
      event.preventDefault();
      if (!this.isSaving()) {
        await this.saveArticle();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.toggleEdit();
    }
  }

  private closeMobileActionMenus(exceptMenu?: HTMLDetailsElement): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.querySelectorAll<HTMLDetailsElement>('.actions-menu[open]').forEach((menu) => {
      if (exceptMenu && menu === exceptMenu) {
        return;
      }

      menu.removeAttribute('open');
    });
  }

  private async renderPreview(): Promise<void> {
    const article = this.article();
    if (!article) {
      this.htmlContent.set('');
      this.isLoading.set(false);
      return;
    }

    const previewSource = this.isCheatsheetView() ? article.cheatsheet || '' : article.content || '';
    const parsed = marked.parse(previewSource);

    if (typeof parsed === 'string') {
      this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(parsed));
      this.isLoading.set(false);
      return;
    }

    const html = await parsed;
    this.htmlContent.set(this.sanitizer.bypassSecurityTrustHtml(html));
    this.isLoading.set(false);
  }
}
