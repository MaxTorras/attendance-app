import { QRCodeCanvas } from "qrcode.react";

export default function QRPage() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/check-in`;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Rehearsal QR Code</h1>
      <p>Scan this QR code to check in for today:</p>
      <QRCodeCanvas value={url} size={256} />
      <p style={{ marginTop: "1rem" }}>{url}</p>
    </div>
  );
}
