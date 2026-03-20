import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getSectionById } from "../data/sections";
import { getMinimumTierForSection, TIERS } from "../data/tiers";
import { useTier } from "../context/TierContext";

interface UpgradePageProps {
  sectionId: string;
  onBackClick: () => void;
}

export function UpgradePage({ sectionId, onBackClick }: UpgradePageProps) {
  const section = getSectionById(sectionId);
  const { activeTierId } = useTier();

  if (!section) {
    return (
      <div className="p-8 text-center text-gray-500">Section not found</div>
    );
  }

  const requiredTierId = getMinimumTierForSection(sectionId);
  const requiredTierLabel = TIERS[requiredTierId].label;
  const currentTierLabel = TIERS[activeTierId].label;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <button
        onClick={onBackClick}
        aria-label="Back to Home"
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to Home
      </button>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FontAwesomeIcon icon={section.icon} className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">
                {section.label}
              </h1>
              <FontAwesomeIcon icon={faLock} className="text-sm text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Requires {requiredTierLabel} tier
            </p>
          </div>
        </div>

        <p className="mb-6 text-base leading-relaxed text-gray-600">
          {section.description}
        </p>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            Your current tier
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {currentTierLabel}
            </span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-xs text-gray-400"
            />
            <span className="text-sm font-semibold text-amber-600">
              {requiredTierLabel}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Features you will unlock
          </h2>
          <ul className="space-y-2">
            {section.subFeatures.map((sf) => (
              <li
                key={sf.id}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-xs text-green-500"
                />
                {sf.label}
              </li>
            ))}
          </ul>
        </div>

        <button className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Contact Sales to Upgrade
        </button>
      </div>
    </div>
  );
}
