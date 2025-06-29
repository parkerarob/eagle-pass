import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PassForm } from "../PassForm";

describe("PassForm", () => {
  it("submits form data", () => {
    const mockSubmit = vi.fn();
    render(<PassForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("Student ID"), {
      target: { value: "student1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Origin Location"), {
      target: { value: "101" },
    });
    fireEvent.change(screen.getByPlaceholderText("Destination"), {
      target: { value: "library" },
    });
    fireEvent.change(screen.getByLabelText("Group Size"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByDisplayValue("Restroom"), {
      target: { value: "regular" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create pass/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      studentId: "student1",
      originLocationId: "101",
      destinationId: "library",
      groupSize: 2,
      type: "regular",
    });
  });
});
