"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const EURO_TO_INR = 90;

export default function ConfigureModal({
  item,
  restaurantId,
  onClose,
  onAddToCart,
}) {
  const [sections, setSections] = useState([]);
  const [optionsMap, setOptionsMap] = useState({});
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const basePrice = parseFloat(item.price) || 0;
  const hasFetched = useRef(false); 

  useEffect(() => {
    if (hasFetched.current) return; 
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const configRes = await fetch(
          "https://webapit.gokidogo.de/api/menuconfig/getData",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              restaurantid: String(restaurantId),
              modifier_group: item.menu_head,
            }),
          }
        );
        const configJson = await configRes.json();
        const activeSections = (configJson.data || []).filter(
          (s) => s.active === 1
        );
        setSections(activeSections);

        const optionsRes = await fetch(
          "https://webapit.gokidogo.de/api/menuoptions/getData",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              restaurantid: String(restaurantId),
              groupName: item.menu_head,
            }),
          }
        );
        const optionsJson = await optionsRes.json();

        const grouped = {};
        (optionsJson.data || []).forEach((opt) => {
          const key = opt.option_type;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(opt);
        });
        setOptionsMap(grouped);

        const defaults = {};
        activeSections.forEach((s) => {
          defaults[s.id] = s.type === "Single" ? null : [];
        });
        setSelections(defaults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  /* ===== PRICE CALC ===== */
  const totalPrice = sections.reduce((total, section) => {
    const included = section.included || 0;
    const selected = selections[section.id];
    const sectionOptions = optionsMap[section.name] || [];

    if (section.type === "Single") {
      if (!selected) return total;
      const opt = sectionOptions.find((o) => o.id === selected);
      return total + (parseFloat(opt?.price) || 0);
    } else {
      const selectedOpts = Array.isArray(selected) ? selected : [];
      const paid = Math.max(0, selectedOpts.length - included);
      const optPrice = parseFloat(sectionOptions[0]?.price) || 0;
      return total + paid * optPrice;
    }
  }, basePrice);

  /* ===== HANDLERS ===== */
  const handleSingle = (sectionId, optionId) => {
    setSelections((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] === optionId ? null : optionId,
    }));
  };

  const handleMulti = (sectionId, optionId, max) => {
    setSelections((prev) => {
      const current = prev[sectionId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [sectionId]: current.filter((o) => o !== optionId) };
      }
      if (current.length >= max) return prev;
      return { ...prev, [sectionId]: [...current, optionId] };
    });
  };

  /* ===== CONFIRM ===== */
  const handleConfirm = () => {
    const addons = [];

    sections.forEach((section) => {
      const selected = selections[section.id];
      const included = section.included || 0;
      const sectionOptions = optionsMap[section.name] || [];

      if (section.type === "Single" && selected) {
        const opt = sectionOptions.find((o) => o.id === selected);
        if (opt) {
          addons.push({
            name: `${section.name}: ${opt.option_name || opt.size}`,
            price: parseFloat(opt.price) || 0,
          });
        }
      } else if (section.type === "Multi" && Array.isArray(selected)) {
        selected.forEach((optId, index) => {
          const opt = sectionOptions.find((o) => o.id === optId);
          if (opt) {
            addons.push({
              name: `${section.name}: ${opt.option_name || opt.size}`,
              price: index >= included ? parseFloat(opt.price) || 0 : 0,
            });
          }
        });
      }
    });

    const cartItem = {
      ...item,
      cartKey: `${item.mnuid}_${Date.now()}`,
      price: totalPrice,
      addons,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-t-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b">
          <div>
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p className="text-sm text-gray-500">
              Base: ₹{(basePrice * EURO_TO_INR).toFixed(0)}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {loading && (
            <p className="text-center text-gray-400 py-8">Loading options...</p>
          )}

          {!loading && sections.map((section) => {
            const included = section.included || 0;
            const sectionOptions = optionsMap[section.name] || [];
            const selectedMulti = selections[section.id] || [];

            return (
              <div key={section.id}>
                {/* Section Title */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">
                    {section.name}
                  </h3>
                  <div className="flex gap-2">
                    {included > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {included} free included
                      </span>
                    )}
                    {section.type === "Multi" && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Max {section.max}
                      </span>
                    )}
                  </div>
                </div>

                {/* No options available */}
                {sectionOptions.length === 0 && (
                  <p className="text-sm text-gray-400">No options available</p>
                )}

                {/* Single → Radio */}
                {section.type === "Single" &&
                  sectionOptions.map((opt) => {
                    const optPrice = parseFloat(opt.price) || 0;
                    const label = opt.option_name?.trim() || opt.size?.trim() || "";
                    const isSelected = selections[section.id] === opt.id;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSingle(section.id, opt.id)}
                        className={`flex justify-between items-center p-3 border rounded-xl cursor-pointer transition mb-2 ${
                          isSelected
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            readOnly
                            checked={isSelected}
                            className="accent-purple-600"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          {optPrice === 0
                            ? "Free"
                            : `+₹${(optPrice * EURO_TO_INR).toFixed(0)}`}
                        </span>
                      </div>
                    );
                  })}

                {/* Multi → Checkbox */}
                {section.type === "Multi" &&
                  sectionOptions.map((opt, index) => {
                    const optPrice = parseFloat(opt.price) || 0;
                    const label = opt.option_name?.trim() || opt.size?.trim() || "";
                    const isSelected = selectedMulti.includes(opt.id);
                    const selectedIndex = selectedMulti.indexOf(opt.id);
                    const isFree = isSelected && selectedIndex < included;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleMulti(section.id, opt.id, section.max)}
                        className={`flex justify-between items-center p-3 border rounded-xl cursor-pointer transition mb-2 ${
                          isSelected
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            readOnly
                            checked={isSelected}
                            className="accent-purple-600"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          {isFree
                            ? "Free"
                            : `+₹${(optPrice * EURO_TO_INR).toFixed(0)}`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-white">
          <button
            onClick={handleConfirm}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold text-base transition"
          >
            Add to Cart — ₹{(totalPrice * EURO_TO_INR).toFixed(0)}
          </button>
        </div>

      </div>
    </div>
  );
}