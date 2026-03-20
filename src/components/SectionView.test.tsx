import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SectionView } from "./SectionView";
import { TierProvider } from "../context/TierContext";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => (
    <span data-testid={props["data-testid"] || "fa-icon"} {...props} />
  ),
}));

function renderSectionView(
  props: Partial<React.ComponentProps<typeof SectionView>> = {}
) {
  const defaultProps = {
    sectionId: "review-management",
    onBackClick: jest.fn(),
  };
  return render(
    <TierProvider>
      <SectionView {...defaultProps} {...props} />
    </TierProvider>
  );
}

describe("SectionView", () => {
  it("renders the section title", () => {
    renderSectionView();
    expect(screen.getByText("Review Management")).toBeTruthy();
  });

  it("renders top tabs for sub-features", () => {
    renderSectionView();
    expect(screen.getByText("Reviews")).toBeTruthy();
    expect(screen.getByText("Campaigns")).toBeTruthy();
    expect(screen.getByText("Responses")).toBeTruthy();
  });

  it("defaults to the first sub-feature tab as active", () => {
    renderSectionView();
    const reviewsTab = screen.getByRole("tab", { name: "Reviews" });
    expect(reviewsTab.getAttribute("aria-selected")).toBe("true");
  });

  it("allows clicking a different tab to make it active", async () => {
    const user = userEvent.setup();
    renderSectionView();
    const campaignsTab = screen.getByRole("tab", { name: "Campaigns" });
    await user.click(campaignsTab);
    expect(campaignsTab.getAttribute("aria-selected")).toBe("true");
    expect(
      screen.getByRole("tab", { name: "Reviews" }).getAttribute("aria-selected")
    ).toBe("false");
  });

  it("renders placeholder content for the active tab", () => {
    renderSectionView();
    expect(screen.getByText(/Reviews content/i)).toBeTruthy();
  });

  it("renders a back button", () => {
    renderSectionView();
    expect(screen.getByLabelText("Back to Home")).toBeTruthy();
  });

  it("calls onBackClick when back button is clicked", async () => {
    const user = userEvent.setup();
    const onBackClick = jest.fn();
    renderSectionView({ onBackClick });
    await user.click(screen.getByLabelText("Back to Home"));
    expect(onBackClick).toHaveBeenCalledTimes(1);
  });

  it("hides tab bar when section has only one sub-feature", () => {
    renderSectionView({ sectionId: "ai-custom-research" });
    expect(screen.getByText("AI Custom Research")).toBeTruthy();
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.queryByRole("tab")).toBeNull();
  });

  it("links tabs to tabpanel via aria-controls and aria-labelledby", () => {
    renderSectionView({ sectionId: "review-management" });
    const reviewsTab = screen.getByRole("tab", { name: "Reviews" });
    expect(reviewsTab.getAttribute("id")).toBe("tab-reviews");
    expect(reviewsTab.getAttribute("aria-controls")).toBe("tabpanel-reviews");

    const tabpanel = screen.getByRole("tabpanel");
    expect(tabpanel.getAttribute("id")).toBe("tabpanel-reviews");
    expect(tabpanel.getAttribute("aria-labelledby")).toBe("tab-reviews");
  });

  it("omits tabpanel role and aria-labelledby when section has a single sub-feature", () => {
    renderSectionView({ sectionId: "ai-custom-research" });
    expect(screen.queryByRole("tabpanel")).toBeNull();

    const contentArea = screen.getByText(/Research content/i).closest(
      ".rounded-xl"
    );
    expect(contentArea).toBeTruthy();
    expect(contentArea!.getAttribute("role")).toBeNull();
    expect(contentArea!.getAttribute("aria-labelledby")).toBeNull();
    expect(contentArea!.getAttribute("id")).toBeNull();
  });

  it("handles unknown section gracefully", () => {
    renderSectionView({ sectionId: "nonexistent" });
    expect(screen.getByText("Section not found")).toBeTruthy();
  });
});
