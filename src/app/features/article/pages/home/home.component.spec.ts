import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import HomeComponent from './home.component';
import { TagsService } from '../../services/tags.service';
import { ArticlesService } from '../../services/articles.service';
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
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('shows each tag count and links the tag to its filtered feed', () => {
    const tagLink = fixture.nativeElement.querySelector('.tag-list a') as HTMLAnchorElement;

    expect(tagLink.textContent?.trim()).toBe('dragons 3');
    expect(tagLink.getAttribute('href')).toBe('/tag/dragons');
  });
});
