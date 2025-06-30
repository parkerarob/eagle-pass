import { render, screen } from "@testing-library/react";
import StudentLookupPage from "../StudentLookupPage";

describe("StudentLookupPage", () => {
  it("renders lookup tools", () => {
    render(<StudentLookupPage />);
    expect(screen.getByTestId("student-lookup")).toBeInTheDocument();
    expect(screen.getByText(/student lookup/i)).toBeInTheDocument();
  });
});
