import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { firebaseApp } from '../app.config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
  Query,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore';

export interface Topic {
  id: string;
  title: string;
  icon?: string;
  group: string;
}

export interface TopicGroup {
  id: string;
  name: string;
  order: number;
}

export interface ArticleRecord {
  id: string;
  title: string;
  content: string;
  cheatsheet?: string;
  topicId: string;
  sectionId: string;
  order: number;
  ownerUid: string;
}

export interface TopicSection {
  id: string;
  title: string;
  articles: { id: string; title: string; content: string }[];
}

export interface TopicDetail {
  id: string;
  title: string;
  sections: TopicSection[];
}

interface TopicSectionDoc {
  id: string;
  title: string;
  order: number;
  articleIds: string[];
}

interface TopicDoc {
  id: string;
  title: string;
  icon?: string;
  group?: string;
  order: number;
  sections: TopicSectionDoc[];
  ownerUid: string;
}

interface TopicGroupDoc {
  id: string;
  name: string;
  order: number;
  ownerUid: string;
}

@Injectable({ providedIn: 'root' })
export class LearningContentService {
  private readonly db = getFirestore(firebaseApp);
  private readonly auth = getAuth(firebaseApp);
  private readonly topicsCollection = collection(this.db, 'topics');
  private readonly topicGroupsCollection = collection(this.db, 'topicGroups');
  private readonly articlesCollection = collection(this.db, 'articles');
  private readonly userUid$ = new Observable<string | null>((observer) =>
    onAuthStateChanged(
      this.auth,
      (user) => observer.next(user?.uid ?? null),
      (error) => observer.error(error),
    ),
  );

  constructor() {}

  getTopics(): Observable<Topic[]> {
    return this.userUid$.pipe(
      switchMap((uid) => {
        if (!uid) {
          return of([] as TopicDoc[]);
        }

        return this.observeCollection<TopicDoc>(
          query(this.topicsCollection, where('ownerUid', '==', uid)),
        );
      }),
      map((topics) =>
        topics
          .slice()
          .sort(
            (left, right) =>
              (left.group ?? 'Article').localeCompare(right.group ?? 'Article') ||
              left.order - right.order ||
              left.title.localeCompare(right.title),
          )
          .map((topic) => ({
            id: topic.id,
            title: topic.title,
            icon: topic.icon,
            group: topic.group ?? 'Article',
          })),
      ),
    );
  }

