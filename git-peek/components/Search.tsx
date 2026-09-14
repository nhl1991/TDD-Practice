import { useState } from "react";

type Props = {
  onSearch: (username: string) => void;
};

export default function Search({ onSearch }: Props) {
  // input state
  const [username, setUsername] = useState("");
  return (
    <form
      aria-label="GitHub user search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(username);
      }}
    >
      <input
        type="search"
        placeholder="Search..."
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
