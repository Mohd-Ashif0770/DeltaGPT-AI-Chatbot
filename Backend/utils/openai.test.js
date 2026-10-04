// openai.test.js
import { jest } from "@jest/globals";
import getOpenAiApiResponse from "./openai.js"; // ✅ Correct file name

// Mock fetch (so no real API call happens)
global.fetch = jest.fn();

test("returns AI response from API", async () => {
  // 👇 Fake API response (like what OpenAI sends back)
  const mockData = {
    choices: [{ message: { content: "Hello! This is a test reply." } }],
  };

  // 👇 When fetch is called, return our fake data
  fetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockData),
  });

  // 👇 Call your function
  const result = await getOpenAiApiResponse("Hi!");

  // 👇 Check if it returns the expected message
  expect(result).toBe("Hello! This is a test reply.");
});
