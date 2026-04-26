import { auth } from "@/lib/auth";
import { transcribeAudio } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (Max 20MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let transcriptText;

    try {
      console.log(`Transcribing: ${file.name} | Type: ${file.type} | Size: ${file.size} bytes`);
      transcriptText = await transcribeAudio(buffer, file.type);
    } catch (geminiError: any) {
      console.error("Gemini API Error:", geminiError);
      return NextResponse.json({
        error: "AI Transcription failed.",
        details: geminiError.message,
      }, { status: 500 });
    }

    if (!transcriptText) {
      return NextResponse.json({ error: "Gemini returned an empty transcript." }, { status: 500 });
    }

    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    const transcriptId = Math.random().toString(36).substring(2, 15);
    const result = await pool.query(
      `INSERT INTO transcript (id, "userId", "fileName", content) VALUES ($1, $2, $3, $4) RETURNING *`,
      [transcriptId, session.user.id, file.name, transcriptText]
    );
    await pool.end();

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Failed to transcribe", details: error.message }, { status: 500 });
  }
}
