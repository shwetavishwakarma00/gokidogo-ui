"use client";

import  Link  from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-br from-[#5b3fa0] via-[#6b47b8] to-[#7c5dc9] text-white">
      
      <div className="flex items-center justify-between px-16 py-6">

        {/* Logo */}
        <Link href='/'>
        <div  className="flex items-center gap-2 text-xl font-semibold">
          <span>gokidogo</span>
          <span className="text-sm opacity-80">EVENTS</span>
        </div>
        </Link>

        {/* Menu */}
        <div className="flex gap-10 text-sm">
          <a href="#">Wie es funktioniert</a>
          <a href="#">Für Unternehmen</a>
          <a href="#">Nachhaltigkeit</a>
          <a href="/login">Login</a>
        </div>

      </div>

    </nav>
  );
}