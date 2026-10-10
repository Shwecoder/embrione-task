"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          Embrione
        </Link>

        <div className="flex gap-2">
          <Link href="/register" className={linkClass("/register")}>
            Register
          </Link>
          <Link href="/admin" className={linkClass("/admin")}>
            Admin
          </Link>
          <Link href="/team" className={linkClass("/team")}>
            Team
          </Link>
        </div>
      </div>
    </nav>
  );
}