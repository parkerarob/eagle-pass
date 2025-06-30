import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../services/reports", () => ({
  getFrequentFlyers: () => Promise.resolve([]),
  getPeriodHeatmap: () => Promise.resolve({}),
}));

import ReportingDashboardPage from "../ReportingDashboardPage";

describe("ReportingDashboardPage", () => {
  it("shows reporting dashboard", () => {
    render(<ReportingDashboardPage />);
    expect(screen.getByText(/reporting dashboard/i)).toBeInTheDocument();
  });
});
