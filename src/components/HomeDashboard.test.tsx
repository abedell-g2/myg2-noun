import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomeDashboard } from "./HomeDashboard";
import { TierProvider } from "../context/TierContext";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => (
    <span data-testid={props["data-testid"] || "fa-icon"} {...props} />
  ),
}));

function renderDashboard(
  props: Partial<React.ComponentProps<typeof HomeDashboard>> = {},
  tierId: "basic" | "starter" | "enterprise" = "starter"
) {
  const defaultProps = {
    onSectionClick: jest.fn(),
    onUpgradeClick: jest.fn(),
  };
  return render(
    <TierProvider initialTierId={tierId}>
      <HomeDashboard {...defaultProps} {...props} />
    </TierProvider>
  );
}

describe("HomeDashboard", () => {
  it("renders a card for every section (13 total)", () => {
    renderDashboard();
    const cards = screen.getAllByTestId(/section-card-/);
    expect(cards).toHaveLength(13);
  });

  it("renders section labels on cards", () => {
    renderDashboard();
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Review Management")).toBeTruthy();
    expect(screen.getByText("Account")).toBeTruthy();
  });

  it("renders descriptions on cards", () => {
    renderDashboard();
    expect(screen.getByText(/dashboard and overview/i)).toBeTruthy();
  });

  it("shows primary CTA for accessible sections", () => {
    renderDashboard({}, "starter");
    expect(screen.getByText("Go to Dashboard")).toBeTruthy();
    expect(screen.getByText("Manage Reviews")).toBeTruthy();
  });

  it("shows 'Upgrade to unlock' CTA for locked sections", () => {
    renderDashboard({}, "starter");
    const upgradeCtas = screen.getAllByText("Upgrade to Unlock");
    expect(upgradeCtas).toHaveLength(1);
  });

  it("shows 10 upgrade CTAs for basic tier", () => {
    renderDashboard({}, "basic");
    const upgradeCtas = screen.getAllByText("Upgrade to Unlock");
    expect(upgradeCtas).toHaveLength(10);
  });

  it("shows no upgrade CTAs for enterprise tier", () => {
    renderDashboard({}, "enterprise");
    expect(screen.queryByText("Upgrade to Unlock")).toBeNull();
  });

  it("calls onSectionClick when an accessible section card CTA is clicked", async () => {
    const user = userEvent.setup();
    const onSectionClick = jest.fn();
    renderDashboard({ onSectionClick });
    await user.click(screen.getByText("Go to Dashboard"));
    expect(onSectionClick).toHaveBeenCalledWith("home");
  });

  it("calls onUpgradeClick when a locked section card CTA is clicked", async () => {
    const user = userEvent.setup();
    const onUpgradeClick = jest.fn();
    renderDashboard({ onUpgradeClick }, "starter");
    await user.click(screen.getByText("Upgrade to Unlock"));
    expect(onUpgradeClick).toHaveBeenCalledWith("market-intelligence");
  });
});
