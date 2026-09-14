import type { GithubUser } from "@/types/user";
import Image from "next/image";

export default function Result({
  user,
  loading,
  error,
}: {
  user: GithubUser | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return <p className="w-full h-24 p-4">Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return null;
  }
  return (
    <section role="region" className="w-full">
      <div className="flex items-center rounded-2xl p-4 bg-gray-100 dark:bg-gray-800">
        <figure className="rounded-full overflow-hidden w-24 h-24">
          <Image
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="object-cover w-full h-full"
            width={100}
            height={100}
          />
        </figure>
        <div className="flex flex-col items-start ml-4">
          <p className="text-3xl">{user.login}</p>

          <p className="text-lg text-gray-400">{user.name ?? "null"}</p>
          <p>
            Joined{" "}
            <time dateTime={user.created_at}>
              {new Date(user.created_at).toLocaleDateString("en-US")}
            </time>
          </p>
        </div>
      </div>
    </section>
  );
}
