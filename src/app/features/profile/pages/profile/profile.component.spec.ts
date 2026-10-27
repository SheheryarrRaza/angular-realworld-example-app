import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { Profile } from '../../models/profile.model';

describe('ProfileComponent favourites tab', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let countCalls: number;

  const profile: Profile = { username: 'me', bio: null, image: '', following: false };

  async function setup(username: string, count$: Observable<number>) {
    countCalls = 0;
    const profileService = {
      get: () => of({ ...profile, username }),
      getFavoritesCount: () => {
        countCalls++;
        return count$;
      },
    };
    const userService = { currentUser: new BehaviorSubject({ username: 'me' }) };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileService },
        { provide: UserService, useValue: userService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { username } } } },
      ],
    });
    fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function favoritesTabText(): string {
    const links = Array.from(fixture.nativeElement.querySelectorAll('a.nav-link')) as HTMLElement[];
    const tab = links.find(a => a.textContent?.includes('Favorited Posts'));
    return (tab?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('shows the count on the signed-in user own profile', async () => {
    await setup('me', of(3));
    expect(favoritesTabText()).toBe('Favorited Posts (3)');
  });

  it('shows a count of zero', async () => {
    await setup('me', of(0));
    expect(favoritesTabText()).toBe('Favorited Posts (0)');
  });

  it('makes no count request on another user profile', async () => {
    await setup('someone-else', of(3));
    expect(countCalls).toBe(0);
    expect(favoritesTabText()).toBe('Favorited Posts');
  });

  it('shows the plain label and still renders the profile when the request fails', async () => {
    await setup(
      'me',
      throwError(() => new Error('boom')),
    );
    expect(favoritesTabText()).toBe('Favorited Posts');
    expect(fixture.nativeElement.querySelector('h4')?.textContent).toBe('me');
  });
});
