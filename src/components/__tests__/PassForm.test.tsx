import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PassForm } from "../PassForm";

describe("PassForm", () => {
  it("submits form data", async () => {
    const mockSubmit = vi.fn();
    render(<PassForm onSubmit={mockSubmit} />);
    await userEvent.type(screen.getByPlaceholderText("Student ID"), "student1");
    await userEvent.type(screen.getByPlaceholderText("Origin Location"), "101");
    await userEvent.type(screen.getByPlaceholderText("Destination"), "library");
    const groupSizeInput = screen.getByLabelText("Group Size");
    await userEvent.clear(groupSizeInput);
    await userEvent.type(groupSizeInput, "2");
    await userEvent.selectOptions(screen.getByLabelText("Type"), "regular");
    await userEvent.click(screen.getByRole("button", { name: /create pass/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      studentId: "student1",
      originLocationId: "101",
      destinationId: "library",
      groupSize: 2,
      type: "regular",
    });
  });
});
