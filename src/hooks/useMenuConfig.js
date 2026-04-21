import { useState, useEffect, useRef } from "react";

export function useMenuConfig(restaurantId) {
  const [configurableHeads, setConfigurableHeads] = useState(new Set());
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!restaurantId || hasFetched.current) return;

    const fetchConfigHeads = async () => {
      hasFetched.current = true;
      try {
        const res = await fetch(
          "https://webapit.gokidogo.de/api/menuconfig/getData",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              restaurantid: String(restaurantId),
            }),
          }
        );
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          const heads = new Set(
            json.data.map((item) => item.modifier_group)
          );
          setConfigurableHeads(heads);
        }
      } catch (err) {
        console.error("useMenuConfig error:", err);
      }
    };

    fetchConfigHeads();
  }, [restaurantId]);

  return { configurableHeads };
}