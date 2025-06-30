import { render, screen } from "@testing-library/react";
import AdminDashboardPage from "../AdminDashboardPage";

describe("AdminDashboardPage", () => {
  it("renders admin dashboard", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument();
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });
});
