// // "use client";
// // import Image from "next/image";
// // import { useState } from "react";
// // import data from "@/data/home.json";

// // export default function Hero() {
// //   const [open, setOpen] = useState(false);
// //   const [budget, setBudget] = useState("₹12");

// //   const options = ["₹12", "₹25", "₹50", "₹100"];

// //   return (
// //     <section
// //      style={{ background: "linear-gradient(90deg, #6035b8 0%, #7c5cbf 100%)" }}
// //      className="w-full min-h-[70vh] md:min-h-[80vh] lg:min-h-screen 
// //                 pb-16 md:pb-20 lg:pb-24">
                  
// //       <div className="flex flex-col lg:flex-row items-center px-6 md:px-10 lg:px-16 pt-10 md:pt-14 lg:pt-16 gap-10">
// //         {/* Left Content */}
// //         <div className="flex-1 text-white relative">
// //           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
// //             {data.hero.title}
// //           </h2>

// //           <p className="mt-8 mb-12 text-sm md:text-base leading-snug opacity-90 ">
// //             {data.hero.subtitle}
// //           </p>

// //           {/* Booking Box */}
// //           <div
// //             className="mt-10 w-full max-w-[560px] lg:absolute lg:top-[65%] lg:right-[-60px] z-20"
// //             style={{
// //               background: "#fff",
// //               borderRadius: "16px",
// //               padding: "24px",
// //               minHeight: "180px",
// //               boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
// //             }}
// //           >
// //             {/* Gray Field Container */}
// //             <div className="bg-gray-200/70 backdrop-blur-sm rounded-lg px-4 py-3 mb-4">
// //               <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
// //                 {/* People */}
// //                 <div className="flex items-center gap-1.5 sm:pr-4 sm:border-r border-gray-300">
// //                   <span className="text-xs font-bold text-gray-700">People:</span>
// //                   <span className="text-sm font-bold text-gray-900">12</span>
// //                 </div>

// //                 {/* Date */}
// //                 <div className="flex items-center gap-1.5 sm:px-4 sm:border-r border-gray-300">
// //                   <span className="text-xs font-bold text-gray-700">Date:</span>
// //                   <span className="text-sm font-bold text-gray-900">
// //                     17.07.2024
// //                   </span>
// //                 </div>

// //                 {/* Budget Dropdown */}
// //                 <div className="relative flex items-center gap-1.5 sm:pl-4 flex-1">
// //                   <span className="text-xs font-bold text-gray-700">Budget:</span>

// //                   <button
// //                     onClick={() => setOpen(!open)}
// //                     className="text-sm font-bold text-gray-900 flex items-center gap-1"
// //                   >
// //                     {budget}
// //                     <svg
// //                       className="ml-1"
// //                       width="14"
// //                       height="14"
// //                       fill="none"
// //                       stroke="#666"
// //                       viewBox="0 0 24 24"
// //                     >
// //                       <path strokeWidth={2.5} d="M19 9l-7 7-7-7" />
// //                     </svg>
// //                   </button>

// //                   {/* Dropdown */}
// //                   {open && (
// //                     <div className="absolute top-8 left-0 bg-white shadow-lg rounded-md w-28 z-30 border">
// //                       {options.map((item, i) => (
// //                         <div
// //                           key={i}
// //                           onClick={() => {
// //                             setBudget(item);
// //                             setOpen(false);
// //                           }}
// //                           className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
// //                         >
// //                           {item}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* CTA */}
// //             <button
// //               className="w-full text-white font-bold text-sm sm:text-base mt-3"
// //               style={{
// //                 background: "#3ea85a",
// //                 borderRadius: "10px",
// //                 padding: "14px",
// //               }}
// //             >
// //               {data.hero.button}
// //             </button>
// //           </div>

// //           <div>
// //           <p className="text-xs opacity-80 mt-16 lg:mt-20">{data.hero.note}</p>
// //           </div>
// //         </div>

