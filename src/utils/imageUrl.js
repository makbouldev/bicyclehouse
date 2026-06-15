/**
 * Resolves local image/asset paths dynamically based on the application's base URL.
 * Handles the removal of the redundant /bicyclehouse/ prefix if it exists,
 * allowing assets to work on both root domains (like Vercel) and subfolders (like GitHub Pages).
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // Remove '/bicyclehouse' prefix if it exists in the path
  let cleanPath = path;
  if (cleanPath.startsWith('/bicyclehouse/')) {
    cleanPath = cleanPath.substring('/bicyclehouse'.length);
  } else if (cleanPath.startsWith('bicyclehouse/')) {
    cleanPath = '/' + cleanPath.substring('bicyclehouse'.length);
  }

  // Ensure path starts with a single slash
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  // Resolve base URL (e.g. '/' or '/bicyclehouse/')
  const base = import.meta.env.BASE_URL || '/';
  const baseClean = base.endsWith('/') ? base.slice(0, -1) : base;

  return `${baseClean}${cleanPath}`;
};
