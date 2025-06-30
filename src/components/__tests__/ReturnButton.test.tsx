import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ReturnButton } from "../ReturnButton";

describe("ReturnButton", () => {
  it("calls onReturn when clicked", () => {
    const cb = vi.fn();
    render(<ReturnButton onReturn={cb} />);
    fireEvent.click(screen.getByRole("button", { name: /return to origin/i }));
    expect(cb).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    const cb = vi.fn();
    render(<ReturnButton onReturn={cb} disabled />);
    const button = screen.getByRole("button", { name: /return to origin/i });
    expect(button).toBeDisabled();
  });
});
