const MODEL = "gemini-2.0-flash";

export async function askGemini(prompt) {
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log("All env vars:", import.meta.env);
console.log("Gemini key loaded:", Boolean(import.meta.env.VITE_GEMINI_API_KEY));
  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Check your .env file and restart the server."
    );
  }

  if (!prompt || !prompt.trim()) {
    throw new Error("Please enter a question.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt.trim(),
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
        `Gemini request failed with status ${response.status}`
    );
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("")
    .trim();

  if (!text) {
    const blockReason = data?.promptFeedback?.blockReason;

    if (blockReason) {
      throw new Error(`Gemini blocked the request: ${blockReason}`);
    }

    throw new Error("Gemini returned no text.");
  }

  return text;
}