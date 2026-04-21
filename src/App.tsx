import React, { useCallback, useState } from "react";
import { TierProvider, useTier } from "./context/TierContext";
import { HomeDashboard } from "./components/HomeDashboard";
import { SectionView } from "./components/SectionView";
import { UpgradePage } from "./components/UpgradePage";

type View =
  | { kind: "home" }
  | { kind: "section"; sectionId: string }
  | { kind: "upgrade"; sectionId: string };

function AppContent() {
  const [currentView, setCurrentView] = useState<View>({ kind: "home" });
  const { isSectionAccessible } = useTier();

  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (sectionId === "home") {
        setCurrentView({ kind: "home" });
        return;
      }
      if (isSectionAccessible(sectionId)) {
        setCurrentView({ kind: "section", sectionId });
      } else {
        setCurrentView({ kind: "upgrade", sectionId });
      }
    },
    [isSectionAccessible]
  );

  const navigateHome = useCallback(() => {
    setCurrentView({ kind: "home" });
  }, []);

  const activeSectionId =
    currentView.kind === "section" || currentView.kind === "upgrade"
      ? currentView.sectionId
      : "home";

  return (
    <div className="h-screen overflow-hidden bg-[#f5f4fb]">
      <main className="h-full overflow-y-auto">
        {currentView.kind === "home" && <HomeDashboard />}

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
