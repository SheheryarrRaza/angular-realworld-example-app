import 'zone.js';
import 'zone.js/testing';
import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { TestBed, getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { FavoritesCountService } from './favorites-count.service';
import { ArticlesService } from './articles.service';

describe('FavoritesCountService', () => {
  beforeAll(() => {
    getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  let service: FavoritesCountService;
  let articlesService: ArticlesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritesCountService, ArticlesService],
    });
    service = TestBed.inject(FavoritesCountService);
    articlesService = TestBed.inject(ArticlesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  async function loadWith(count: number) {
    const promise = firstValueFrom(service.load());
    httpMock.expectOne('/user/favorites/count').flush({ favoritesCount: count });
    await promise;
  }

  it('load() requests /user/favorites/count and sets count', async () => {
    expect(service.count()).toBeNull();

    const promise = firstValueFrom(service.load());
    const req = httpMock.expectOne('/user/favorites/count');
    expect(req.request.method).toBe('GET');
    req.flush({ favoritesCount: 12 });

    expect(await promise).toBe(12);
    expect(service.count()).toBe(12);
  });

  it('a failed request leaves count null', async () => {
    const promise = firstValueFrom(service.load());
    httpMock
      .expectOne('/user/favorites/count')
      .flush({ errors: { error: ['unauthorized'] } }, { status: 401, statusText: 'Unauthorized' });

    expect(await promise).toBeNull();
    expect(service.count()).toBeNull();
  });

  it('adjust does nothing while count is null', () => {
    service.adjust(1);
    expect(service.count()).toBeNull();
  });

  it('adjust never takes the count below zero and clear resets it', async () => {
    await loadWith(0);
    service.adjust(-1);
    expect(service.count()).toBe(0);

    service.adjust(2);
    expect(service.count()).toBe(2);

    service.clear();
    expect(service.count()).toBeNull();
  });

  it('ArticlesService.favorite and unfavorite change count by +1 and -1', async () => {
    await loadWith(3);

    const favorited = firstValueFrom(articlesService.favorite('my-slug'));
    httpMock.expectOne('/articles/my-slug/favorite').flush({ article: { slug: 'my-slug' } });
    await favorited;
    expect(service.count()).toBe(4);

    const unfavorited = firstValueFrom(articlesService.unfavorite('my-slug'));
    httpMock.expectOne('/articles/my-slug/favorite').flush(null);
    await unfavorited;
    expect(service.count()).toBe(3);
  });

  it('count is unchanged when the favorite request fails', async () => {
    await loadWith(3);

    const favorited = firstValueFrom(articlesService.favorite('my-slug')).catch(() => null);
    httpMock.expectOne('/articles/my-slug/favorite').flush({}, { status: 500, statusText: 'Server Error' });
    await favorited;
    expect(service.count()).toBe(3);
  });
});
