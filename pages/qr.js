import { useEffect, useState } from "react";
import QRCode from "qrcode.react";

export default function QRPage() {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const checkInUrl = "https://attendance-app-ebon-ten.vercel.app/check-in";

  useEffect(() => {
    QRCode.toDataURL(checkInUrl)
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif", textAlign: "center", backgroundColor: "#f4f4f9" }}>
      <h1 style={{ color: "#4B3F72" }}>Scan this QR code:</h1>
      {qrDataUrl && <img src={qrDataUrl} alt="QR code" />}
    </div>
  );
}
