import { render, screen, fireEvent } from "@testing-library/react";
import UserSettings from "../UserSettings";

describe("UserSettings", () => {
  it("renders form and calls onSave", () => {
    const onSave = vi.fn();
    render(
      <UserSettings
        initialName="Bob"
        initialEmail="bob@school.edu"
        onSave={onSave}
      />,
    );
    const nameInput = screen.getByDisplayValue("Bob");
    fireEvent.change(nameInput, { target: { value: "Bobby" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSave).toHaveBeenCalledWith({ name: "Bobby" });
  });

  it("shows validation error for empty name", () => {
    const onSave = vi.fn();
    render(
      <UserSettings
        initialName="Bob"
        initialEmail="bob@school.edu"
        onSave={onSave}
      />,
    );
    const nameInput = screen.getByDisplayValue("Bob");
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByText("Name cannot be empty")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
