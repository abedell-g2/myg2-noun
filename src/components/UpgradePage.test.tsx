import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpgradePage } from "./UpgradePage";
import { TierProvider } from "../context/TierContext";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => (
    <span data-testid={props["data-testid"] || "fa-icon"} {...props} />
  ),
}));

function renderUpgradePage(
  props: Partial<React.ComponentProps<typeof UpgradePage>> = {}
) {
  const defaultProps = {
    sectionId: "market-intelligence",
    onBackClick: jest.fn(),
  };
  return render(
    <TierProvider initialTierId="starter">
      <UpgradePage {...defaultProps} {...props} />
    </TierProvider>
  );
}

describe("UpgradePage", () => {
  it("renders the section name in the heading", () => {
    renderUpgradePage();
    expect(screen.getByText(/Market Intelligence/)).toBeTruthy();
  });

  it("shows the minimum tier required", () => {
    renderUpgradePage();
    expect(screen.getByText(/Requires Enterprise tier/)).toBeTruthy();
  });

  it("lists the section sub-features as features to unlock", () => {
    renderUpgradePage();
    expect(screen.getByText("Market Data")).toBeTruthy();
    expect(screen.getByText("Trends")).toBeTruthy();
  });

  it("shows a description of the section", () => {
    renderUpgradePage();
    expect(screen.getByText(/Enterprise-level market research/)).toBeTruthy();
  });

  it("renders an upgrade CTA button", () => {
    renderUpgradePage();
    expect(screen.getByRole("button", { name: /Contact Sales/i })).toBeTruthy();
  });

  it("renders a back button", () => {
    renderUpgradePage();
    expect(screen.getByLabelText("Back to Home")).toBeTruthy();
  });

  it("calls onBackClick when back button is clicked", async () => {
    const user = userEvent.setup();
    const onBackClick = jest.fn();
    renderUpgradePage({ onBackClick });
    await user.click(screen.getByLabelText("Back to Home"));
    expect(onBackClick).toHaveBeenCalledTimes(1);
  });

  it("handles unknown section gracefully", () => {
    renderUpgradePage({ sectionId: "nonexistent" });
    expect(screen.getByText("Section not found")).toBeTruthy();
  });

  it("shows current tier vs required tier", () => {
    renderUpgradePage();
    expect(screen.getByText(/Your current tier/i)).toBeTruthy();
    expect(screen.getByText(/Starter/)).toBeTruthy();
  });
});
