export function extractPath(path) {
  if (path === '/' || path === '/index.html') return 'index';
  if (path === '/info.html') return 'info';
  return false;
}
