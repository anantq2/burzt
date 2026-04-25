import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    // Verify session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("audio");

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/aac",
      "audio/mp4",
      "audio/x-m4a",
      "audio/webm",
      "audio/flac",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(mp3|wav|ogg|aac|m4a|webm|flac)$/i)
    ) {
      return NextResponse.json(
        {
          error:
            "Unsupported audio format. Please upload MP3, WAV, OGG, AAC, M4A, WebM, or FLAC.",
        },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    // Determine MIME type
    let mimeType = file.type;
    if (!mimeType || mimeType === "application/octet-stream") {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const mimeMap = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg",
        aac: "audio/aac",
        m4a: "audio/mp4",
        webm: "audio/webm",
        flac: "audio/flac",
      };
      mimeType = mimeMap[ext || ""] || "audio/mpeg";
    }

    // Call Gemini API for transcription
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      "You are an audio transcription assistant. Transcribe the following audio accurately and completely. Return ONLY the transcription text, nothing else. No headers, no labels, no explanations — just the spoken words.",
      {
        inlineData: {
          data: base64Audio,
          mimeType: mimeType,
        },
      },
    ]);

    const transcriptionText = result.response.text().trim();

    if (!transcriptionText) {
      return NextResponse.json(
        {
          error:
            "Failed to transcribe audio. The audio may be empty or unclear.",
        },
        { status: 422 }
      );
    }

    // Store transcript in database
    const insertResult = await pool.query(
      `INSERT INTO transcript (user_id, title, content, file_name, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, content, file_name, file_size, mime_type, created_at`,
      [
        session.user.id,
        file.name.replace(/\.[^/.]+$/, ""),
        transcriptionText,
        file.name,
        file.size,
        mimeType,
      ]
    );

    const transcript = insertResult.rows[0];

    return NextResponse.json({
      success: true,
      transcript: {
        id: transcript.id,
        title: transcript.title,
        content: transcript.content,
        fileName: transcript.file_name,
        fileSize: transcript.file_size,
        mimeType: transcript.mime_type,
        createdAt: transcript.created_at,
      },
    });
  } catch (error) {
    console.error("Transcription error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("SAFETY")) {
      return NextResponse.json(
        {
          error:
            "The audio content was flagged by safety filters. Please try a different audio file.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process audio. Please try again." },
      { status: 500 }
    );
  }
}
