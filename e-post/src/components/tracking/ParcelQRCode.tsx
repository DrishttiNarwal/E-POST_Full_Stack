import { QRCodeCanvas } from "qrcode.react";

type ParcelQRCodeProps = {
  trackingId: string;
};

export function ParcelQRCode({ trackingId }: ParcelQRCodeProps) {
  return (
    <div className="border p-4 rounded-md inline-block">
      <QRCodeCanvas value={trackingId} size={150} />
    </div>
  );
}
