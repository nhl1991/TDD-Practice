import { fetchGithubUser } from './github';
describe("fetchGithubUser", () => {
  it("should fetch GitHub user data", async () => {
    // Test implementation goes here
    const mockUsername = 'laslark1991';
    const mockResponse = { login: mockUsername };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;

    const data = await fetchGithubUser(mockUsername);
    expect(data).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/users/${mockUsername}`);
  });

  it("should throw an error if the fetch fails", async () => {
    // Test implementation goes here
    const mockUsername = 'laslark1991';
    const mockResponse = { login: mockUsername };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;

    await expect(fetchGithubUser(mockUsername)).rejects.toThrow();
    expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/users/${mockUsername}`);
  });

  it("should throw an not found error if the fetch fails with 404 status", async () => {
    // Test implementation goes here
    const mockUsername = 'status 404';
    const mockResponse = { login: mockUsername };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;

    await expect(fetchGithubUser(mockUsername)).rejects.toThrow("USER_NOT_FOUND");
    expect(global.fetch).toHaveBeenCalledWith(`https://api.github.com/users/${mockUsername}`);
  });
});