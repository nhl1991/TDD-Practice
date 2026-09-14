// lib/github.ts
export async function fetchGithubUser(username: string) {
  const response = await fetch(
    `https://api.github.com/users/${username}`
  );

  if (response.status === 404) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("FETCH_FAILED");
  }

  return response.json();
}