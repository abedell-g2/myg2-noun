import React, { useState, useCallback } from "react";
import { TierProvider, useTier } from "./context/TierContext";
import { TopNav } from "./components/TopNav";
import { IconRail } from "./components/IconRail";
import { HomeDashboard } from "./components/HomeDashboard";
import { SectionView } from "./components/SectionView";
import { UpgradePage } from "./components/UpgradePage";

type View =
  | { kind: "home" }
  | { kind: "section"; sectionId: string }
  | { kind: "upgrade"; sectionId: string };

function AppContent() {
  const [currentView, setCurrentView] = useState<View>({ kind: "home" });
  const [isRailOpen, setIsRailOpen] = useState(false);
  const { isSectionAccessible } = useTier();

  const navigateHome = useCallback(() => {
    setCurrentView({ kind: "home" });
  }, []);

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (isSectionAccessible(sectionId)) {
        setCurrentView({ kind: "section", sectionId });
      } else {
        setCurrentView({ kind: "upgrade", sectionId });
      }
      setIsRailOpen(false);
    },
    [isSectionAccessible]
  );

  const navigateToUpgrade = useCallback((sectionId: string) => {
    setCurrentView({ kind: "upgrade", sectionId });
  }, []);

  const toggleRail = useCallback(() => {
    setIsRailOpen((prev) => !prev);
  }, []);

  const closeRail = useCallback(() => {
    setIsRailOpen(false);
  }, []);

  const activeSectionId =
    currentView.kind === "section" || currentView.kind === "upgrade"
      ? currentView.sectionId
      : "home";

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav
        onAppSpaceClick={toggleRail}
        onHomeClick={navigateHome}
        isRailOpen={isRailOpen}
      />

      <IconRail
        isOpen={isRailOpen}
        onClose={closeRail}
        onSectionClick={navigateToSection}
        activeSectionId={activeSectionId}
      />

      <main className="pt-14">
        {currentView.kind === "home" && (
          <HomeDashboard
            onSectionClick={navigateToSection}
            onUpgradeClick={navigateToUpgrade}
          />
        )}

        {currentView.kind === "section" && (
          <SectionView
            key={currentView.sectionId}
            sectionId={currentView.sectionId}
            onBackClick={navigateHome}
          />
        )}

        {currentView.kind === "upgrade" && (
          <UpgradePage
            sectionId={currentView.sectionId}
            onBackClick={navigateHome}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TierProvider>
      <AppContent />
    </TierProvider>
  );
}
