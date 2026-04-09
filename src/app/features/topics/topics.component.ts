import { Component, ElementRef, HostListener, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicDetailService, TopicDetail } from '../../core/topic-detail.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-topics',
  imports: [LoaderComponent],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent {
  isLoading = signal(true);
  topic = signal<TopicDetail | null>(null);
  topicId = signal<string | null>(null);

  dialogMode = signal<'create' | 'update' | 'delete' | null>(null);
  selectedSectionId = signal<string | null>(null);
  selectedArticle = signal<{ id: string; title: string; content: string } | null>(null);
  articleTitle = signal('');
  dialogError = signal('');
  isSaving = signal(false);

  sectionDialogMode = signal<'create' | 'update' | 'delete' | null>(null);
  selectedSection = signal<{ id: string; title: string } | null>(null);
  sectionTitle = signal('');
  sectionDialogError = signal('');
  isSectionSaving = signal(false);

  @ViewChild('articleDialog') articleDialog?: ElementRef<HTMLDialogElement>;
  @ViewChild('sectionDialog') sectionDialog?: ElementRef<HTMLDialogElement>;

  constructor(
    private route: ActivatedRoute,
    private topicDetailService: TopicDetailService,
    private router: Router,
  ) {
    this.route.paramMap.subscribe((params: import('@angular/router').ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.topicId.set(id);
        this.topicDetailService.getTopicDetail(id).subscribe((topic: TopicDetail | null) => {
          this.topic.set(topic);
          this.isLoading.set(false);
        });
      }
    });
  }

  goToArticle(articleId: string) {
    this.closeMobileActionMenus();
    this.router.navigate(['/article', articleId]);
  }

  openCreateDialog(sectionId: string): void {
    this.closeMobileActionMenus();
    this.dialogMode.set('create');
    this.selectedSectionId.set(sectionId);
    this.selectedArticle.set(null);
    this.articleTitle.set('');
    this.dialogError.set('');
    this.articleDialog?.nativeElement.showModal();
  }

  openUpdateDialog(sectionId: string, article: { id: string; title: string; content: string }): void {
    this.closeMobileActionMenus();
    this.dialogMode.set('update');
    this.selectedSectionId.set(sectionId);
    this.selectedArticle.set(article);
    this.articleTitle.set(article.title);
    this.dialogError.set('');
    this.articleDialog?.nativeElement.showModal();
  }

  openDeleteDialog(sectionId: string, article: { id: string; title: string; content: string }): void {
    this.closeMobileActionMenus();
    this.dialogMode.set('delete');
    this.selectedSectionId.set(sectionId);
    this.selectedArticle.set(article);
    this.articleTitle.set(article.title);
    this.dialogError.set('');
    this.articleDialog?.nativeElement.showModal();
  }

  closeDialog(): void {
    this.articleDialog?.nativeElement.close();
    this.dialogMode.set(null);
    this.selectedSectionId.set(null);
    this.selectedArticle.set(null);
    this.articleTitle.set('');
    this.dialogError.set('');
    this.isSaving.set(false);
  }

  openCreateSectionDialog(): void {
    this.closeMobileActionMenus();
    this.sectionDialogMode.set('create');
    this.selectedSection.set(null);
    this.sectionTitle.set('');
    this.sectionDialogError.set('');
    this.sectionDialog?.nativeElement.showModal();
  }

  openUpdateSectionDialog(section: { id: string; title: string }): void {
    this.closeMobileActionMenus();
    this.sectionDialogMode.set('update');
    this.selectedSection.set(section);
    this.sectionTitle.set(section.title);
    this.sectionDialogError.set('');
    this.sectionDialog?.nativeElement.showModal();
  }

  openDeleteSectionDialog(section: { id: string; title: string }): void {
    this.closeMobileActionMenus();
    this.sectionDialogMode.set('delete');
    this.selectedSection.set(section);
    this.sectionTitle.set(section.title);
    this.sectionDialogError.set('');
    this.sectionDialog?.nativeElement.showModal();
  }

  closeSectionDialog(): void {
    this.sectionDialog?.nativeElement.close();
    this.sectionDialogMode.set(null);
    this.selectedSection.set(null);
    this.sectionTitle.set('');
    this.sectionDialogError.set('');
    this.isSectionSaving.set(false);
  }

  async confirmSectionDialogAction(): Promise<void> {
    const mode = this.sectionDialogMode();
    const currentTopicId = this.topicId();
    const section = this.selectedSection();

    if (!mode || !currentTopicId) {
      return;
    }

    this.sectionDialogError.set('');
    this.isSectionSaving.set(true);

    try {
      if (mode === 'create') {
        await this.topicDetailService.createSection(currentTopicId, this.sectionTitle());
      }

      if (mode === 'update' && section) {
        await this.topicDetailService.updateSection(currentTopicId, section.id, this.sectionTitle());
      }

      if (mode === 'delete' && section) {
        await this.topicDetailService.deleteSection(currentTopicId, section.id);
      }

      this.closeSectionDialog();
    } catch (error) {
      this.sectionDialogError.set(error instanceof Error ? error.message : 'Action failed.');
      this.isSectionSaving.set(false);
    }
  }

  async confirmDialogAction(): Promise<void> {
    const mode = this.dialogMode();
    const currentTopicId = this.topicId();
    const sectionId = this.selectedSectionId();
    const article = this.selectedArticle();

    if (!mode || !currentTopicId || !sectionId) {
      return;
    }

    this.dialogError.set('');
    this.isSaving.set(true);

    try {
      if (mode === 'create') {
        await this.topicDetailService.createArticle(currentTopicId, sectionId, this.articleTitle(), '');
      }

      if (mode === 'update' && article) {
        await this.topicDetailService.updateArticle(article.id, this.articleTitle(), article.content);
      }

      if (mode === 'delete' && article) {
        await this.topicDetailService.deleteArticle(currentTopicId, sectionId, article.id);
      }

      this.closeDialog();
    } catch (error) {
      this.dialogError.set(error instanceof Error ? error.message : 'Action failed.');
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
}
