export const QUE_HACER_HOME_CAROUSEL_AFTER = 5;
export const QUE_HACER_AUTOPLAY_MS = 5000;

export function shouldUseHomeCardCarousel(count: number): boolean {
  return count > QUE_HACER_HOME_CAROUSEL_AFTER;
}
