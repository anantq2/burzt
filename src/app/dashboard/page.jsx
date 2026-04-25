import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import pool from "@/lib/db";
import Navbar from "@/components/Navbar";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Fetch transcripts server-side
  let transcripts = [];
  try {
    const result = await pool.query(
      `SELECT id, title, content, file_name, file_size, mime_type, created_at
       FROM transcript
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [session.user.id]
    );

    transcripts = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      fileName: row.file_name,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      createdAt: row.created_at.toISOString(),
    }));
  } catch (err) {
    console.error("Error fetching transcripts:", err);
  }

  return (
    <>
      <Navbar userEmail={session.user.email} />
      <DashboardClient
        initialTranscripts={transcripts}
        userName={session.user.name}
      />
    </>
  );
}
