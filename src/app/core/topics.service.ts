import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningContentService, Topic, TopicGroup } from './learning-content.service';

export type { Topic, TopicGroup } from './learning-content.service';

@Injectable({ providedIn: 'root' })
export class TopicsService {
  constructor(private learningContentService: LearningContentService) {}

  getTopics(): Observable<Topic[]> {
    return this.learningContentService.getTopics();
  }

  getTopicGroups(): Observable<TopicGroup[]> {
    return this.learningContentService.getTopicGroups();
  }

  createTopic(title: string, group: string): Promise<void> {
    return this.learningContentService.createTopic(title, group);
  }

  updateTopic(topicId: string, title: string, group: string): Promise<void> {
    return this.learningContentService.updateTopic(topicId, title, group);
  }

  deleteTopic(topicId: string): Promise<void> {
    return this.learningContentService.deleteTopic(topicId);
  }

  createTopicGroup(name: string): Promise<void> {
    return this.learningContentService.createTopicGroup(name);
  }

  renameTopicGroup(oldName: string, newName: string): Promise<void> {
    return this.learningContentService.renameTopicGroup(oldName, newName);
  }

  deleteTopicGroup(name: string): Promise<void> {
    return this.learningContentService.deleteTopicGroup(name);
  }
}
