import { GoogleGenerativeAI } from "@google/generative-ai";

export async function transcribeAudio(fileBuffer: Buffer, mimeType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from .env file");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
  ];
  let lastError: Error | null = null;

  for (const modelName of models) {
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
      
      if (err.message?.includes("429") || err.message?.includes("quota")) {
        console.log(`⏳ Quota exceeded for ${modelName}, trying next...`);
        continue;
      }
      
      if (err.message?.includes("404") || err.message?.includes("not found")) {
        console.log(`Model ${modelName} not available, trying next...`);
        continue;
      }
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
}