  getTopicGroups(): Observable<TopicGroup[]> {
    return this.userUid$.pipe(
      switchMap((uid) => {
        if (!uid) {
          return of([] as TopicGroupDoc[]);
        }

        return this.observeCollection<TopicGroupDoc>(
          query(this.topicGroupsCollection, where('ownerUid', '==', uid)),
        );
      }),
      map((groups) =>
        groups
          .slice()
          .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name))
          .map((group) => ({ id: group.id, name: group.name, order: group.order })),
      ),
    );
  }

  getTopicDetail(topicId: string): Observable<TopicDetail | null> {
    return this.userUid$.pipe(
      switchMap((uid) => {
        if (!uid) {
          return of(null);
        }

        return combineLatest([
          this.observeCollection<TopicDoc>(query(this.topicsCollection, where('ownerUid', '==', uid))),
          this.observeCollection<ArticleRecord>(
            query(this.articlesCollection, where('ownerUid', '==', uid)),
          ),
        ]).pipe(
          map(([topics, articles]) => {
            const topic = topics.find((item) => item.id === topicId);
            if (!topic) {
              return null;
            }

            const articlesById = new Map(
              articles.filter((article) => article.topicId === topicId).map((article) => [article.id, article]),
            );
            const sections = (topic.sections || [])
              .slice()
              .sort((left, right) => {
                // Empty titles (ungrouped) should come first
                const leftIsEmpty = left.title.trim() === '';
                const rightIsEmpty = right.title.trim() === '';
                if (leftIsEmpty && !rightIsEmpty) return -1;
                if (!leftIsEmpty && rightIsEmpty) return 1;
                // Otherwise sort by order and title
                return left.order - right.order || left.title.localeCompare(right.title);
              })
              .map((section, index) => {
                const sectionArticles = section.articleIds
                  .map((articleId) => articlesById.get(articleId))
                  .filter((article): article is ArticleRecord => article !== undefined)
                  .sort(
                    (left, right) => left.order - right.order || left.title.localeCompare(right.title),
                  )
                  .map((article) => ({
                    id: article.id,
                    title: article.title,
                    content: article.content,
                  }));

                // Keep empty titles as-is for ungrouped articles
                return {
                  id: section.id,
                  title: section.title,
                  articles: sectionArticles,
                };
              });

            return {
              id: topic.id,
              title: topic.title,
              sections,
            };
          }),
        );
      }),
    );
  }

  getArticleById(articleId: string): Observable<ArticleRecord | null> {
    return this.userUid$.pipe(
      switchMap((uid) => {
        if (!uid) {
          return of(null);
        }

        return this.observeCollection<ArticleRecord>(
          query(this.articlesCollection, where('ownerUid', '==', uid)),
        ).pipe(map((articles) => articles.find((article) => article.id === articleId) ?? null));
      }),
    );
  }

  async createTopic(title: string, group: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedTitle = title.trim();
    const normalizedGroup = group.trim();
    if (!normalizedTitle) {
      throw new Error('Topic title is required.');
    }
    if (!normalizedGroup) {
      throw new Error('Topic group is required.');
    }

    await this.ensureTopicGroupByName(normalizedGroup, currentUserUid);

    const existingTopics = await this.getTopicsSnapshot(currentUserUid);
    const nextOrder =
      existingTopics.length === 0 ? 0 : Math.max(...existingTopics.map((topic) => topic.order)) + 1;

    const id = this.createId(normalizedTitle, 'topic');
    const topicDoc: TopicDoc = {
      id,
      title: normalizedTitle,
      group: normalizedGroup,
      ownerUid: currentUserUid,
      order: nextOrder,
      sections: [
        {
          id: 'general',
          title: '',
          order: 0,
          articleIds: [],
        },
      ],
    };

    await setDoc(doc(this.db, 'topics', id), topicDoc);
  }

  async createTopicGroup(name: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error('Group name is required.');
    }

    await this.ensureTopicGroupByName(normalizedName, currentUserUid);
  }

  async renameTopicGroup(oldName: string, newName: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedOldName = oldName.trim();
    const normalizedNewName = newName.trim();
    if (!normalizedOldName || !normalizedNewName) {
      throw new Error('Group name is required.');
    }

    if (normalizedOldName.toLowerCase() === normalizedNewName.toLowerCase()) {
      return;
    }

    const sameName = await this.findTopicGroupByName(normalizedNewName, currentUserUid);
    if (sameName) {
      throw new Error('Group with this name already exists.');
    }

    const group = await this.findTopicGroupByName(normalizedOldName, currentUserUid);
    if (!group) {
      await this.ensureTopicGroupByName(normalizedNewName, currentUserUid);
      return;
    }

    await setDoc(doc(this.db, 'topicGroups', group.id), { ...group, name: normalizedNewName }, { merge: true });
  }

  async deleteTopicGroup(name: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new Error('Group not found.');
    }

    const group = await this.findTopicGroupByName(normalizedName, currentUserUid);
    if (!group) {
      return;
    }

    await writeBatch(this.db).delete(doc(this.db, 'topicGroups', group.id)).commit();
  }

  async updateTopic(topicId: string, title: string, group: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedTitle = title.trim();
    const normalizedGroup = group.trim();
    if (!normalizedTitle) {
      throw new Error('Topic title is required.');
    }
    if (!normalizedGroup) {
      throw new Error('Topic group is required.');
    }

    const topicRef = doc(this.db, 'topics', topicId);
    const topicSnapshot = await getDoc(topicRef);
    if (!topicSnapshot.exists()) {
      throw new Error('Topic not found.');
    }

    const current = topicSnapshot.data() as TopicDoc;
    if (current.ownerUid !== currentUserUid) {
      throw new Error('Not authorized to modify this topic.');
    }

    await setDoc(topicRef, { ...current, title: normalizedTitle, group: normalizedGroup }, { merge: true });
  }

  async deleteTopic(topicId: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const topicRef = doc(this.db, 'topics', topicId);
    const topicSnapshot = await getDoc(topicRef);
    if (!topicSnapshot.exists()) {
      throw new Error('Topic not found.');
    }

    const topic = topicSnapshot.data() as TopicDoc;
    if (topic.ownerUid !== currentUserUid) {
      throw new Error('Not authorized to delete this topic.');
    }

    const articles = await this.getArticlesByTopicSnapshot(topicId, currentUserUid);
    const batch = writeBatch(this.db);

    batch.delete(topicRef);
    for (const article of articles) {
      batch.delete(doc(this.db, 'articles', article.id));
    }

    await batch.commit();
  }

  async createArticle(
    topicId: string,
    sectionId: string,
    title: string,
    content: string,
    cheatsheet: string = '',
  ): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      throw new Error('Article title is required.');
    }

    const topicRef = doc(this.db, 'topics', topicId);
    const topicSnapshot = await getDoc(topicRef);
    if (!topicSnapshot.exists()) {
      throw new Error('Topic not found.');
    }

    const topic = topicSnapshot.data() as TopicDoc;
    if (topic.ownerUid !== currentUserUid) {
      throw new Error('Not authorized to modify this topic.');
    }

    const sectionIndex = (topic.sections || []).findIndex((section) => section.id === sectionId);
    if (sectionIndex < 0) {
      throw new Error('Section not found.');
    }

    const section = topic.sections[sectionIndex];
    const articleId = this.createId(normalizedTitle, 'article');

    const articleDoc: ArticleRecord = {
      id: articleId,
      title: normalizedTitle,
      content: content || '',
      cheatsheet: cheatsheet || '',
      topicId,
      sectionId,
      order: section.articleIds.length,
      ownerUid: currentUserUid,
    };

    const updatedSections = [...topic.sections];
    updatedSections[sectionIndex] = {
      ...section,
      articleIds: [...section.articleIds, articleId],
    };

    const batch = writeBatch(this.db);
    batch.set(doc(this.db, 'articles', articleId), articleDoc);
    batch.set(topicRef, { sections: updatedSections }, { merge: true });
    await batch.commit();
  }

  async createSection(topicId: string, title: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedTitle = title.trim();
    // Allow empty titles for ungrouped articles
    // if (!normalizedTitle) {
    //   throw new Error('Group title is required.');
    // }

    const topicRef = doc(this.db, 'topics', topicId);
    const topicSnapshot = await getDoc(topicRef);
    if (!topicSnapshot.exists()) {
      throw new Error('Topic not found.');
    }

    const topic = topicSnapshot.data() as TopicDoc;
    if (topic.ownerUid !== currentUserUid) {
      throw new Error('Not authorized to modify this topic.');
    }

    const nextOrder =
      topic.sections.length === 0
        ? 0
        : Math.max(...topic.sections.map((section) => section.order)) + 1;

    const sectionId = this.createId(normalizedTitle || 'ungrouped', 'section');
    const nextSections = [...topic.sections, { id: sectionId, title: normalizedTitle, order: nextOrder, articleIds: [] }];

    await setDoc(topicRef, { sections: nextSections }, { merge: true });
  }

  async updateSection(topicId: string, sectionId: string, title: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      throw new Error('Group title is required.');
    }

    const topicRef = doc(this.db, 'topics', topicId);
    const topicSnapshot = await getDoc(topicRef);
    if (!topicSnapshot.exists()) {
      throw new Error('Topic not found.');
    }

    const topic = topicSnapshot.data() as TopicDoc;
    if (topic.ownerUid !== currentUserUid) {
      throw new Error('Not authorized to modify this topic.');
    }

    const sectionIndex = topic.sections.findIndex((section) => section.id === sectionId);
    if (sectionIndex < 0) {
      throw new Error('Group not found.');
    }

    const nextSections = [...topic.sections];
    nextSections[sectionIndex] = {
      ...topic.sections[sectionIndex],
      title: normalizedTitle,
    };

    await setDoc(topicRef, { sections: nextSections }, { merge: true });
  }

  async deleteSection(topicId: string, sectionId: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const topicRef = doc(this.db, 'topics', topicId);
    const topicSnapshot = await getDoc(topicRef);
    if (!topicSnapshot.exists()) {
      throw new Error('Topic not found.');
    }

    const topic = topicSnapshot.data() as TopicDoc;
    if (topic.ownerUid !== currentUserUid) {
      throw new Error('Not authorized to modify this topic.');
    }

    const section = topic.sections.find((item) => item.id === sectionId);
    if (!section) {
      throw new Error('Group not found.');
    }

    const nextSections = topic.sections
      .filter((item) => item.id !== sectionId)
      .map((item, index) => ({ ...item, order: index }));

    const batch = writeBatch(this.db);
    batch.set(topicRef, { sections: nextSections }, { merge: true });

    for (const articleId of section.articleIds) {
      batch.delete(doc(this.db, 'articles', articleId));
    }

    await batch.commit();
  }

  async updateArticle(
    articleId: string,
    title: string,
    content: string,
    cheatsheet?: string,
  ): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      throw new Error('Article title is required.');
    }

    const articleRef = doc(this.db, 'articles', articleId);
    const articleSnapshot = await getDoc(articleRef);
    if (!articleSnapshot.exists()) {
      throw new Error('Article not found.');
    }

    const article = articleSnapshot.data() as ArticleRecord;
    if (article.ownerUid !== currentUserUid) {
      throw new Error('Not authorized to modify this article.');
    }

    await setDoc(
      articleRef,
      {
        ...article,
        title: normalizedTitle,
        content: content || '',
        cheatsheet: cheatsheet ?? article.cheatsheet ?? '',
      },
      { merge: true },
    );
  }

  async deleteArticle(topicId: string, sectionId: string, articleId: string): Promise<void> {
    const currentUserUid = this.requireCurrentUserUid();
    const topicRef = doc(this.db, 'topics', topicId);
    const topicSnapshot = await getDoc(topicRef);
    if (!topicSnapshot.exists()) {
      throw new Error('Topic not found.');
    }

    const topic = topicSnapshot.data() as TopicDoc;
    if (topic.ownerUid !== currentUserUid) {
      throw new Error('Not authorized to modify this topic.');
    }

    const sectionIndex = (topic.sections || []).findIndex((section) => section.id === sectionId);
    if (sectionIndex < 0) {
      throw new Error('Section not found.');
    }

    const section = topic.sections[sectionIndex];
    const updatedSections = [...topic.sections];
    updatedSections[sectionIndex] = {
      ...section,
      articleIds: section.articleIds.filter((id) => id !== articleId),
    };

    const batch = writeBatch(this.db);
    batch.delete(doc(this.db, 'articles', articleId));
    batch.set(topicRef, { sections: updatedSections }, { merge: true });
    await batch.commit();
  }

  private observeCollection<T>(source: Query | CollectionReference): Observable<T[]> {
    return new Observable<T[]>((observer) =>
      onSnapshot(
        source,
        (snapshot) => {
          const data = snapshot.docs.map((document) => document.data() as T);
          observer.next(data);
        },
        (error) => observer.error(error),
      ),
    );
  }

  private observeDocument<T>(reference: DocumentReference): Observable<T | null> {
    return new Observable<T | null>((observer) =>
      onSnapshot(
        reference,
        (snapshot) => {
          observer.next(snapshot.exists() ? (snapshot.data() as T) : null);
        },
        (error) => observer.error(error),
      ),
    );
  }

  private async getTopicsSnapshot(ownerUid: string): Promise<TopicDoc[]> {
    const snapshot = await getDocs(query(this.topicsCollection, where('ownerUid', '==', ownerUid)));
    return snapshot.docs.map((document) => document.data() as TopicDoc);
  }

  private async getTopicGroupsSnapshot(ownerUid: string): Promise<TopicGroupDoc[]> {
    const snapshot = await getDocs(query(this.topicGroupsCollection, where('ownerUid', '==', ownerUid)));
    return snapshot.docs.map((document) => document.data() as TopicGroupDoc);
  }

  private async ensureTopicGroupByName(name: string, ownerUid: string): Promise<void> {
    const existingGroups = await this.getTopicGroupsSnapshot(ownerUid);
    const found = existingGroups.find((group) => group.name.toLowerCase() === name.toLowerCase());
    if (found) {
      return;
    }

    const nextOrder =
      existingGroups.length === 0 ? 0 : Math.max(...existingGroups.map((group) => group.order)) + 1;

    const id = this.createId(name, 'group');
    const topicGroupDoc: TopicGroupDoc = {
      id,
      name,
      order: nextOrder,
      ownerUid,
    };

    await setDoc(doc(this.db, 'topicGroups', id), topicGroupDoc);
  }

  private async findTopicGroupByName(name: string, ownerUid: string): Promise<TopicGroupDoc | null> {
    const groups = await this.getTopicGroupsSnapshot(ownerUid);
    return groups.find((group) => group.name.toLowerCase() === name.toLowerCase()) ?? null;
  }

  private async getArticlesByTopicSnapshot(topicId: string, ownerUid: string): Promise<ArticleRecord[]> {
    const snapshot = await getDocs(
      query(
        this.articlesCollection,
        where('ownerUid', '==', ownerUid),
        where('topicId', '==', topicId),
      ),
    );
    return snapshot.docs.map((document) => document.data() as ArticleRecord);
  }

  private requireCurrentUserUid(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('You must be logged in to perform this action.');
    }

    return uid;
  }

  private createId(_title: string, prefix: 'topic' | 'article' | 'section' | 'group'): string {
    const randomPart = Math.random().toString(36).slice(2, 10);
    const timePart = Date.now().toString(36);
    return `${prefix}_${timePart}${randomPart}`;
  }
}
