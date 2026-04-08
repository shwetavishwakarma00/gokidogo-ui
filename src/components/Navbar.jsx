"use client";

<<<<<<< HEAD
import  Link  from "next/link";
=======
import { useState } from "react";
>>>>>>> 7e5fcac539277226f39477a734a0772f6b24990f

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
<<<<<<< HEAD
    <nav className="sticky top-0 z-50 bg-gradient-to-br from-[#5b3fa0] via-[#6b47b8] to-[#7c5dc9] text-white">
=======
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#5a30c5] to-[#7c5bc9] text-white">
>>>>>>> 7e5fcac539277226f39477a734a0772f6b24990f
      
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-4 md:py-6">

        {/* Logo */}
<<<<<<< HEAD
        <Link href='/'>
        <div  className="flex items-center gap-2 text-xl font-semibold">
=======
        <div className="flex items-center gap-2 text-lg md:text-xl font-semibold">
>>>>>>> 7e5fcac539277226f39477a734a0772f6b24990f
          <span>gokidogo</span>
          <span className="text-xs md:text-sm opacity-80">EVENTS</span>
        </div>
        </Link>

<<<<<<< HEAD
        {/* Menu */}
        <div className="flex gap-10 text-sm">
          <a href="#">Wie es funktioniert</a>
          <a href="#">Für Unternehmen</a>
          <a href="#">Nachhaltigkeit</a>
          <a href="/login">Login</a>
=======
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 lg:gap-10 text-sm">
          <a href="#">How it works</a>
          <a href="#">For Businesses</a>
          <a href="#">Sustainability</a>
          <a href="#">Login</a>
>>>>>>> 7e5fcac539277226f39477a734a0772f6b24990f
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