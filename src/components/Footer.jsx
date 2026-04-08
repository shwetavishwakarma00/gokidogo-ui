"use client";
export default function Footer() {
  return (
     <footer className="bg-gradient-to-br from-[#5b3fa0] via-[#6b47b8] to-[#7c5dc9] text-center py-14 text-white">

      <button className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg font-semibold shadow">
        Jetzt Event planen
      </button>

      <div className="flex justify-center gap-8 mt-6 text-sm opacity-90">
        <a href="#">Über uns</a>
        <a href="#">FAQ</a>
        <a href="#">Kontakt</a>
        <a href="#">Datenschutz</a>
      </div>

    </footer>
  );
}


