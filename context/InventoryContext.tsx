"use client";
import { createContext, useContext, useEffect, useState } from "react";

const InventoryContext = createContext<Record<string, number>>({});

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/inventory")
      .then((r) => r.json())
      .then(setInventory)
      .catch(() => {});
  }, []);

  return <InventoryContext.Provider value={inventory}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  return useContext(InventoryContext);
}
