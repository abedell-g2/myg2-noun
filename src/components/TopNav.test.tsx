import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopNav } from "./TopNav";
import { TierProvider } from "../context/TierContext";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => (
    <span data-testid={props["data-testid"] || "fa-icon"} {...props} />
  ),
}));

function renderTopNav(props: Partial<React.ComponentProps<typeof TopNav>> = {}) {
  const defaultProps = {
    onAppSpaceClick: jest.fn(),
    onHomeClick: jest.fn(),
    isRailOpen: false,
  };
  return render(
    <TierProvider>
      <TopNav {...defaultProps} {...props} />
    </TierProvider>
  );
}

describe("TopNav", () => {
  it("renders the G2 brand text", () => {
    renderTopNav();
    expect(screen.getByText("MyG2")).toBeTruthy();
  });

  it("renders the app-space (waffle) icon button", () => {
    renderTopNav();
    expect(screen.getByLabelText("Open navigation")).toBeTruthy();
  });

  it("calls onAppSpaceClick when waffle icon is clicked", async () => {
    const user = userEvent.setup();
    const onAppSpaceClick = jest.fn();
    renderTopNav({ onAppSpaceClick });
    await user.click(screen.getByLabelText("Open navigation"));
    expect(onAppSpaceClick).toHaveBeenCalledTimes(1);
  });

  it("calls onHomeClick when brand text is clicked", async () => {
    const user = userEvent.setup();
    const onHomeClick = jest.fn();
    renderTopNav({ onHomeClick });
    await user.click(screen.getByText("MyG2"));
    expect(onHomeClick).toHaveBeenCalledTimes(1);
  });

  it("renders a tier switcher for demo purposes", () => {
    renderTopNav();
    expect(screen.getByLabelText("Switch tier")).toBeTruthy();
  });
});
