import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TopicsService, Topic } from '../../core/topics.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  topics = signal<Topic[]>([]);

  constructor(private topicsService: TopicsService) {
    this.topicsService.getTopics().subscribe((topics) => {
      this.topics.set(topics);
    });
  }
}
