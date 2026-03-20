import React, { useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useTier } from "../context/TierContext";
import { SECTIONS } from "../data/sections";

interface IconRailProps {
  isOpen: boolean;
  onClose: () => void;
  onSectionClick: (sectionId: string) => void;
  activeSectionId: string;
}

export function IconRail({
  isOpen,
  onClose,
  onSectionClick,
  activeSectionId,
}: IconRailProps) {
  const { isSectionAccessible } = useTier();
  const navRef = useRef<HTMLElement>(null);

  const focusButtonAtIndex = useCallback((index: number) => {
    const nav = navRef.current;
    if (!nav) return;
    const buttons = nav.querySelectorAll<HTMLButtonElement>("button");
    if (index >= 0 && index < buttons.length) {
      buttons[index].focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const nav = navRef.current;
        if (!nav) return;
        const buttons = Array.from(
          nav.querySelectorAll<HTMLButtonElement>("button")
        );
        const currentIndex = buttons.indexOf(
          document.activeElement as HTMLButtonElement
        );
        let nextIndex: number;
        if (e.key === "ArrowDown") {
          nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        }
        focusButtonAtIndex(nextIndex);
      }
    },
    [onClose, focusButtonAtIndex]
  );

  useEffect(() => {
    if (isOpen && navRef.current) {
      const firstButton =
        navRef.current.querySelector<HTMLButtonElement>("button");
      if (firstButton) {
        firstButton.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mainSections = SECTIONS.filter((s) => s.id !== "account");
  const accountSection = SECTIONS.find((s) => s.id === "account");

  return (
    <>
      <div
        data-testid="rail-backdrop"
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />
      <nav
        ref={navRef}
        aria-label="Section navigation"
        onKeyDown={handleKeyDown}
        className="fixed left-0 top-14 bottom-0 z-50 flex w-16 flex-col items-center bg-white border-r border-gray-200 shadow-lg py-3 animate-slide-in"
      >
        <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto">
          {mainSections.map((section) => {
            const accessible = isSectionAccessible(section.id);
            const isActive = section.id === activeSectionId;
            const label = accessible
              ? section.label
              : `${section.label} (Upgrade to unlock)`;

            return (
              <button
                key={section.id}
                aria-label={label}
                title={label}
                onClick={() => onSectionClick(section.id)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : accessible
                    ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    : "text-gray-300 hover:bg-gray-50"
                }`}
              >
                <FontAwesomeIcon icon={section.icon} className="text-base" />
                {!accessible && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-400 text-white">
                    <FontAwesomeIcon icon={faLock} className="text-[7px]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {accountSection && (
          <div className="mt-auto border-t border-gray-200 pt-2">
            <button
              aria-label={accountSection.label}
              title={accountSection.label}
              onClick={() => onSectionClick(accountSection.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                activeSectionId === accountSection.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <FontAwesomeIcon icon={accountSection.icon} className="text-base" />
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
