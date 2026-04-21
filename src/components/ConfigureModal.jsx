"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EURO_TO_INR = 90;

export default function ConfigureModal({
  item,
  restaurantId,
  onClose,
  onAddToCart,
}) {
  const [sections, setSections] = useState([]);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const basePrice = parseFloat(item.price) || 0;

  /* ===== FETCH ===== */
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(
          "https://webapit.gokidogo.de/api/menuconfig/getData",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              restaurantid: restaurantId,
              modifier_group: item.menu_head,
            }),
          }
        );
        const json = await res.json();
        if (json.success) {
          const active = json.data.filter((s) => s.active === 1);
          setSections(active);

          // Default selections
          const defaults = {};
          active.forEach((s) => {
            defaults[s.id] = s.type === "Single" ? null : [];
          });
          setSelections(defaults);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [item, restaurantId]);

  /* ===== PRICE CALC ===== */
  const totalPrice = sections.reduce((total, section) => {
    const price = parseFloat(section.price) || 0;
    const included = section.included || 0;
    const selected = selections[section.id];

    if (section.type === "Single") {
      return total + (selected ? price : 0);
    } else {
      const count = Array.isArray(selected) ? selected.length : 0;
      const paid = Math.max(0, count - included);
      return total + paid * price;
    }
  }, basePrice);

  /* ===== HANDLERS ===== */
  const handleSingle = (sectionId) => {
    setSelections((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] ? null : sectionId,
    }));
  };

  const handleMulti = (sectionId, optId, max) => {
    setSelections((prev) => {
      const current = prev[sectionId] || [];
      if (current.includes(optId)) {
        return { ...prev, [sectionId]: current.filter((o) => o !== optId) };
      }
      if (current.length >= max) return prev;
      return { ...prev, [sectionId]: [...current, optId] };
    });
  };

  /* ===== CONFIRM ===== */
  const handleConfirm = () => {
    const addons = [];

    sections.forEach((section) => {
      const selected = selections[section.id];
      const price = parseFloat(section.price) || 0;
      const included = section.included || 0;

      if (section.type === "Single" && selected) {
        addons.push({
          name: section.name,
          price,
        });
      } else if (section.type === "Multi" && Array.isArray(selected)) {
        selected.forEach((_, i) => {
          addons.push({
            name: section.name,
            price: i >= included ? price : 0,
          });
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
            const price = parseFloat(section.price) || 0;
            const included = section.included || 0;
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

                {/* Single → Radio */}
                {section.type === "Single" && (
                  <div
                    onClick={() => handleSingle(section.id)}
                    className={`flex justify-between items-center p-3 border rounded-xl cursor-pointer transition ${
                      selections[section.id]
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        readOnly
                        checked={!!selections[section.id]}
                        className="accent-purple-600"
                      />
                      <span className="text-sm text-gray-700">
                        Add {section.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {price === 0
                        ? "Free"
                        : `+₹${(price * EURO_TO_INR).toFixed(0)}`}
                    </span>
                  </div>
                )}

                {/* Multi → Checkboxes */}
                {section.type === "Multi" && (
                  <div className="space-y-2">
                    {Array.from({ length: section.max }).map((_, i) => {
                      const optId = `${section.id}_${i}`;
                      const isSelected = selectedMulti.includes(optId);
                      const selectedIndex = selectedMulti.indexOf(optId);
                      const isFree = isSelected && selectedIndex < included;

                      return (
                        <div
                          key={optId}
                          onClick={() =>
                            handleMulti(section.id, optId, section.max)
                          }
                          className={`flex justify-between items-center p-3 border rounded-xl cursor-pointer transition ${
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
                            <span className="text-sm text-gray-700">
                              {section.name} #{i + 1}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-500">
                            {isFree
                              ? "Free"
                              : `+₹${(price * EURO_TO_INR).toFixed(0)}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

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