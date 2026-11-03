import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleListComponent } from '../../article/components/article-list.component';
import { ProfileService } from '../services/profile.service';
import { Profile } from '../models/profile.model';
import { ArticleListConfig } from '../../article/models/article-list-config.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-favorites',
  template: `@if (favoritesConfig()) {
    <app-article-list [limit]="10" [config]="favoritesConfig()!" />
  }`,
  imports: [ArticleListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileFavoritesComponent implements OnInit {
  profile = signal<Profile | null>(null);
  favoritesConfig = signal<ArticleListConfig | null>(null);
  destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private readonly profileService: ProfileService,
  ) {
    // Reload the list when the signed-in user clears their favourites.
    effect(() => {
      this.profileService.favoritesCleared();
      const profile = untracked(() => this.profile());
      if (profile) {
        this.favoritesConfig.set(this.buildConfig(profile));
      }
    });
  }

  ngOnInit() {
    this.profileService
      .get(this.route.parent?.snapshot.params['username'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile: Profile) => {
          this.profile.set(profile);
          this.favoritesConfig.set(this.buildConfig(profile));
        },
      });
  }

  private buildConfig(profile: Profile): ArticleListConfig {
    return {
      type: 'all',
      filters: {
        favorited: profile.username,
      },
    };
  }
}
