import { render, screen } from "@testing-library/react";
import GithubUserSearch from "./GithubUserSearch";
import { fetchGithubUser } from "@/lib/github";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/github", () => ({
  fetchGithubUser: jest.fn(),
}));

const mockedFetchGithubUser = jest.mocked(fetchGithubUser);

describe("GithubUserSearch component", () => {
  it("should render the GithubUserSearch component", () => {
    // Test implementation goes here
    render(<GithubUserSearch />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("should render the GithubUserSearch component with no user", () => {
    render(<GithubUserSearch />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("shows user's information when user is found", async () => {
    // Test implementation goes here

    mockedFetchGithubUser.mockResolvedValue({
      login: "octocat",
      id: 1,
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      created_at: "2024-06-01T00:00:00Z",
    });

    const user = userEvent.setup();
    render(<GithubUserSearch />);
    await user.type(screen.getByRole("searchbox"), "octocat");
    await user.click(screen.getByRole("button", { name: "Search" }));
    // expect(await screen.findByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("octocat")).toBeInTheDocument();
    expect(mockedFetchGithubUser).toHaveBeenCalledWith("octocat");

  });

  it("shows an error message when fetch fails", async () => {
    // Test implementation goes here
    mockedFetchGithubUser.mockRejectedValue(new Error("FETCH_FAILED"));

    const user = userEvent.setup();
    render(<GithubUserSearch />);
    await user.type(screen.getByRole("searchbox"), "unknown-user");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByText("FETCH_FAILED")).toBeInTheDocument();
  });

  it("shows an not found error message when user is not found", async () => {
    mockedFetchGithubUser.mockRejectedValue(new Error("USER_NOT_FOUND"));
    const user = userEvent.setup();
    render(<GithubUserSearch />);
    await user.type(screen.getByRole("searchbox"), "unknown-user");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByText("USER_NOT_FOUND")).toBeInTheDocument();
  })

});
