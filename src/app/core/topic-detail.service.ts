import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ArticleRecord,
  LearningContentService,
  TopicDetail,
  TopicSection,
} from './learning-content.service';

export type { TopicDetail, TopicSection } from './learning-content.service';

@Injectable({ providedIn: 'root' })
export class TopicDetailService {
  constructor(private learningContentService: LearningContentService) {}

  getTopicDetail(id: string): Observable<TopicDetail | null> {
    return this.learningContentService.getTopicDetail(id);
  }

  getArticleById(articleId: string): Observable<ArticleRecord | null> {
    return this.learningContentService.getArticleById(articleId);
  }

  createArticle(
    topicId: string,
    sectionId: string,
    title: string,
    content: string,
    cheatsheet: string = '',
  ): Promise<void> {
    return this.learningContentService.createArticle(topicId, sectionId, title, content, cheatsheet);
  }

  createSection(topicId: string, title: string): Promise<void> {
    return this.learningContentService.createSection(topicId, title);
  }

  updateSection(topicId: string, sectionId: string, title: string): Promise<void> {
    return this.learningContentService.updateSection(topicId, sectionId, title);
  }

  deleteSection(topicId: string, sectionId: string): Promise<void> {
    return this.learningContentService.deleteSection(topicId, sectionId);
  }

  updateArticle(articleId: string, title: string, content: string, cheatsheet?: string): Promise<void> {
    return this.learningContentService.updateArticle(articleId, title, content, cheatsheet);
  }

  deleteArticle(topicId: string, sectionId: string, articleId: string): Promise<void> {
    return this.learningContentService.deleteArticle(topicId, sectionId, articleId);
  }
}
