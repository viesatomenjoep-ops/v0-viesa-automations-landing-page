/** Set to true when the portfolio page should be publicly accessible again. */
export const PORTFOLIO_ENABLED = false;

export function isPortfolioPath(pathname: string): boolean {
  return pathname === '/portfolio' || pathname.startsWith('/portfolio/');
}

export function isPortfolioUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('http')) {
    try {
      return isPortfolioPath(new URL(url).pathname);
    } catch {
      return false;
    }
  }
  const path = url.split('?')[0].split('#')[0];
  return isPortfolioPath(path);
}
