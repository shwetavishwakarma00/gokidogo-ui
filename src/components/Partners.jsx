"use client";
import Image from "next/image";
import data from "@/data/home.json";

export default function Partners() {
  return (
    <section className="bg-[#f6f4fb] px-16 py-14">

      <h2 className="text-lg font-semibold text-purple-900 mb-8">
        Unser Frankfurter Genuss-Partner:
      </h2>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Image
            src={data.partners[0].img}
            width={400}
            height={200}
            alt={data.partners[0].name}
            className="w-full h-[150px] object-cover"
          />
          <div className="flex justify-center py-3">
            <span className="bg-white shadow px-4 py-1 rounded-lg text-purple-700 font-semibold">
              {data.partners[0].name}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Image
            src={data.partners[1].img}
            width={400}
            height={200}
            alt={data.partners[1].name}
            className="w-full h-[150px] object-cover"
          />
          <div className="flex justify-center py-3">
            <span className="bg-white shadow px-4 py-1 rounded-lg text-green-600 font-semibold">
              {data.partners[1].name}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Image
            src={data.partners[2].img}
            width={400}
            height={200}
            alt={data.partners[2].name}
            className="w-full h-[150px] object-cover"
          />
          <div className="flex justify-center py-3">
            <span className="bg-white shadow px-4 py-1 rounded-lg text-red-500 font-semibold">
              {data.partners[2].name}
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}