import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ArticlePreviewComponent } from './article-preview.component';
import { Article } from '../models/article.model';
import { ArticlesService } from '../services/articles.service';
import { UserService } from '../../../core/auth/services/user.service';

describe('ArticlePreviewComponent', () => {
  let fixture: ComponentFixture<ArticlePreviewComponent>;

  const baseArticle: Article = {
    slug: 'hello-world',
    title: 'Hello world',
    description: 'A description',
    body: 'Body',
    tagList: [],
    createdAt: '2026-11-05T00:00:00Z',
    updatedAt: '2026-11-05T00:00:00Z',
    favorited: false,
    favoritesCount: 7,
    author: { username: 'jane', bio: null, image: null, following: false },
  };

  function render(article: Article): HTMLElement {
    fixture.componentRef.setInput('articleInput', article);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticlePreviewComponent],
      providers: [
        provideRouter([]),
        { provide: ArticlesService, useValue: {} },
        { provide: UserService, useValue: { isAuthenticated: of(false) } },
      ],
    });
    fixture = TestBed.createComponent(ArticlePreviewComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('shows 0 comments when commentsCount is 0', () => {
    const el = render({ ...baseArticle, commentsCount: 0 });
    const count = el.querySelector('.comments-count');

    expect(count?.textContent?.trim()).toBe('0');
    expect(count?.getAttribute('aria-label')).toBe('0 comments');
  });

  it('shows 0 comments when commentsCount is missing', () => {
    const el = render({ ...baseArticle });
    const count = el.querySelector('.comments-count');

    expect(count?.textContent?.trim()).toBe('0');
    expect(count?.getAttribute('aria-label')).toBe('0 comments');
  });

  it('shows the comment count next to the favourite count', () => {
    const el = render({ ...baseArticle, commentsCount: 3 });
    const count = el.querySelector('.comments-count');
    const favorite = el.querySelector('app-favorite-button');

    expect(count?.textContent?.trim()).toBe('3');
    expect(count?.getAttribute('aria-label')).toBe('3 comments');
    expect(favorite?.textContent?.trim()).toBe('7');
  });
});
