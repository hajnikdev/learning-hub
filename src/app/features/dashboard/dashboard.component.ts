import { Component, ElementRef, HostListener, ViewChild, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Topic, TopicGroup, TopicsService } from '../../core/topics.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isLoading = signal(true);
  topics = signal<Topic[]>([]);
  topicGroups = signal<TopicGroup[]>([]);
  private topicsLoaded = false;
  private groupsLoaded = false;

  groupedTopics = computed(() => {
    const groups = new Map<string, { id: string | null; name: string; order: number; topics: Topic[] }>();

    for (const group of this.topicGroups()) {
      groups.set(group.name, {
        id: group.id,
        name: group.name,
        order: group.order,
        topics: [],
      });
    }

    for (const topic of this.topics()) {
      const groupName = topic.group || 'Article';
      const existing = groups.get(groupName);

      if (!existing) {
        groups.set(groupName, {
          id: null,
          name: groupName,
          order: Number.MAX_SAFE_INTEGER,
          topics: [topic],
        });
        continue;
      }

      existing.topics.push(topic);
    }

    return [...groups.entries()]
      .map(([, group]) => group)
      .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name))
      .map((group) => ({
        id: group.id,
        name: group.name,
        topics: group.topics.slice().sort((left, right) => left.title.localeCompare(right.title)),
      }));
  });

  dialogMode = signal<'create' | 'update' | 'delete' | null>(null);
  selectedTopic = signal<Topic | null>(null);
  createTopicGroupContext = signal<string>('Article');
  topicTitle = signal('');
  topicGroup = signal('Article');
  dialogError = signal('');
  isSaving = signal(false);

  groupDialogMode = signal<'create' | 'update' | 'delete' | null>(null);
  selectedGroup = signal<string | null>(null);
  groupName = signal('');
  groupDialogError = signal('');
  isGroupSaving = signal(false);

  @ViewChild('topicDialog') topicDialog?: ElementRef<HTMLDialogElement>;
  @ViewChild('groupDialog') groupDialog?: ElementRef<HTMLDialogElement>;

  constructor(
    private topicsService: TopicsService,
    private router: Router,
  ) {
    this.topicsService.getTopics().subscribe((topics: Topic[]) => {
      this.topics.set(topics);
      this.topicsLoaded = true;
      this.isLoading.set(!(this.topicsLoaded && this.groupsLoaded));
    });

    this.topicsService.getTopicGroups().subscribe((groups: TopicGroup[]) => {
      this.topicGroups.set(groups);
      this.groupsLoaded = true;
      this.isLoading.set(!(this.topicsLoaded && this.groupsLoaded));
    });
  }

  openCreateDialog(group = 'Article'): void {
    this.closeMobileActionMenus();
    this.dialogMode.set('create');
    this.selectedTopic.set(null);
    this.createTopicGroupContext.set(group);
    this.topicTitle.set('');
    this.topicGroup.set(group);
    this.dialogError.set('');
    this.topicDialog?.nativeElement.showModal();
  }

  goToTopic(topicId: string): void {
    this.closeMobileActionMenus();
    this.router.navigate(['/topic', topicId]);
  }

  openUpdateDialog(topic: Topic): void {
    this.closeMobileActionMenus();
    this.dialogMode.set('update');
    this.selectedTopic.set(topic);
    this.topicTitle.set(topic.title);
    this.topicGroup.set(topic.group || 'Article');
    this.dialogError.set('');
    this.topicDialog?.nativeElement.showModal();
  }

  openDeleteDialog(topic: Topic): void {
    this.closeMobileActionMenus();
    this.dialogMode.set('delete');
    this.selectedTopic.set(topic);
    this.topicTitle.set(topic.title);
    this.topicGroup.set(topic.group || 'Article');
    this.dialogError.set('');
    this.topicDialog?.nativeElement.showModal();
  }

  closeDialog(): void {
    this.topicDialog?.nativeElement.close();
    this.dialogMode.set(null);
    this.selectedTopic.set(null);
    this.createTopicGroupContext.set('Article');
    this.topicTitle.set('');
    this.topicGroup.set('Article');
    this.dialogError.set('');
    this.isSaving.set(false);
  }

  async confirmDialogAction(): Promise<void> {
    const mode = this.dialogMode();
    const currentTopic = this.selectedTopic();

    if (!mode) {
      return;
    }

    this.dialogError.set('');
    this.isSaving.set(true);

    try {
      if (mode === 'create') {
        await this.topicsService.createTopic(this.topicTitle(), this.topicGroup());
      }

      if (mode === 'update' && currentTopic) {
        await this.topicsService.updateTopic(currentTopic.id, this.topicTitle(), this.topicGroup());
      }

      if (mode === 'delete' && currentTopic) {
        await this.topicsService.deleteTopic(currentTopic.id);
      }

      this.closeDialog();
    } catch (error) {
      this.dialogError.set(error instanceof Error ? error.message : 'Action failed.');
      this.isSaving.set(false);
    }
  }

  openCreateGroupDialog(): void {
    this.closeMobileActionMenus();
    this.groupDialogMode.set('create');
    this.selectedGroup.set(null);
    this.groupName.set('');
    this.groupDialogError.set('');
    this.groupDialog?.nativeElement.showModal();
  }

  openUpdateGroupDialog(groupName: string): void {
    this.closeMobileActionMenus();
    this.groupDialogMode.set('update');
    this.selectedGroup.set(groupName);
    this.groupName.set(groupName);
    this.groupDialogError.set('');
    this.groupDialog?.nativeElement.showModal();
  }

  openDeleteGroupDialog(groupName: string): void {
    this.closeMobileActionMenus();
    this.groupDialogMode.set('delete');
    this.selectedGroup.set(groupName);
    this.groupName.set(groupName);
    this.groupDialogError.set('');
    this.groupDialog?.nativeElement.showModal();
  }

  closeGroupDialog(): void {
    this.groupDialog?.nativeElement.close();
    this.groupDialogMode.set(null);
    this.selectedGroup.set(null);
    this.groupName.set('');
    this.groupDialogError.set('');
    this.isGroupSaving.set(false);
  }

  async confirmGroupDialogAction(): Promise<void> {
    const mode = this.groupDialogMode();
    const existingGroupName = this.selectedGroup();
    const nextGroupName = this.groupName().trim();

    if (!mode) {
      return;
    }

    this.groupDialogError.set('');
    this.isGroupSaving.set(true);

    try {
      if (mode === 'create') {
        if (!nextGroupName) {
          throw new Error('Group name is required.');
        }

        await this.topicsService.createTopicGroup(nextGroupName);
      }

      if (!existingGroupName) {
        if (mode === 'create') {
          this.closeGroupDialog();
          return;
        }
        throw new Error('Group not found.');
      }

      const groupTopics = this.topics().filter((topic) => (topic.group || 'Article') === existingGroupName);

      if (mode === 'update') {
        if (!nextGroupName) {
          throw new Error('Group name is required.');
        }

        await Promise.all(
          groupTopics.map((topic) =>
            this.topicsService.updateTopic(topic.id, topic.title, nextGroupName),
          ),
        );

        await this.topicsService.renameTopicGroup(existingGroupName, nextGroupName);
      }

      if (mode === 'delete') {
        await Promise.all(groupTopics.map((topic) => this.topicsService.deleteTopic(topic.id)));
        await this.topicsService.deleteTopicGroup(existingGroupName);
      }

      this.closeGroupDialog();
    } catch (error) {
      this.groupDialogError.set(error instanceof Error ? error.message : 'Action failed.');
      this.isGroupSaving.set(false);
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
