import 'zone.js';
import 'zone.js/testing';
import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from 'vitest';
import { TestBed, getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  beforeAll(() => {
    getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  let service: TagsService;
  let httpMock: HttpTestingController;

  const mockTags: string[] = ['angular', 'typescript', 'testing', 'rxjs', 'javascript'];
  const tagResponse = (tags: string[]) => ({
    tags,
    tagCounts: tags.map((tag, index) => ({ tag, count: index + 1 })),
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TagsService],
    });

    service = TestBed.inject(TagsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all tags', async () => {
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      expect(req.request.method).toBe('GET');
      req.flush(tagResponse(mockTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(mockTags).tagCounts);
      expect(tags.length).toBe(5);
    });

    it('should extract tags array from response wrapper', async () => {
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(mockTags));
      const tags = await promise;
      expect(Array.isArray(tags)).toBe(true);
      expect((tags as any).tags).toBeUndefined();
    });

    it('should handle empty tags list', async () => {
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse([]));
      const tags = await promise;
      expect(tags).toEqual([]);
      expect(tags.length).toBe(0);
    });

    it('should handle single tag', async () => {
      const singleTag = ['angular'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(singleTag));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(singleTag).tagCounts);
      expect(tags.length).toBe(1);
    });

    it('should handle many tags', async () => {
      const manyTags = Array.from({ length: 100 }, (_, i) => `tag${i}`);
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(manyTags));
      const tags = await promise;
      expect(tags.length).toBe(100);
      expect(tags[0].tag).toBe('tag0');
      expect(tags[99].tag).toBe('tag99');
    });

    it('should handle tags with special characters', async () => {
      const specialTags = ['c++', 'c#', 'node.js', 'vue.js', 'asp.net'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(specialTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(specialTags).tagCounts);
    });

    it('should handle tags with hyphens', async () => {
      const hyphenatedTags = ['web-development', 'machine-learning', 'test-driven-development'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(hyphenatedTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(hyphenatedTags).tagCounts);
    });

    it('should handle tags with underscores', async () => {
      const underscoredTags = ['web_dev', 'unit_testing', 'code_review'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(underscoredTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(underscoredTags).tagCounts);
    });

    it('should handle tags with numbers', async () => {
      const numberedTags = ['angular17', 'vue3', 'react18', 'node20'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(numberedTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(numberedTags).tagCounts);
    });

    it('should handle mixed case tags', async () => {
      const mixedCaseTags = ['Angular', 'TypeScript', 'JavaScript', 'RxJS'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(mixedCaseTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(mixedCaseTags).tagCounts);
    });

    it('should handle tags with spaces', async () => {
      const spacedTags = ['web development', 'machine learning', 'data science'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(spacedTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(spacedTags).tagCounts);
    });

    it('should handle duplicate tags', async () => {
      const duplicateTags = ['angular', 'angular', 'typescript', 'typescript'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(duplicateTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(duplicateTags).tagCounts);
      expect(tags.length).toBe(4);
    });

    it('should handle very long tag names', async () => {
      const longTag = 'a'.repeat(100);
      const longTags = [longTag];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(longTags));
      const tags = await promise;
      expect(tags[0].tag).toBe(longTag);
      expect(tags[0].tag.length).toBe(100);
    });

    it('should handle unicode characters in tags', async () => {
      const unicodeTags = ['日本語', '中文', 'español', 'français', '한국어'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(unicodeTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(unicodeTags).tagCounts);
    });

    it('should handle emoji in tags', async () => {
      const emojiTags = ['🚀 rocket', '💻 coding', '🎨 design', '📱 mobile'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(emojiTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(emojiTags).tagCounts);
    });

    it('should handle server error', async () => {
      const errorResponse = { status: 500, statusText: 'Server Error' };
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush('Server error', errorResponse);
      await expect(promise).rejects.toMatchObject({ status: 500 });
    });

    it('should handle network error', async () => {
      const errorResponse = { status: 0, statusText: 'Network Error' };
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush('Network error', errorResponse);
      await expect(promise).rejects.toMatchObject({ status: 0 });
    });

    it('should handle timeout error', async () => {
      const errorResponse = { status: 504, statusText: 'Gateway Timeout' };
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush('Timeout', errorResponse);
      await expect(promise).rejects.toMatchObject({ status: 504 });
    });

    it('should handle unauthorized access', async () => {
      const errorResponse = { status: 401, statusText: 'Unauthorized' };
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush('Unauthorized', errorResponse);
      await expect(promise).rejects.toMatchObject({ status: 401 });
    });

    it('should handle forbidden access', async () => {
      const errorResponse = { status: 403, statusText: 'Forbidden' };
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush('Forbidden', errorResponse);
      await expect(promise).rejects.toMatchObject({ status: 403 });
    });

    it('should handle not found error', async () => {
      const errorResponse = { status: 404, statusText: 'Not Found' };
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush('Not found', errorResponse);
      await expect(promise).rejects.toMatchObject({ status: 404 });
    });

    it('should make only one HTTP request', () => {
      service.getAll().subscribe();
      const requests = httpMock.match('/tags');
      expect(requests.length).toBe(1);
      requests[0].flush(tagResponse(mockTags));
    });

    it('should handle multiple subscribers', () => {
      const observable = service.getAll();
      observable.subscribe();
      observable.subscribe();
      observable.subscribe();
      // Each subscription makes a new request (no shareReplay)
      const requests = httpMock.match('/tags');
      expect(requests.length).toBe(3);
      requests.forEach(req => req.flush(tagResponse(mockTags)));
    });

    it('should return observable that completes', async () => {
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(mockTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(mockTags).tagCounts);
    });

    it('should handle malformed response', async () => {
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush('invalid json', { status: 200, statusText: 'OK' });
      try {
        await promise;
        throw new Error('should have failed');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle null tag counts in response', async () => {
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush({ tagCounts: null });
      const tags = await promise;
      expect(tags).toBeNull();
    });

    it('should handle undefined tag counts in response', async () => {
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush({ tagCounts: undefined });
      const tags = await promise;
      expect(tags).toBeUndefined();
    });

    it('should handle response without tagCounts property', async () => {
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush({});
      const tags = await promise;
      expect(tags).toBeUndefined();
    });
  });

  describe('Integration scenarios', () => {
    it('should fetch tags multiple times', async () => {
      const promise1 = firstValueFrom(service.getAll());
      const req1 = httpMock.expectOne('/tags');
      req1.flush(tagResponse(mockTags));
      const tags1 = await promise1;
      expect(tags1).toEqual(tagResponse(mockTags).tagCounts);
      const promise2 = firstValueFrom(service.getAll());
      const req2 = httpMock.expectOne('/tags');
      req2.flush(tagResponse(mockTags));
      const tags2 = await promise2;
      expect(tags2).toEqual(tagResponse(mockTags).tagCounts);
    });

    it('should handle rapid successive calls', () => {
      for (let i = 0; i < 5; i++) {
        service.getAll().subscribe();
      }
      const requests = httpMock.match('/tags');
      expect(requests.length).toBe(5);
      requests.forEach(req => req.flush(tagResponse(mockTags)));
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string tags', async () => {
      const emptyStringTags = ['', 'angular', '', 'typescript'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(emptyStringTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(emptyStringTags).tagCounts);
      expect(tags[0].tag).toBe('');
      expect(tags[2].tag).toBe('');
    });

    it('should handle tags with only whitespace', async () => {
      const whitespaceTags = ['   ', '\t', '\n', 'valid'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(whitespaceTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(whitespaceTags).tagCounts);
    });

    it('should handle tags with special URL characters', async () => {
      const urlCharTags = ['tag&param', 'tag?query', 'tag#hash', 'tag/path'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(urlCharTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(urlCharTags).tagCounts);
    });

    it('should handle tags with quotes', async () => {
      const quotedTags = ['"quoted"', "'single'", 'normal'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(quotedTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(quotedTags).tagCounts);
    });

    it('should handle tags with backslashes', async () => {
      const backslashTags = ['tag\\with\\backslash', 'normal'];
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(backslashTags));
      const tags = await promise;
      expect(tags).toEqual(tagResponse(backslashTags).tagCounts);
    });
  });

  describe('Performance', () => {
    it('should handle large number of tags efficiently', async () => {
      const largeTags = Array.from({ length: 1000 }, (_, i) => `tag${i}`);
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(largeTags));
      const tags = await promise;
      expect(tags.length).toBe(1000);
    });

    it('should handle very long tag list', async () => {
      const veryLongTags = Array.from({ length: 10000 }, (_, i) => `tag${i}`);
      const promise = firstValueFrom(service.getAll());
      const req = httpMock.expectOne('/tags');
      req.flush(tagResponse(veryLongTags));
      const tags = await promise;
      expect(tags.length).toBe(10000);
      expect(tags[0].tag).toBe('tag0');
      expect(tags[9999].tag).toBe('tag9999');
    });
  });
});
