import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const getOpenAiApiResponse = async (message) => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OpenAI_API_Key;
  const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";

  if (!apiKey || apiKey === "undefined") {
    console.error("Missing OPENROUTER_API_KEY or OpenAI_API_Key in environment variables.");
    throw new Error("Missing API Key. Please set OPENROUTER_API_KEY in Backend/.env");
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "DeltaGPT",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("OpenRouter API Error:", data.error || response.statusText);
      throw new Error(data.error?.message || "Failed to get AI response from OpenRouter");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.log("Error in getOpenAiApiResponse:", error);
    throw error;
  }
};

export default getOpenAiApiResponse;
