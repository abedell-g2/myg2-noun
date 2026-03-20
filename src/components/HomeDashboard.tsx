import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useTier } from "../context/TierContext";
import { SECTIONS } from "../data/sections";
import { getMinimumTierForSection, TIERS } from "../data/tiers";

interface HomeDashboardProps {
  onSectionClick: (sectionId: string) => void;
  onUpgradeClick: (sectionId: string) => void;
}

export function HomeDashboard({
  onSectionClick,
  onUpgradeClick,
}: HomeDashboardProps) {
  const { isSectionAccessible } = useTier();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Welcome to MyG2
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => {
          const accessible = isSectionAccessible(section.id);
          const minTier = getMinimumTierForSection(section.id);
          const minTierLabel = TIERS[minTier].label;

          return (
            <div
              key={section.id}
              data-testid={`section-card-${section.id}`}
              className={`rounded-xl border p-5 transition-shadow ${
                accessible
                  ? "border-gray-200 bg-white shadow-sm hover:shadow-md"
                  : "border-gray-100 bg-gray-50 opacity-75"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    accessible
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <FontAwesomeIcon icon={section.icon} className="text-lg" />
                </div>
                <h2
                  className={`text-base font-semibold ${
                    accessible ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {section.label}
                </h2>
                {!accessible && (
                  <FontAwesomeIcon
                    icon={faLock}
                    className="ml-auto text-sm text-gray-400"
                  />
                )}
              </div>

              <p
                className={`mb-4 text-sm leading-relaxed ${
                  accessible ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {section.description}
              </p>

              {accessible ? (
                <button
                  onClick={() => onSectionClick(section.id)}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {section.primaryCta}
                </button>
              ) : (
                <button
                  onClick={() => onUpgradeClick(section.id)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
                >
                  <FontAwesomeIcon icon={faLock} className="text-xs" />
                  Upgrade to Unlock
                </button>
              )}

              {!accessible && (
                <p className="mt-2 text-xs text-gray-400">
                  Available from {minTierLabel}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
