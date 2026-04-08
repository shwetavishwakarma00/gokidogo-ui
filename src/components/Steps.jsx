"use client";
import data from "@/data/home.json";
import { Calendar, Utensils, Truck } from "lucide-react";
export default function Steps() {
  return (
   <section className="bg-[#f6f4fb] py-16 px-16">

      <h2 className="text-xl font-semibold text-purple-900 mb-10">
        So einfach geht’s:
      </h2>

      <div className="grid grid-cols-3 gap-6 items-center">

        {/* Step 1 */}
        <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm">

          <div className="bg-purple-100 p-3 rounded-lg">
            <Calendar className="text-purple-700" size={28} />
          </div>

          <div>
            <h3 className="font-semibold text-purple-900">{data.steps[0].title}</h3>
            <p className="text-sm text-gray-500">{data.steps[0].desc}</p>
          </div>

        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm">

          <div className="bg-purple-100 p-3 rounded-lg">
            <Utensils className="text-purple-700" size={28} />
          </div>

          <div>
            <h3 className="font-semibold text-purple-900">{data.steps[1].title}</h3>
            <p className="text-sm text-gray-500">{data.steps[1].desc}</p>
          </div>

        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm">

          <div className="bg-purple-100 p-3 rounded-lg">
            <Truck className="text-purple-700" size={28} />
          </div>

          <div>
            <h3 className="font-semibold text-purple-900">
              {data.steps[2].title}
            </h3>
            <p className="text-sm text-gray-500">{data.steps[2].desc}</p>
          </div>

        </div>

      </div>
    </section>
  );
}


