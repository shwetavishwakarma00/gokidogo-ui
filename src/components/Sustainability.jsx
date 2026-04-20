// "use client";

// import { Leaf, Info, Recycle } from "lucide-react";
// import { useTranslation } from "../hooks/useTranslation";

// export default function Sustainability() {
//   const { t } = useTranslation();

//   return (
//     <section className="bg-[#f6f4fb] py-5 px-4 md:px-16">
//       <div className="max-w-7xl mx-auto">

//         {/* Title + line */}
//         <div className="flex items-center gap-4 mb-8">
//           <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-[#5b3dbd] whitespace-nowrap">
//             {t("Sustainable & Fair") || "Nachhaltig & Fair:"}
//           </h2>
//           <div className="w-full h-[1px] bg-[#dcd7f3]"></div>
//         </div>

//         {/* Info bar */}
//         <div className="bg-[#ece8f9] rounded-lg px-4 sm:px-6 py-4 overflow-x-auto">
          
//           <div className="flex items-center gap-6 min-w-max">

//             {/* item 1 */}
//             <div className="flex items-center gap-3 text-[#4b3fb3] text-sm sm:text-base whitespace-nowrap">
//               <div className="bg-[#dcd7f3] p-2 rounded-full">
//                 <Recycle size={18} />
//               </div>
//               <p>
//                 {t("Reusable instead of single-use") || "Mehrweg statt Einweg"}
//               </p>
//             </div>

//             <div className="w-[1px] h-6 bg-[#dcd7f3]"></div>

//             {/* item 2 */}
//             <div className="flex items-center gap-3 text-[#4b3fb3] text-sm sm:text-base whitespace-nowrap">
//               <div className="bg-[#dcd7f3] p-2 rounded-full">
//                 <Info size={18} />
//               </div>
//               <p>
//                 {t("2.5x for educational projects") || "2,5 X für Bildungsprojekte"}
//               </p>
//             </div>

//             <div className="w-[1px] h-6 bg-[#dcd7f3]"></div>

//             {/* item 3 */}
//             <div className="flex items-center gap-3 text-[#4b3fb3] text-sm sm:text-base whitespace-nowrap">
//               <div className="bg-[#dcd7f3] p-2 rounded-full">
//                 <Leaf size={18} />
//               </div>
//               <p>
//                 {t("Already saved 12.4 tons of waste !") || (
//                   <>
//                     Schon <span className="font-semibold">12.4 Tonnen</span> Müll gespart!
//                   </>
//                 )}
//               </p>
//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }


"use client";

import * as Icons from "lucide-react"; // safer import (avoids module issues)
import { useTranslation } from "../hooks/useTranslation";

export default function Sustainability() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#f6f4fb] py-5 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-[#5b3dbd] whitespace-nowrap">
            {t("Sustainable & Fair") || "Nachhaltig & Fair:"}
          </h2>
          <div className="w-full h-[1px] bg-[#dcd7f3]" />
        </div>

        {/* Info bar */}
        <div className="bg-[#ece8f9] rounded-lg px-4 sm:px-6 py-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">

            {/* Item 1 */}
            <div className="flex items-center gap-3 w-full py-2 md:py-0">
              <div className="bg-[#dcd7f3] p-2 rounded-full">
                <Icons.Recycle size={18} />
              </div>
              <p className="text-[#4b3fb3] text-sm sm:text-base">
                {t("Reusable instead of single-use") || "Mehrweg statt Einweg"}
              </p>
            </div>

            {/* Divider mobile */}
            <div className="w-full h-[1px] bg-[#dcd7f3] my-2 md:hidden"></div>

            {/* Divider desktop */}
            <div className="hidden md:block w-[6px] h-8 mr-20 bg-[#dcd7f3]"></div>

            {/* Item 2 */}
            <div className="flex items-center gap-3 w-full py-2 md:py-0">
              <div className="bg-[#dcd7f3] p-2 rounded-full">
                <Icons.Info size={18} />
              </div>
              <p className="text-[#4b3fb3] text-sm sm:text-base">
                {t("2.5x for educational projects") || "2,5 X für Bildungsprojekte"}
              </p>
            </div>

            {/* Divider mobile */}
            <div className="w-full h-[1px] bg-[#dcd7f3] my-2 md:hidden"></div>

            {/* Divider desktop */}
            <div className="hidden md:block w-[6px] h-8 mr-20 bg-[#dcd7f3]"></div>

            {/* Item 3 */}
            <div className="flex items-center gap-3 w-full py-2 md:py-0">
              <div className="bg-[#dcd7f3] p-2 rounded-full">
                <Icons.Leaf size={18} />
              </div>
              <p className="text-[#4b3fb3] text-sm sm:text-base">
                {t("Already saved 12.4 tons of waste !") || (
                  <>
                    Schon <span className="font-semibold">12.4 Tonnen</span> Müll gespart!
                  </>
                )}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

