import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicDetailService, TopicDetail } from '../../core/topic-detail.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent {
  topic = signal<TopicDetail | null>(null);

  constructor(
    private route: ActivatedRoute,
    private topicDetailService: TopicDetailService,
    private router: Router
  ) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.topicDetailService.getTopicDetail(id).subscribe((topic) => {
          this.topic.set(topic);
        });
      }
    });
  }

  goToArticle(articleId: string) {
    this.router.navigate(['/article', articleId]);
  }
}
