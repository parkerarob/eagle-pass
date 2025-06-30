import { render, screen } from "@testing-library/react";
import PassCreationPage from "../PassCreationPage";

describe("PassCreationPage", () => {
  it("renders create pass form", () => {
    render(<PassCreationPage />);
    expect(screen.getByTestId("pass-create")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /create pass/i }),
    ).toBeInTheDocument();
  });
});
