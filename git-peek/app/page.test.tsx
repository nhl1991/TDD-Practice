import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Page component", () => {
  it("should render the page component", () => {
    // Test implementation goes here
    render(<Page />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});