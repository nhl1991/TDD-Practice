export async function fetchUser(url: string) {
  const response = await fetch(url);

  if (response.status === 404) throw new Error("User not found");

  if (!response.ok) throw new Error("Server error");

  return response;
}
