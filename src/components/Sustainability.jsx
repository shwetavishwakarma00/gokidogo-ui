"use client";   
import { Leaf, Gift, Shield } from "lucide-react";

export default function Sustainability() {
  return (
    <section className="bg-[#f6f4fb] px-16 py-6">

      <h2 className="text-lg font-semibold text-purple-900 mb-6">
        Nachhaltig & Fair:
      </h2>

      <div className="bg-white rounded-lg p-6 flex justify-between shadow-sm">

        <div className="flex items-center gap-3 text-gray-600">
          <Leaf className="text-purple-700" />
          <p>Mehrweg statt Einweg</p>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <Gift className="text-purple-700" />
          <p>2,5 X für Bildungsprojekte</p>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <Shield className="text-purple-700" />
          <p>Schon <b>12.4 Tonnen</b> Müll gespart!</p>
        </div>

      </div>

    </section>
  );
}


