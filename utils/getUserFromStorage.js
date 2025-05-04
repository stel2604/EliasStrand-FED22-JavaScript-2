export function getUserFromStorage() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
