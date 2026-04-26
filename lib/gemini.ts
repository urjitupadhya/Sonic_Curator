import { GoogleGenerativeAI } from "@google/generative-ai";

export async function transcribeAudio(fileBuffer: Buffer, mimeType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // List of models to try in order of preference
  const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`📡 Attempting transcription with ${modelName}...`);
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
        console.log(`✅ Transcription complete using ${modelName}!`);
        return text;
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`⚠️ ${modelName} failed: ${error.message}`);
      // If it's a quota error, we definitely want to try the next model
      if (error.message?.includes("429") || error.message?.includes("quota")) {
        continue;
      }
      // For other errors, maybe try next model too
      continue;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message}`);
}
