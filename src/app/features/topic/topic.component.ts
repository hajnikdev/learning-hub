import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicDetailService, TopicDetail } from '../../core/topic-detail.service';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent {
  topic = signal<TopicDetail | null>(null);

  constructor(
    private route: ActivatedRoute,
    private topicDetailService: TopicDetailService
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
}
