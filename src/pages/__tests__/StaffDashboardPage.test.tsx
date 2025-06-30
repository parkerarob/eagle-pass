import { render, screen } from "@testing-library/react";
import StaffDashboardPage from "../StaffDashboardPage";

describe("StaffDashboardPage", () => {
  it("shows staff dashboard", () => {
    render(<StaffDashboardPage />);
    expect(screen.getByTestId("staff-dashboard")).toBeInTheDocument();
    expect(screen.getByText(/staff dashboard/i)).toBeInTheDocument();
  });
});
