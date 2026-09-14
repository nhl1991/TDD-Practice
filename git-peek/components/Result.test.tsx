import { render, screen } from "@testing-library/react";
import Result from "./Result";
describe("Result component", () => {
  it("should render the result component", () => {
    // Test implementation goes here
    render(
      <Result
        user={{
          login: "testuser",
          avatar_url: "testurl",
          created_at: "2024-06-01",
          name: "Test User",
        }}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getAllByRole("paragraph")).toHaveLength(3);
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("6/1/2024")).toHaveAttribute(
      "datetime",
      "2024-06-01",
    );
  });

  it("should render the result component with a user without a name", () => {
    // Test implementation goes here
    render(
      <Result
        user={{
          login: "testuser",
          avatar_url: "testurl",
          created_at: "2024-06-01",
          name: null,
        }}
        loading={false}
        error={null}
      />,
    );

    expect(screen.getAllByRole("paragraph")).toHaveLength(3);
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("6/1/2024")).toHaveAttribute(
      "datetime",
      "2024-06-01",
    );
  });

  it("should render the result component with loading state", () => {
    // Test implementation goes here
    render(<Result user={null} loading={true} error={null} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render the result component with error state", () => {
    // Test implementation goes here
    render(<Result user={null} loading={false} error="Failed to fetch user" />);
    expect(screen.getByText("Failed to fetch user")).toBeInTheDocument();
  });

  it("should render nothing when user is null", () => {
    // Test implementation goes here
    const { container } = render(
      <Result user={null} loading={false} error={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
