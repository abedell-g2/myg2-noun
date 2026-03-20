import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import type { TierId } from "../data/tiers";
import {
  isSectionAccessible as checkAccess,
  getAccessibleSectionIds,
  getLockedSectionIds,
} from "../data/tiers";
import { SECTIONS } from "../data/sections";
import type { Section } from "../data/sections";

interface TierContextValue {
  activeTierId: TierId;
  setActiveTierId: (tierId: TierId) => void;
  isSectionAccessible: (sectionId: string) => boolean;
  accessibleSections: Section[];
  lockedSections: Section[];
}

const TierContext = createContext<TierContextValue | null>(null);

interface TierProviderProps {
  children: ReactNode;
  initialTierId?: TierId;
}

export function TierProvider({
  children,
  initialTierId = "starter",
}: TierProviderProps) {
  const [activeTierId, setActiveTierId] = useState<TierId>(initialTierId);

  const isSectionAccessible = useCallback(
    (sectionId: string) => checkAccess(sectionId, activeTierId),
    [activeTierId]
  );

  const accessibleSections = useMemo(() => {
    const ids = new Set(getAccessibleSectionIds(activeTierId));
    return SECTIONS.filter((s) => ids.has(s.id));
  }, [activeTierId]);

  const lockedSections = useMemo(() => {
    const ids = new Set(getLockedSectionIds(activeTierId));
    return SECTIONS.filter((s) => ids.has(s.id));
  }, [activeTierId]);

  const value = useMemo<TierContextValue>(
    () => ({
      activeTierId,
      setActiveTierId,
      isSectionAccessible,
      accessibleSections,
      lockedSections,
    }),
    [activeTierId, isSectionAccessible, accessibleSections, lockedSections]
  );

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier(): TierContextValue {
  const ctx = useContext(TierContext);
  if (!ctx) {
    throw new Error("useTier must be used within a TierProvider");
  }
  return ctx;
}
