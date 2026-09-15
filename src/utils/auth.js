export function getUsers() {
  return JSON.parse(localStorage.getItem("PagePace_users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("PagePace_users", JSON.stringify(users));
}

export function getCurrentUser() {
  const id = localStorage.getItem("PagePace_session");
  if (!id) return null;
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}