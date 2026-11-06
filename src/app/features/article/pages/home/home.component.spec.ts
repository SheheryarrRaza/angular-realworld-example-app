import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import HomeComponent from './home.component';
import { ArticlesService } from '../../services/articles.service';
import { TagsService } from '../../services/tags.service';
import { UserService } from '../../../../core/auth/services/user.service';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: TagsService, useValue: { getAll: () => of([{ tag: 'dragons', count: 3 }]) } },
        { provide: ArticlesService, useValue: { query: () => of({ articles: [], articlesCount: 0 }) } },
        { provide: UserService, useValue: { isAuthenticated: of(false) } },
      ],
    });
    fixture = TestBed.createComponent(HomeComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('shows each popular tag count and links to its filtered feed', () => {
    fixture.detectChanges();

    const tagLink = (fixture.nativeElement as HTMLElement).querySelector('.tag-list a');

    expect(tagLink?.textContent?.trim()).toBe('dragons 3');
    expect(tagLink?.getAttribute('href')).toBe('/tag/dragons');
  });
});
