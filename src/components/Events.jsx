"use client";
import Image from "next/image";
import data from "@/data/home.json";
export default function Events() {
  return (
      <section className="px-16 py-14 bg-[#f6f4fb]">

      <h2 className="text-xl font-semibold text-purple-900 mb-8">
        Perfekt für eure Events:
      </h2>

      <div className="grid grid-cols-4 gap-6">

        {data.events.map((event, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden shadow-md bg-white"
          >
            <Image
              src={event.img}
              width={300}
              height={200}
              alt={event.title}
              className="w-full h-[160px] object-cover"
            />

            <div className="bg-gradient-to-r from-[#5c3ab5] to-[#6b46c1] text-white text-center py-4">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm opacity-90">{event.price}</p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
