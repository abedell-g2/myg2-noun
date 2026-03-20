import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { useTier } from "../context/TierContext";
import { TIER_ORDER, TIERS } from "../data/tiers";
import type { TierId } from "../data/tiers";

interface TopNavProps {
  onAppSpaceClick: () => void;
  onHomeClick: () => void;
  isRailOpen: boolean;
}

export function TopNav({ onAppSpaceClick, onHomeClick, isRailOpen }: TopNavProps) {
  const { activeTierId, setActiveTierId } = useTier();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onAppSpaceClick}
          aria-label="Open navigation"
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
            isRailOpen
              ? "bg-blue-100 text-blue-600"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faGripVertical} className="text-lg" />
        </button>
        <button
          onClick={onHomeClick}
          className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
        >
          MyG2
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="tier-switcher">
          Switch tier
        </label>
        <select
          id="tier-switcher"
          aria-label="Switch tier"
          value={activeTierId}
          onChange={(e) => setActiveTierId(e.target.value as TierId)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TIER_ORDER.map((tierId) => (
            <option key={tierId} value={tierId}>
              {TIERS[tierId].label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
