"use client";

import { useState, useRef } from "react";

export default function AudioUploader({ onTranscribed }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) uploadFile(file);
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const uploadFile = async (file) => {
    // Validate size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError("File too large. Maximum size is 20MB.");
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);
    setUploadingFile(file.name);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Transcription failed. Please try again.");
        return;
      }

      setSuccess(`"${file.name}" transcribed successfully!`);
      onTranscribed(data.transcript);

      // Clear success after 4 seconds
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setUploading(false);
      setUploadingFile("");
    }
  };

  if (uploading) {
    return (
      <div>
        <div className="upload-progress">
          <div className="upload-progress-spinner" />
          <div className="upload-progress-text">
            Transcribing your audio with AI...
            <br />
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              This may take a few seconds
            </span>
          </div>
          <div className="upload-progress-file">📎 {uploadingFile}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        id="upload-zone"
      >
        <div className="upload-icon">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <div className="upload-text">
          <div className="upload-text-main">
            Drop your audio file here, or <span>browse</span>
          </div>
          <div className="upload-text-sub">
            Supports MP3, WAV, OGG, AAC, M4A, WebM, FLAC • Max 20MB
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="upload-input"
          accept=".mp3,.wav,.ogg,.aac,.m4a,.webm,.flac,audio/*"
          onChange={handleFileSelect}
          id="audio-file-input"
        />
      </div>

      {error && (
        <div
          className="form-error"
          style={{ marginTop: "12px" }}
          id="upload-error"
        >
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div className="upload-success" id="upload-success">
          <span className="upload-success-icon">✅</span>
          <span className="upload-success-text">{success}</span>
        </div>
      )}
    </div>
  );
}
