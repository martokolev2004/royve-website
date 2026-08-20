"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface InventoryState {
  data: Record<string, number>;
  loaded: boolean;
}

const InventoryContext = createContext<InventoryState>({ data: {}, loaded: false });

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InventoryState>({ data: {}, loaded: false });

  useEffect(() => {
    fetch("/api/inventory")
      .then((r) => r.json())
      .then((data) => setState({ data, loaded: true }))
      .catch(() => setState({ data: {}, loaded: true }));
  }, []);

  return <InventoryContext.Provider value={state}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  return useContext(InventoryContext);
}
