import { render, screen } from "@testing-library/react";
import UserManagementPage from "../UserManagementPage";

describe("UserManagementPage", () => {
  it("renders user management", () => {
    render(<UserManagementPage />);
    expect(screen.getByTestId("user-management")).toBeInTheDocument();
    expect(screen.getByText(/user management/i)).toBeInTheDocument();
  });
});
