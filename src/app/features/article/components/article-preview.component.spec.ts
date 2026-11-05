import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ArticlePreviewComponent } from './article-preview.component';
import { Article } from '../models/article.model';

describe('ArticlePreviewComponent', () => {
  let fixture: ComponentFixture<ArticlePreviewComponent>;

  const baseArticle: Article = {
    slug: 'test-article',
    title: 'Test Article',
    description: 'Test description',
    body: 'Test body',
    tagList: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    favorited: false,
    favoritesCount: 5,
    author: {
      username: 'testuser',
      bio: null,
      image: '',
      following: false,
    },
  };

  function render(article: Article): void {
    fixture = TestBed.createComponent(ArticlePreviewComponent);
    fixture.componentRef.setInput('articleInput', article);
    fixture.detectChanges();
  }

  function commentCountElement(): HTMLElement {
    return fixture.nativeElement.querySelector('.comment-count');
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('shows 0 when commentsCount is 0', () => {
    render({ ...baseArticle, commentsCount: 0 });

    expect(commentCountElement().textContent?.trim()).toBe('0');
    expect(commentCountElement().getAttribute('aria-label')).toBe('0 comments');
  });

  it('shows 0 when commentsCount is missing', () => {
    render({ ...baseArticle, commentsCount: undefined });

    expect(commentCountElement().textContent?.trim()).toBe('0');
    expect(commentCountElement().getAttribute('aria-label')).toBe('0 comments');
  });

  it('shows the comment count alongside the favorite count', () => {
    render({ ...baseArticle, commentsCount: 3 });

    expect(commentCountElement().textContent?.trim()).toBe('3');
    expect(commentCountElement().getAttribute('aria-label')).toBe('3 comments');

    const favoriteButton: HTMLElement = fixture.nativeElement.querySelector('app-favorite-button button');
    expect(favoriteButton.textContent).toContain('5');
  });

  it('uses the singular label for one comment', () => {
    render({ ...baseArticle, commentsCount: 1 });

    expect(commentCountElement().getAttribute('aria-label')).toBe('1 comment');
  });
});
