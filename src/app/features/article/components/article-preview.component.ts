import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { Article } from '../models/article.model';
import { ArticleMetaComponent } from './article-meta.component';
import { RouterLink } from '@angular/router';

import { FavoriteButtonComponent } from './favorite-button.component';

@Component({
  selector: 'app-article-preview',
  template: `
    <div class="article-preview">
      <app-article-meta [article]="article()">
        <app-favorite-button [article]="article()" (toggle)="toggleFavorite($event)" class="pull-xs-right">
          {{ article().favoritesCount }}
        </app-favorite-button>
        <span class="comments-count pull-xs-right" [attr.aria-label]="commentsLabel()">
          <i class="ion-chatbubble"></i> {{ commentsCount() }}
        </span>
      </app-article-meta>

      <a [routerLink]="['/article', article().slug]" class="preview-link">
        <h1>{{ article().title }}</h1>
        <p>{{ article().description }}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          @for (tag of article().tagList; track tag) {
            <li class="tag-default tag-pill tag-outline">
              {{ tag }}
            </li>
          }
        </ul>
      </a>
    </div>
  `,
  imports: [ArticleMetaComponent, FavoriteButtonComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlePreviewComponent {
  article = signal<Article>(null!);

  @Input({ required: true })
  set articleInput(value: Article) {
    this.article.set(value);
  }

  commentsCount = computed(() => this.article().commentsCount ?? 0);

  commentsLabel = computed(() => `${this.commentsCount()} comments`);

  toggleFavorite(favorited: boolean): void {
    this.article.update(article => ({
      ...article,
      favorited,
      favoritesCount: favorited ? article.favoritesCount + 1 : article.favoritesCount - 1,
    }));
  }
}
