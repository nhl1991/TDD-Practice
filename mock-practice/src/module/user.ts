import { fetchUser } from "../lib/fetchUser";

export async function getUser(url: string) {
  const user = (await fetchUser(url)).json();
  return user;
}