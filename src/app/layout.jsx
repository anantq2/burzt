import "./globals.css";

export const metadata = {
  title: "VoxScribe — AI Audio Transcription",
  description:
    "Transform audio into text instantly with AI-powered transcription. Upload, transcribe, and manage your audio transcripts in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
