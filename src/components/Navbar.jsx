"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#5a30c5] to-[#7c5bc9] text-white">
      
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-4 md:py-6">

        {/* Logo */}
        <Link href='/'>
        <div className="flex items-center gap-2 text-lg md:text-xl font-semibold">
          <span>gokidogo</span>
          <span className="text-xs md:text-sm opacity-80">EVENTS</span>
        </div>
        </Link>
        

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 lg:gap-10 text-sm">
          <a href="#">How it works</a>
          <a href="#">For Businesses</a>
          <a href="#">Sustainability</a>
          <a href="/login">Login</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 text-sm bg-[#6b46c1]">
          <a href="#">How it works</a>
          <a href="#">For Businesses</a>
          <a href="#">Sustainability</a>
          <a href="#">Login</a>
        </div>
      )}

    </nav>
  );
}