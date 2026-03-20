import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getSectionById } from "../data/sections";

interface SectionViewProps {
  sectionId: string;
  onBackClick: () => void;
}

export function SectionView({ sectionId, onBackClick }: SectionViewProps) {
  const section = getSectionById(sectionId);
  const [activeTabId, setActiveTabId] = useState<string>(
    section?.subFeatures[0]?.id ?? ""
  );

  if (!section) {
    return (
      <div className="p-8 text-center text-gray-500">Section not found</div>
    );
  }

  const activeTab = section.subFeatures.find((sf) => sf.id === activeTabId);
  const hasTabBar = section.subFeatures.length > 1;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBackClick}
          aria-label="Back to Home"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FontAwesomeIcon icon={section.icon} className="text-lg" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">{section.label}</h1>
        </div>
      </div>

      {hasTabBar && (
        <div role="tablist" className="mb-6 flex gap-1 border-b border-gray-200">
          {section.subFeatures.map((sf) => {
            const isActive = sf.id === activeTabId;
            return (
              <button
                key={sf.id}
                role="tab"
                id={`tab-${sf.id}`}
                aria-selected={isActive}
                aria-controls={`tabpanel-${sf.id}`}
                onClick={() => setActiveTabId(sf.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {sf.label}
              </button>
            );
          })}
        </div>
      )}

      <div
        role={hasTabBar ? "tabpanel" : undefined}
        id={hasTabBar ? `tabpanel-${activeTabId}` : undefined}
        aria-labelledby={hasTabBar ? `tab-${activeTabId}` : undefined}
        className="rounded-xl border border-gray-200 bg-white p-8"
      >
        <div className="text-center text-gray-400">
          <p className="text-lg font-medium">
            {activeTab?.label ?? "Unknown"} content
          </p>
          <p className="mt-2 text-sm">
            This is a placeholder for the {section.label} &mdash;{" "}
            {activeTab?.label} view.
          </p>
        </div>
      </div>
    </div>
  );
}
