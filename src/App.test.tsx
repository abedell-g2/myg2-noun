import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => (
    <span data-testid={props["data-testid"] || "fa-icon"} {...props} />
  ),
}));

describe("App", () => {
  it("renders the top navigation bar", () => {
    render(<App />);
    expect(screen.getByText("MyG2")).toBeTruthy();
  });

  it("renders the home dashboard by default", () => {
    render(<App />);
    expect(screen.getByText("Welcome to MyG2")).toBeTruthy();
  });

  it("opens the icon rail when waffle icon is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByLabelText("Open navigation"));
    expect(
      screen.getByRole("navigation", { name: "Section navigation" })
    ).toBeTruthy();
  });

  it("closes the icon rail when backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByLabelText("Open navigation"));
    expect(
      screen.getByRole("navigation", { name: "Section navigation" })
    ).toBeTruthy();
    await user.click(screen.getByTestId("rail-backdrop"));
    expect(
      screen.queryByRole("navigation", { name: "Section navigation" })
    ).toBeNull();
  });

  it("navigates to a section view when a section card CTA is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("Manage Reviews"));
    expect(screen.getByText("Review Management")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Reviews" })).toBeTruthy();
  });

  it("navigates back to home from section view", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("Manage Reviews"));
    await user.click(screen.getByLabelText("Back to Home"));
    expect(screen.getByText("Welcome to MyG2")).toBeTruthy();
  });

  it("navigates to upgrade page when locked section CTA is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("Upgrade to Unlock"));
    expect(screen.getByText(/Requires Enterprise tier/)).toBeTruthy();
    expect(screen.getByText("Features you will unlock")).toBeTruthy();
  });

  it("navigates from upgrade page back to home", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("Upgrade to Unlock"));
    await user.click(screen.getByLabelText("Back to Home"));
    expect(screen.getByText("Welcome to MyG2")).toBeTruthy();
  });

  it("navigates to section via icon rail", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByLabelText("Open navigation"));
    await user.click(screen.getByLabelText("Profile"));
    expect(screen.getByText("Profile")).toBeTruthy();
    // Rail should close after selection
    expect(
      screen.queryByRole("navigation", { name: "Section navigation" })
    ).toBeNull();
  });

  it("resets active tab when navigating between sections via icon rail", async () => {
    const user = userEvent.setup();
    render(<App />);
    // Navigate to Review Management
    await user.click(screen.getByText("Manage Reviews"));
    // Switch to the Campaigns tab
    const campaignsTab = screen.getByRole("tab", { name: "Campaigns" });
    await user.click(campaignsTab);
    expect(campaignsTab.getAttribute("aria-selected")).toBe("true");
    // Now open the rail and navigate to a different section
    await user.click(screen.getByLabelText("Open navigation"));
    await user.click(screen.getByLabelText("Profile"));
    // Verify we are on Profile with the first tab active
    expect(screen.getByText("Profile")).toBeTruthy();
    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    expect(overviewTab.getAttribute("aria-selected")).toBe("true");
  });

  it("renders the tier switcher dropdown", () => {
    render(<App />);
    expect(screen.getByLabelText("Switch tier")).toBeTruthy();
  });
});
