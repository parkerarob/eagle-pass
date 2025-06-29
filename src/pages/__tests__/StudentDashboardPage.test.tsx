import { render, screen } from "@testing-library/react";
import StudentDashboardPage from "../StudentDashboardPage";

describe("StudentDashboardPage", () => {
  it("renders dashboard heading", () => {
    render(<StudentDashboardPage />);
    expect(screen.getByTestId("student-dashboard")).toBeInTheDocument();
    expect(screen.getByText(/student dashboard/i)).toBeInTheDocument();
  });
});
