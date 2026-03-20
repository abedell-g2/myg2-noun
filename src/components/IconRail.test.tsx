import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconRail } from "./IconRail";
import { TierProvider } from "../context/TierContext";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => (
    <span data-testid={props["data-testid"] || "fa-icon"} {...props} />
  ),
}));

function renderIconRail(
  props: Partial<React.ComponentProps<typeof IconRail>> = {},
  tierId: "basic" | "starter" | "enterprise" = "starter"
) {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSectionClick: jest.fn(),
    activeSectionId: "home",
  };
  return render(
    <TierProvider initialTierId={tierId}>
      <IconRail {...defaultProps} {...props} />
    </TierProvider>
  );
}

describe("IconRail", () => {
  it("renders all 13 section icons when open", () => {
    renderIconRail();
    const rail = screen.getByRole("navigation", { name: "Section navigation" });
    const buttons = within(rail).getAllByRole("button");
    expect(buttons).toHaveLength(13);
  });

  it("does not render when isOpen is false", () => {
    renderIconRail({ isOpen: false });
    expect(screen.queryByRole("navigation", { name: "Section navigation" })).toBeNull();
  });

  it("marks locked sections with a lock indicator for starter tier", () => {
    renderIconRail({}, "starter");
    const marketIntel = screen.getByLabelText("Market Intelligence (Upgrade to unlock)");
    expect(marketIntel).toBeTruthy();
  });

  it("shows no locked indicators for enterprise tier", () => {
    renderIconRail({}, "enterprise");
    expect(
      screen.queryByLabelText(/Upgrade to unlock/)
    ).toBeNull();
  });

  it("shows many locked sections for basic tier", () => {
    renderIconRail({}, "basic");
    const lockedButtons = screen.getAllByLabelText(/Upgrade to unlock/);
    expect(lockedButtons).toHaveLength(10);
  });

  it("calls onSectionClick with section id when an unlocked section is clicked", async () => {
    const user = userEvent.setup();
    const onSectionClick = jest.fn();
    renderIconRail({ onSectionClick });
    await user.click(screen.getByLabelText("Home"));
    expect(onSectionClick).toHaveBeenCalledWith("home");
  });

  it("calls onSectionClick with section id when a locked section is clicked", async () => {
    const user = userEvent.setup();
    const onSectionClick = jest.fn();
    renderIconRail({ onSectionClick }, "starter");
    await user.click(screen.getByLabelText("Market Intelligence (Upgrade to unlock)"));
    expect(onSectionClick).toHaveBeenCalledWith("market-intelligence");
  });

  it("pins Account at the bottom of the rail", () => {
    renderIconRail();
    const rail = screen.getByRole("navigation", { name: "Section navigation" });
    const buttons = within(rail).getAllByRole("button");
    const lastButton = buttons[buttons.length - 1];
    expect(lastButton.getAttribute("aria-label")).toMatch(/Account/);
  });

  it("highlights the active section", () => {
    renderIconRail({ activeSectionId: "home" });
    const homeButton = screen.getByLabelText("Home");
    expect(homeButton.className).toContain("bg-blue");
  });

  it("calls onClose when overlay backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderIconRail({ onClose });
    const backdrop = screen.getByTestId("rail-backdrop");
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("marks the backdrop as aria-hidden", () => {
    renderIconRail();
    const backdrop = screen.getByTestId("rail-backdrop");
    expect(backdrop.getAttribute("aria-hidden")).toBe("true");
  });

  it("closes the rail when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderIconRail({ onClose });
    const rail = screen.getByRole("navigation", { name: "Section navigation" });
    rail.focus();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus between buttons with ArrowDown and ArrowUp", async () => {
    const user = userEvent.setup();
    renderIconRail();
    const rail = screen.getByRole("navigation", { name: "Section navigation" });
    const buttons = within(rail).getAllByRole("button");

    // Focus first button
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);

    // ArrowDown moves to second button
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(buttons[1]);

    // ArrowUp moves back to first button
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(buttons[0]);

    // ArrowUp from first wraps to last
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);

    // ArrowDown from last wraps to first
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(buttons[0]);
  });

  it("focuses the first button when the rail opens", () => {
    renderIconRail();
    const rail = screen.getByRole("navigation", { name: "Section navigation" });
    const buttons = within(rail).getAllByRole("button");
    expect(document.activeElement).toBe(buttons[0]);
  });
});