// //         {/* Right Image */}
// //         <div className="flex-shrink-0 relative">
// //           <Image
// //             src="/img/hero.jpeg"
// //             width={600}
// //             height={400}
// //             alt="food meeting"
// //             className="object-cover rounded-xl shadow-xl 
// //               w-[280px] sm:w-[360px] md:w-[420px] lg:w-[520px] 
// //               h-[180px] sm:h-[240px] md:h-[280px] lg:h-[340px]"
// //           />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }



// "use client";
// import Image from "next/image";
// import { useState } from "react";
// import data from "@/data/home.json";

// export default function Hero() {
//   const [open, setOpen] = useState(false);
//   const [budget, setBudget] = useState("₹12");
//   const [people, setPeople] = useState(12);
//   const [date, setDate] = useState("2024-07-17");

//   const options = ["₹12", "₹25", "₹50", "₹100"];

//   return (
//     <section
//       style={{ background: "linear-gradient(90deg, #6035b8 0%, #7c5cbf 100%)" }}
//       className="w-full min-h-[70vh] md:min-h-[80vh] lg:min-h-screen pb-16 md:pb-20 lg:pb-24"
//     >
//       <div className="flex flex-col lg:flex-row items-center px-6 md:px-10 lg:px-16 pt-10 md:pt-14 lg:pt-16 gap-12">

//         {/* LEFT */}
//         <div className="flex-1 text-white relative">

//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
//             {data.hero.title}
//           </h2>

//           <p className="mt-4 text-sm md:text-base opacity-90 max-w-md">
//             {data.hero.subtitle}
//           </p>

//           {/* BOOKING + NOTE */}
//           <div className="mt-10 w-full max-w-[560px] lg:absolute lg:top-[65%] lg:right-[-60px] z-20">

//             {/* BOX */}
//             <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-2xl">

//               {/* FIELD ROW */}
//               <div className="bg-white/40 backdrop-blur-md rounded-lg px-4 py-3 mb-4">

//                 <div className="flex flex-col sm:flex-row sm:items-center gap-4">

//                   {/* PEOPLE */}
//                   <div className="flex items-center gap-2 sm:border-r pr-4 border-white/40">
//                     <span className="text-xs font-semibold text-white">People:</span>

//                     <button
//                       onClick={() => setPeople(Math.max(1, people - 1))}
//                       className="px-2 bg-white/60 rounded"
//                     >-</button>

//                     <span className="text-sm font-bold text-white">{people}</span>

//                     <button
//                       onClick={() => setPeople(people + 1)}
//                       className="px-2 bg-white/60 rounded"
//                     >+</button>
//                   </div>

//                   {/* DATE */}
//                   <div className="flex items-center gap-2 sm:border-r px-4 border-white/40">
//                     <span className="text-xs font-semibold text-white">Date:</span>
//                     <input
//                       type="date"
//                       value={date}
//                       onChange={(e) => setDate(e.target.value)}
//                       className="bg-transparent text-white text-sm outline-none"
//                     />
//                   </div>

//                   {/* BUDGET */}
//                   <div className="relative flex items-center gap-2 flex-1">
//                     <span className="text-xs font-semibold text-white">Budget:</span>

//                     <button
//                       onClick={() => setOpen(!open)}
//                       className="flex items-center gap-1 text-sm font-bold text-white"
//                     >
//                       {budget}
//                       <svg
//                         className={`ml-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
//                         width="14"
//                         height="14"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeWidth={2.5} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>

//                     {/* DROPDOWN */}
//                     {open && (
//                       <div className="absolute top-8 left-0 bg-white text-black shadow-lg rounded-md w-28 z-30">
//                         {options.map((item, i) => (
//                           <div
//                             key={i}
//                             onClick={() => {
//                               setBudget(item);
//                               setOpen(false);
//                             }}
//                             className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
//                           >
//                             {item}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                 </div>
//               </div>

