import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../components/LocationManager", () => ({
  LocationManager: () => <div data-testid="location-manager" />,
}));

import LocationManagementPage from "../LocationManagementPage";

describe("LocationManagementPage", () => {
  it("renders location manager", () => {
    render(<LocationManagementPage />);
    expect(
      screen.getByRole("heading", { name: /location management/i }),
    ).toBeInTheDocument();
  });
});
