"use client";
import { fetchGithubUser } from "@/lib/github";
import Result from "./Result";
import Search from "./Search";
import { useState } from "react";
import type { GithubUser } from "@/types/user";

export default function GithubUserSearch() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const user = await fetchGithubUser(username);
      setUser(user);
    } catch (e: unknown){
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4" role="region">
      <Search onSearch={handleSearch} />
      <Result
        user={user}
        loading={loading}
        error={error}
      />
    </div>
  );
}