//               {/* CTA */}
//               <button className="w-full bg-green-500 hover:bg-green-600 transition text-white font-bold py-3 rounded-lg">
//                 {data.hero.button}
//               </button>
//             </div>

//             {/* NOTE */}
//             <p className="text-xs text-white/80 mt-3">
//               {data.hero.note}
//             </p>

//           </div>
//         </div>

//         {/* RIGHT IMAGE */}
//         <div className="flex-shrink-0">
//           <Image
//             src="/img/hero.jpeg"
//             width={600}
//             height={400}
//             alt="food meeting"
//             className="
//               object-cover rounded-xl shadow-xl
//               w-[280px] sm:w-[360px] md:w-[440px] lg:w-[560px]
//               h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px]
//             "
//           />
//         </div>

//       </div>
//     </section>
//   );
// }


"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import data from "@/data/home.json";

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState("₹12");
  const [people, setPeople] = useState(12);
  const [date, setDate] = useState("2024-07-17");

  const dropdownRef = useRef(null);

  const options = ["₹12", "₹25", "₹50", "₹100"];

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      style={{ background: "linear-gradient(90deg, #6035b8 0%, #7c5cbf 100%)" }}
      className="w-full min-h-[70vh] md:min-h-[80vh] lg:min-h-screen pb-16 md:pb-20 lg:pb-24"
    >
      <div className="flex flex-col lg:flex-row items-center px-6 md:px-10 lg:px-16 pt-10 md:pt-14 lg:pt-16 gap-12">

        {/* LEFT */}
        <div className="flex-1 text-white relative">

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold"
          >
            {data.hero.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm md:text-base opacity-90 max-w-md"
          >
            {data.hero.subtitle}
          </motion.p>

          {/* BOOKING + NOTE */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 w-full max-w-[560px] lg:absolute lg:top-[65%] lg:right-[-60px] z-20"
          >

            {/* FLOATING BOX */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="bg-white rounded-2xl p-6 shadow-2xl"
            >

              {/* FIELD ROW */}
              <div className="bg-gray-100 rounded-lg px-4 py-3 mb-4">

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* PEOPLE */}
                  <div className="flex items-center gap-2 sm:border-r pr-4 border-gray-300">
                    <span className="text-xs font-semibold text-gray-700">People:</span>

                    <button
                      onClick={() => setPeople(Math.max(1, people - 1))}
                      className="px-2 bg-gray-200 rounded"
                    >-</button>

                    <span className="text-sm font-bold text-gray-900">{people}</span>

                    <button
                      onClick={() => setPeople(people + 1)}
                      className="px-2 bg-gray-200 rounded"
                    >+</button>
                  </div>

                  {/* DATE */}
                  <div className="flex items-center gap-2 sm:border-r px-4 border-gray-300">
                    <span className="text-xs font-semibold text-gray-700">Date:</span>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="text-sm outline-none"
                    />
                  </div>

                  {/* BUDGET */}
                  <div ref={dropdownRef} className="relative flex items-center gap-2 flex-1">
                    <span className="text-xs font-semibold text-gray-700">Budget:</span>

                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-1 text-sm font-bold text-gray-900"
                    >
                      {budget}
                      <svg
                        className={`ml-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* DROPDOWN */}
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-8 left-0 bg-white shadow-lg rounded-md w-28 z-30 border"
                      >
                        {options.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setBudget(item);
                              setOpen(false);
                            }}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          >
                            {item}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
              >
                {data.hero.button}
              </motion.button>
            </motion.div>

            {/* NOTE */}
            <p className="text-xs text-white/80 mt-3">
              {data.hero.note}
            </p>

          </motion.div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-shrink-0"
        >
          <Image
            src="/img/hero.jpeg"
            width={600}
            height={400}
            alt="food meeting"
            className="
              object-cover rounded-xl shadow-xl
              w-[280px] sm:w-[360px] md:w-[440px] lg:w-[560px]
              h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px]
            "
          />
        </motion.div>

      </div>
    </section>
  );
}