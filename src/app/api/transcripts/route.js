import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import pool from "@/lib/db";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT id, title, content, file_name, file_size, mime_type, created_at
       FROM transcript
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [session.user.id]
    );

    const transcripts = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      fileName: row.file_name,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ transcripts });
  } catch (error) {
    console.error("Error fetching transcripts:", error);
    return NextResponse.json(
      { error: "Failed to fetch transcripts" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Transcript ID required" },
        { status: 400 }
      );
    }

    await pool.query(
      "DELETE FROM transcript WHERE id = $1 AND user_id = $2",
      [id, session.user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transcript:", error);
    return NextResponse.json(
      { error: "Failed to delete transcript" },
      { status: 500 }
    );
  }
}
