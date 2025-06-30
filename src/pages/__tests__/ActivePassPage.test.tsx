import { render, screen } from "@testing-library/react";
import ActivePassPage from "../ActivePassPage";

describe("ActivePassPage", () => {
  it("shows active pass heading", () => {
    render(<ActivePassPage />);
    expect(screen.getByTestId("active-pass")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /active pass/i }),
    ).toBeInTheDocument();
  });
});
