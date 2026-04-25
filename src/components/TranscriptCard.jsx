"use client";

import { useState } from "react";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function TranscriptCard({ transcript, onDelete, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const wordCount = transcript.content.split(/\s+/).filter(Boolean).length;
  const isLong = transcript.content.length > 200;

  const handleDelete = async () => {
    if (!confirm("Delete this transcript?")) return;
    setDeleting(true);
    await onDelete(transcript.id);
  };

  return (
    <div
      className="transcript-card"
      style={{ opacity: deleting ? 0.5 : 1 }}
      id={`transcript-${transcript.id}`}
    >
      <div className="transcript-card-header">
        <div className="transcript-card-info">
          <div className="transcript-card-title">{transcript.title}</div>
          <div className="transcript-card-meta">
            <span>📎 {transcript.fileName}</span>
            {transcript.fileSize && (
              <span>💾 {formatFileSize(transcript.fileSize)}</span>
            )}
            <span>📝 {wordCount} words</span>
            <span>🕐 {formatDate(transcript.createdAt)}</span>
          </div>
        </div>

        <div className="transcript-card-actions">
          <button
            className="btn-icon"
            onClick={() => onCopy(transcript.content)}
            title="Copy transcript"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            className="btn-icon delete"
            onClick={handleDelete}
            title="Delete transcript"
            disabled={deleting}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`transcript-card-content ${!expanded && isLong ? "collapsed" : ""}`}
      >
        {transcript.content}
      </div>

      {isLong && (
        <button
          className="transcript-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less ▲" : "Show more ▼"}
        </button>
      )}
    </div>
  );
}
