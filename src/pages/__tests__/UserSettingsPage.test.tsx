import { render, screen, fireEvent } from "@testing-library/react";
import UserSettingsPage from "../UserSettingsPage";

describe("UserSettingsPage", () => {
  it("renders UserSettings and handles save", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<UserSettingsPage />);
    const nameInput = screen.getByDisplayValue("Test User");
    fireEvent.change(nameInput, { target: { value: "Updated User" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(logSpy).toHaveBeenCalledWith("Saved user data:", {
      name: "Updated User",
    });
    logSpy.mockRestore();
  });
});
