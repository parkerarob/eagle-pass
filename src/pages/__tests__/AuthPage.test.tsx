import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthPage from "../AuthPage";

vi.mock("../../services/auth", () => ({ signInWithGoogle: vi.fn() }));
import { signInWithGoogle } from "../../services/auth";

describe("AuthPage", () => {
  it("calls signInWithGoogle on button click", () => {
    render(<AuthPage />);
    fireEvent.click(
      screen.getByRole("button", { name: /sign in with google/i }),
    );
    expect(signInWithGoogle).toHaveBeenCalled();
  });
});
