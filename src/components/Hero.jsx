"use client";
import Image from "next/image";
import  data  from "@/data/home.json";

export default function Hero() {

    // "title": "Meeting Catering in Frankfurt – No waste, no stress.",
    // "subtitle": "Local restaurants. Reusable packaging. Delivery & pickup included.",
    // "note": "Ready in 2 minutes – From €9.90 per person",
    // "button": "Suggest Menu"
  return (
     <section className="bg-gradient-to-r from-[#5c3ab5] to-[#6b46c1] pb-24">

      <div className="grid grid-cols-2 items-center px-16 pt-16">

        {/* Left Content */}
        <div className="text-white">

          <h1 className="text-5xl font-bold leading-tight">
            {data.hero.title}
          </h1>

          <p className="mt-6 text-lg opacity-80">
            {data.hero.subtitle}
          </p>

          {/* Booking Box */}
          <div className="bg-white rounded-xl p-6 mt-10 w-[520px] shadow-lg">

            <div className="flex justify-between text-sm text-gray-600">

              <div>
                <p className="text-gray-400">Personen</p>
                <p className="font-semibold">12</p>
              </div>

              <div>
                <p className="text-gray-400">Datum</p>
                <p className="font-semibold">17.07.2024</p>
              </div>

              <div>
                <p className="text-gray-400">Budget pro Person</p>
                <p className="font-semibold">12€</p>
              </div>

            </div>

            <button className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition">
              {data.hero.button}
            </button>

          </div>

          <p className="text-sm opacity-80 mt-3">
            {data.hero.note}
          </p>

        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <Image
            src="/img/hero-img.jpg"
            width={450}
            height={350}
            alt="food meeting"
            className="rounded-xl shadow-xl"
          />
        </div>

      </div>

    </section>
  );
}