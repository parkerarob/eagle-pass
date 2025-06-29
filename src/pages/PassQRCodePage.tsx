import { QRCodeSVG } from "qrcode.react";

interface Props {
  passId: string;
}

export default function PassQRCodePage({ passId }: Props) {
  return (
    <div className="space-y-4 p-4" data-testid="qr-page">
      <h1 className="text-2xl font-bold">Pass QR Code</h1>
      <QRCodeSVG value={passId} />
    </div>
  );
}
