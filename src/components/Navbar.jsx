"use client";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#5c3ab5] to-[#6b46c1] text-white">
      
      <div className="flex items-center justify-between px-16 py-6">

        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span>gokidogo</span>
          <span className="text-sm opacity-80">EVENTS</span>
        </div>

        {/* Menu */}
        <div className="flex gap-10 text-sm">
          <a href="#">Wie es funktioniert</a>
          <a href="#">Für Unternehmen</a>
          <a href="#">Nachhaltigkeit</a>
          <a href="#">Login</a>
        </div>

      </div>

    </nav>
  );
}