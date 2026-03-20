import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TierProvider, useTier } from "./TierContext";

function TestConsumer() {
  const { activeTierId, setActiveTierId, isSectionAccessible, accessibleSections, lockedSections } = useTier();
  return (
    <div>
      <span data-testid="tier">{activeTierId}</span>
      <span data-testid="accessible-count">{accessibleSections.length}</span>
      <span data-testid="locked-count">{lockedSections.length}</span>
      <span data-testid="home-accessible">{isSectionAccessible("home") ? "yes" : "no"}</span>
      <span data-testid="market-intel-accessible">{isSectionAccessible("market-intelligence") ? "yes" : "no"}</span>
      <button onClick={() => setActiveTierId("enterprise")}>Set Enterprise</button>
    </div>
  );
}

describe("TierContext", () => {
  it("provides a default tier of starter", () => {
    render(
      <TierProvider>
        <TestConsumer />
      </TierProvider>
    );
    expect(screen.getByTestId("tier").textContent).toBe("starter");
  });

  it("provides accessible and locked section counts for starter tier", () => {
    render(
      <TierProvider>
        <TestConsumer />
      </TierProvider>
    );
    expect(screen.getByTestId("accessible-count").textContent).toBe("12");
    expect(screen.getByTestId("locked-count").textContent).toBe("1");
  });

  it("correctly reports home as accessible for starter", () => {
    render(
      <TierProvider>
        <TestConsumer />
      </TierProvider>
    );
    expect(screen.getByTestId("home-accessible").textContent).toBe("yes");
  });

  it("correctly reports market-intelligence as locked for starter", () => {
    render(
      <TierProvider>
        <TestConsumer />
      </TierProvider>
    );
    expect(screen.getByTestId("market-intel-accessible").textContent).toBe("no");
  });

  it("allows changing the active tier", async () => {
    const user = userEvent.setup();
    render(
      <TierProvider>
        <TestConsumer />
      </TierProvider>
    );
    await user.click(screen.getByText("Set Enterprise"));
    expect(screen.getByTestId("tier").textContent).toBe("enterprise");
    expect(screen.getByTestId("accessible-count").textContent).toBe("13");
    expect(screen.getByTestId("locked-count").textContent).toBe("0");
  });

  it("accepts an initial tier via prop", () => {
    render(
      <TierProvider initialTierId="basic">
        <TestConsumer />
      </TierProvider>
    );
    expect(screen.getByTestId("tier").textContent).toBe("basic");
    expect(screen.getByTestId("accessible-count").textContent).toBe("3");
  });
});
