import { render, screen } from "@testing-library/react";
import DataImportExportPage from "../DataImportExportPage";

describe("DataImportExportPage", () => {
  it("renders import/export page", () => {
    render(<DataImportExportPage />);
    expect(screen.getByTestId("data-import-export")).toBeInTheDocument();
    expect(screen.getByText(/data import\/export/i)).toBeInTheDocument();
  });
});
