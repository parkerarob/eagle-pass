import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AuthPage from "./AuthPage";
import * as authService from "../services/auth";
import { describe, it, expect, vi } from "vitest";

// Mock signInWithGoogle to throw domain error
const DOMAIN_ERROR =
  "Your email domain is not allowed. Please use your school account.";

vi.mock("../services/auth", async () => {
  const actual = (await vi.importActual<unknown>("../services/auth")) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    signInWithGoogle: vi.fn(),
  };
});

describe("AuthPage", () => {
  it("shows error message when signInWithGoogle throws domain error", async () => {
    (
      authService.signInWithGoogle as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(() => {
      throw new Error(DOMAIN_ERROR);
    });
    render(<AuthPage />);
    const button = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(button);
    // Wait for error message to appear
    const errorMsg = await screen.findByText(DOMAIN_ERROR);
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveAttribute("data-cy", "auth-error-msg");
  });

  it("shows error message for disallowed domain", async () => {
    // ...rest of the test...
  });
});
