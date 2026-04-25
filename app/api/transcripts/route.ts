import { auth } from "@/lib/auth";
import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM transcript WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
      [session.user.id]
    );

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("Fetch transcripts error:", error);
    return NextResponse.json({ error: "Failed to fetch", details: error.message }, { status: 500 });
  }
}
