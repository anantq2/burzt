"use client";

import { useState } from "react";
import AudioUploader from "./AudioUploader";
import TranscriptCard from "./TranscriptCard";

export default function DashboardClient({ initialTranscripts, userName }) {
  const [transcripts, setTranscripts] = useState(initialTranscripts);
  const [toast, setToast] = useState(null);

  const handleNewTranscript = (transcript) => {
    setTranscripts((prev) => [transcript, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/transcripts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setTranscripts((prev) => prev.filter((t) => t.id !== id));
        showToast("Transcript deleted");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const totalWords = transcripts.reduce((sum, t) => {
    return sum + t.content.split(/\s+/).filter(Boolean).length;
  }, 0);

  return (
    <main className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>
          Welcome back, {userName || "Admin"}{" "}
          <span style={{ display: "inline-block", animation: "fadeIn 1s" }}>
            👋
          </span>
        </h1>
        <p>Upload audio files and get instant AI-powered transcriptions</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Total Transcripts</div>
          <div className="stat-value">{transcripts.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Words</div>
          <div className="stat-value">{totalWords.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AI Model</div>
          <div className="stat-value" style={{ fontSize: "18px" }}>
            Gemini 2.5 Flash
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <section className="uploader-section">
        <h2 className="uploader-title">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Audio
        </h2>
        <AudioUploader onTranscribed={handleNewTranscript} />
      </section>

      {/* Transcripts Section */}
      <section className="transcripts-section">
        <div className="transcripts-header">
          <h2 className="transcripts-title">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Your Transcripts
          </h2>
          {transcripts.length > 0 && (
            <span className="transcripts-count">{transcripts.length}</span>
          )}
        </div>

        {transcripts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎙️</div>
            <h3>No transcripts yet</h3>
            <p>
              Upload your first audio file above and watch it get transcribed
              instantly by AI.
            </p>
          </div>
        ) : (
          <div className="transcripts-grid">
            {transcripts.map((transcript) => (
              <TranscriptCard
                key={transcript.id}
                transcript={transcript}
                onDelete={handleDelete}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div className="toast">
          <span>✅</span> {toast}
        </div>
      )}
    </main>
  );
}
