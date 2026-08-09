"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { subscribeCatalog } from "./store";
import {
  getCatalogFields as staticFields,
  gameIdForName,
  otherCatalog,
  type FilterField,
} from "./filterCatalog";

interface CatalogContextValue {
  persisted: Record<string, FilterField[]>;
  getCatalogFields: (gameName: string) => FilterField[];
}

const CatalogContext = createContext<CatalogContextValue>({
  persisted: {},
  getCatalogFields: staticFields,
});

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Record<string, FilterField[]>>({});

  useEffect(() => {
    const unsub = subscribeCatalog(setPersisted);
    return unsub;
  }, []);

  const getCatalogFields = (gameName: string): FilterField[] => {
    const id = gameIdForName(gameName) ?? "other";
    const override = persisted[id];
    if (override && override.length > 0) return override;
    return staticFields(gameName);
  };

  return (
    <CatalogContext.Provider value={{ persisted, getCatalogFields }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}

export { otherCatalog };
