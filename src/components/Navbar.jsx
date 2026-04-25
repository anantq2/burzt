"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function Navbar({ userEmail }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">V</div>
        <span className="navbar-title">VoxScribe</span>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <span className="navbar-user-dot" />
          <span>{userEmail}</span>
        </div>

        <button id="logout-btn" className="btn-logout" onClick={handleLogout}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}
