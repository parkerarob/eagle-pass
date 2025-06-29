import { render, screen } from "@testing-library/react";
import PassQRCodePage from "../PassQRCodePage";

describe("PassQRCodePage", () => {
  it("renders QR code for pass id", () => {
    render(<PassQRCodePage passId="pass123" />);
    expect(screen.getByTestId("qr-page")).toBeInTheDocument();
    expect(screen.getByText(/pass qr code/i)).toBeInTheDocument();
  });
});
