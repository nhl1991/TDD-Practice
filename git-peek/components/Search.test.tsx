import { render, screen } from '@testing-library/react';
import Search from './Search';
import userEvent from '@testing-library/user-event';

describe("Search component", () => {
  it("should render the search component", () => {
    // Test implementation goes here
    render(<Search onSearch={function (username: string): void {
        throw new Error('Function not implemented.');
    } } />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it("should have value when typed", () => {
    render(<Search onSearch={function (username: string): void {
        throw new Error('Function not implemented.');
    } } />);
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    input.value = 'test';
    expect(input.value).toBe('test');
  });

  it("calls onSearch when the form is submitted", async () => {
  const onSearch = jest.fn();
  const user = userEvent.setup();

  render(<Search onSearch={onSearch} />);

  await user.type(
    screen.getByRole("searchbox"),
    "octocat"
  );

  await user.click(
    screen.getByRole("button", { name: /search/i })
  );

  expect(onSearch).toHaveBeenCalledWith("octocat");
  })

})