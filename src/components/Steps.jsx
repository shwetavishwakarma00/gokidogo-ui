"use client";
import data from "@/data/home.json";
import { Calendar, Utensils, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Steps() {
  return (
    <section className="bg-[#f6f4fb] py-14 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-lg sm:text-xl md:text-2xl font-semibold text-purple-900 mb-12 text-center md:text-left"
      >
        It&apos;s that simple:
      </motion.h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {[
          { icon: Calendar, data: data.steps[0] },
          { icon: Utensils, data: data.steps[1] },
          { icon: Truck, data: data.steps[2] }
        ].map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative mt-12"
            >

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-purple-200 opacity-0 hover:opacity-20 blur-xl transition duration-300"></div>

              {/* Icon */}
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-4 rounded-2xl shadow-lg border-4 border-[#f6f4fb]"
                >
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </motion.div>
              </div>

              {/* Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl pt-14 pb-6 px-6 text-center shadow-md hover:shadow-2xl transition duration-300 border border-white/40">

                {/* Step number */}
                <span className="text-xs font-medium text-purple-400 block mb-2">
                  Step {index + 1}
                </span>

                {/* Title */}
                <h3 className="font-semibold text-purple-900 text-base md:text-lg mb-2">
                  {step.data.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.data.desc}
                </p>

              </div>

            </motion.div>
          );
        })}

      </div>
    </section>
  );
}