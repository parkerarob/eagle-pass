import { render, screen } from "@testing-library/react";
import SystemSettingsPage from "../SystemSettingsPage";

describe("SystemSettingsPage", () => {
  it("renders settings page", () => {
    render(<SystemSettingsPage />);
    expect(screen.getByTestId("system-settings")).toBeInTheDocument();
    expect(screen.getByText(/system settings/i)).toBeInTheDocument();
  });
});
