import React from "react";
import { render, screen } from "@testing-library/react";
import { HomeDashboard } from "./HomeDashboard";

describe("HomeDashboard", () => {
  it("renders a greeting with the user name", () => {
    render(<HomeDashboard />);
    expect(screen.getByRole("heading", { name: /Olivia/ })).toBeTruthy();
  });

  it("renders the tagline", () => {
    render(<HomeDashboard />);
    expect(screen.getByText(/What's on your mind\?/i)).toBeTruthy();
  });

  it("renders the prompt placeholder text", () => {
    render(<HomeDashboard />);
    expect(screen.getByText(/Ask about your reviews/i)).toBeTruthy();
  });

  it("renders all three shortcut cards", () => {
    render(<HomeDashboard />);
    expect(screen.getByText(/Get your first reviews/i)).toBeTruthy();
    expect(screen.getByText(/Complete your profile/i)).toBeTruthy();
    expect(screen.getByText(/See buyer intent data/i)).toBeTruthy();
  });

  it("renders shortcut card descriptions", () => {
    render(<HomeDashboard />);
    expect(screen.getByText(/Review Contest/i)).toBeTruthy();
    expect(screen.getByText(/logo/i)).toBeTruthy();
    expect(screen.getByText(/researching your category/i)).toBeTruthy();
  });
});
