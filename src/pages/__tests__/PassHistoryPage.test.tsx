import { render, screen } from "@testing-library/react";
import PassHistoryPage from "../PassHistoryPage";

describe("PassHistoryPage", () => {
  it("renders history heading", () => {
    render(<PassHistoryPage />);
    expect(screen.getByTestId("pass-history")).toBeInTheDocument();
    expect(screen.getByText(/pass history/i)).toBeInTheDocument();
  });
});
