import { test, expect } from "@playwright/test";

test.describe("MyG2 Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("home dashboard renders all section cards", async ({ page }) => {
    await expect(page.getByText("Welcome to MyG2")).toBeVisible();

    // Verify all 13 section cards are present
    const sectionCards = page.locator("[data-testid^='section-card-']");
    await expect(sectionCards).toHaveCount(13);

    // Spot-check a few section card headings
    await expect(page.getByTestId("section-card-home")).toBeVisible();
    await expect(page.getByTestId("section-card-profile")).toBeVisible();
    await expect(page.getByTestId("section-card-review-management")).toBeVisible();
    await expect(page.getByTestId("section-card-market-intelligence")).toBeVisible();
    await expect(page.getByTestId("section-card-account")).toBeVisible();
  });

  test("icon rail opens via waffle icon and closes via Escape key", async ({
    page,
  }) => {
    const railNav = page.getByRole("navigation", {
      name: "Section navigation",
    });

    // Rail is hidden by default
    await expect(railNav).not.toBeVisible();

    // Click the waffle icon to open
    await page.getByLabel("Open navigation").click();
    await expect(railNav).toBeVisible();

    // Close the rail with Escape key
    await page.keyboard.press("Escape");
    await expect(railNav).not.toBeVisible();
  });

  test("icon rail closes when waffle icon is toggled again", async ({
    page,
  }) => {
    const railNav = page.getByRole("navigation", {
      name: "Section navigation",
    });

    // Open the rail
    await page.getByLabel("Open navigation").click();
    await expect(railNav).toBeVisible();

    // Toggle the waffle icon to close
    await page.getByLabel("Open navigation").click();
    await expect(railNav).not.toBeVisible();
  });

  test("clicking an accessible section card navigates to section view with tabs", async ({
    page,
  }) => {
    // Click the Review Management CTA
    await page.getByText("Manage Reviews").click();

    // Should show section title and tabs
    await expect(
      page.getByRole("heading", { name: "Review Management" })
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: "Reviews" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Campaigns" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Responses" })).toBeVisible();

    // First tab should be active
    await expect(page.getByRole("tab", { name: "Reviews" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // Tabpanel should be present
    await expect(page.getByRole("tabpanel")).toBeVisible();
  });

  test("clicking a locked section card shows upgrade page", async ({
    page,
  }) => {
    // Default tier is Starter; Market Intelligence is locked
    await page.getByText("Upgrade to Unlock").click();

    // Should show the upgrade page
    await expect(page.getByText(/Requires Enterprise tier/)).toBeVisible();
    await expect(page.getByText("Features you will unlock")).toBeVisible();
    await expect(
      page.getByText("Contact Sales to Upgrade")
    ).toBeVisible();
  });

  test("back navigation from section view returns to home", async ({
    page,
  }) => {
    // Navigate to a section
    await page.getByText("Manage Reviews").click();
    await expect(
      page.getByRole("heading", { name: "Review Management" })
    ).toBeVisible();

    // Click back
    await page.getByLabel("Back to Home").click();
    await expect(page.getByText("Welcome to MyG2")).toBeVisible();
  });

  test("back navigation from upgrade page returns to home", async ({
    page,
  }) => {
    await page.getByText("Upgrade to Unlock").click();
    await expect(page.getByText(/Requires Enterprise tier/)).toBeVisible();

    await page.getByLabel("Back to Home").click();
    await expect(page.getByText("Welcome to MyG2")).toBeVisible();
  });

  test("tier switcher changes which sections are accessible and locked", async ({
    page,
  }) => {
    // Default tier is Starter -- Market Intelligence should be locked
    const upgradeButtons = page.getByRole("button", {
      name: "Upgrade to Unlock",
    });
    // Starter has exactly 1 locked section (Market Intelligence)
    await expect(upgradeButtons).toHaveCount(1);

    // Switch to Basic tier
    await page.getByLabel("Switch tier").selectOption("basic");

    // Basic has only 3 accessible sections (Home, Profile, Account)
    // So there should be 10 locked sections
    const upgradeButtonsBasic = page.getByRole("button", {
      name: "Upgrade to Unlock",
    });
    await expect(upgradeButtonsBasic).toHaveCount(10);

    // Switch to Enterprise tier
    await page.getByLabel("Switch tier").selectOption("enterprise");

    // Enterprise has all sections unlocked -- no upgrade buttons
    const upgradeButtonsEnterprise = page.getByRole("button", {
      name: "Upgrade to Unlock",
    });
    await expect(upgradeButtonsEnterprise).toHaveCount(0);
  });

  test("navigating to a section via the icon rail", async ({ page }) => {
    // Open the rail
    await page.getByLabel("Open navigation").click();
    const rail = page.getByRole("navigation", {
      name: "Section navigation",
    });
    await expect(rail).toBeVisible();

    // Click Profile in the rail
    await rail.getByLabel("Profile").click();

    // Rail should close after selection
    await expect(rail).not.toBeVisible();

    // Should show the Profile section view
    await expect(
      page.getByRole("heading", { name: "Profile" })
    ).toBeVisible();
  });

  test("icon rail shows locked sections with upgrade tooltip for starter", async ({
    page,
  }) => {
    await page.getByLabel("Open navigation").click();
    const rail = page.getByRole("navigation", {
      name: "Section navigation",
    });

    // Market Intelligence should show as locked
    const lockedButton = rail.getByLabel(
      "Market Intelligence (Upgrade to unlock)"
    );
    await expect(lockedButton).toBeVisible();
  });

  test("clicking a locked section in the rail navigates to upgrade page", async ({
    page,
  }) => {
    await page.getByLabel("Open navigation").click();
    const rail = page.getByRole("navigation", {
      name: "Section navigation",
    });

    // Click the locked Market Intelligence section
    await rail
      .getByLabel("Market Intelligence (Upgrade to unlock)")
      .click();

    // Should show the upgrade page for Market Intelligence
    await expect(page.getByText("Market Intelligence")).toBeVisible();
    await expect(page.getByText(/Requires Enterprise tier/)).toBeVisible();
  });

  test("single sub-feature section renders without tab bar", async ({
    page,
  }) => {
    // AI Custom Research has only 1 sub-feature
    await page.getByText("Start Research").click();

    await expect(
      page.getByRole("heading", { name: "AI Custom Research" })
    ).toBeVisible();

    // Tab bar should NOT be present
    await expect(page.getByRole("tablist")).toHaveCount(0);

    // Tabpanel role should NOT be present (no tablist means no tabpanel semantics)
    await expect(page.getByRole("tabpanel")).toHaveCount(0);

    // Content should still be visible
    await expect(page.getByText(/Research content/i)).toBeVisible();
  });
});
