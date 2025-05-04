export function isActivePath(path, href) {
  if (path === href) return true;
  if (href === '/' && (path === '/' || path === '/index.html')) return true;
  if (path.includes(href)) return true;
  return false;
}
