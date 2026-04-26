import { GoogleGenerativeAI } from "@google/generative-ai";

export async function transcribeAudio(fileBuffer: Buffer, mimeType: string) {
  // We only check for the API key when this function is actually called
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing from environment variables.");
    throw new Error("Gemini API Key not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Prioritize Gemini 2.0 Flash
  const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-1.5-flash"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`📡 Sending to Gemini (${modelName})...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent([
        {
          inlineData: {
            data: fileBuffer.toString("base64"),
            mimeType: mimeType,
          },
        },
        "Please transcribe this audio accurately. Only provide the transcript text.",
      ]);

      const response = await result.response;
      const text = response.text();
      
      if (text) {
        console.log(`✅ Success with ${modelName}!`);
        return text;
      }
    } catch (err: any) {
      console.error(`❌ ${modelName} failed:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}
