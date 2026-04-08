"use client";
import Image from "next/image";
import data from "@/data/home.json";

export default function Events() {
  return (
    <section className="w-full bg-[#f6f4fb] py-10 sm:py-12 md:py-14 px-4 sm:px-6 md:px-10 lg:px-16">
      
      {/* Heading */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-purple-900 mb-6 sm:mb-8">
        Perfect for your events:
      </h2>

      {/* Grid */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-5 sm:gap-6 md:gap-7
      ">
        
        {data.events.map((event, index) => (
          <div
            key={index}
            className="
              rounded-2xl 
              overflow-hidden 
              bg-white 
              shadow-sm 
              hover:shadow-xl 
              transition-all 
              duration-300 
              group
            "
          >
            {/* Image */}
            <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden">
              <Image
                src={event.Image}
                fill
                alt={event.title}
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* Content */}
            <div className="bg-gradient-to-r from-[#5c3ab5] to-[#6b46c1] text-white text-center py-3 sm:py-4 px-2">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg">
                {event.title}
              </h3>
              <p className="text-xs sm:text-sm opacity-90 mt-1">
                {event.price}
              </p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}