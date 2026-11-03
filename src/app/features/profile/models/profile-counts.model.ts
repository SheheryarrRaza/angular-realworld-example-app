export interface ProfileCounts {
  favoritesCount: number;
  /** Only returned to the profile owner; null for everyone else. */
  bookmarksCount: number | null;
}
