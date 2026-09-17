export async function fetchUser(user: string) {
  const response = await fetch(`https://api.github.com/users/${user}`, {
    method: "GET"
  });

  if (response.status === 404) throw new Error("User not found");

  if (!response.ok) throw new Error("Server error");

  return response;
}
