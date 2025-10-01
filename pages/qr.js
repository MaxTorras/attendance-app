import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRPage() {
  const [qrDataUrl, setQrDataUrl] = useState("");

  const checkInUrl = "https://attendance-app-ebon-ten.vercel.app/check-in";

  useEffect(() => {
    QRCode.toDataURL(checkInUrl)
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Scan this QR code:</h1>
      {qrDataUrl && <img src={qrDataUrl} alt="QR code" />}
    </div>
  );
}
