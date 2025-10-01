import { useEffect, useState } from "react";
import QRCode from "qrcode.react";

export default function QRPage() {
  const [nicknames, setNicknames] = useState([]);
  const [selectedNickname, setSelectedNickname] = useState("");
  const [message, setMessage] = useState("");

  // Replace this with your deployed check-in page URL
  const checkInUrl = "https://attendance-app-ebon-ten.vercel.app/qr"; 

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Fetch nicknames from API
  useEffect(() => {
    async function fetchNicknames() {
      try {
        const res = await fetch("/api/members");
        const data = await res.json();
        setNicknames(data.nicknames || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchNicknames();
  }, []);

  // Handle check-in
  const handleCheckIn = async () => {
    if (!selectedNickname) return setMessage("Please select a nickname");

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberNickname: selectedNickname,
          date: today,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message); // ✅ Attendance recorded!
      } else {
        setMessage(data.error); // Already checked in / Nickname not recognized
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Attendance QR Check-in</h1>

      {/* QR Code */}
      <div style={{ margin: "1rem 0" }}>
        <QRCode value={checkInUrl} size={256} />
        <p>Scan this QR code with your phone to open the check-in page</p>
      </div>

      <p>Date: {today}</p>

      <label htmlFor="nickname">Select your nickname:</label>
      <select
        id="nickname"
        value={selectedNickname}
        onChange={(e) => setSelectedNickname(e.target.value)}
      >
        <option value="">-- Choose your nickname --</option>
        {nicknames.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <button onClick={handleCheckIn} style={{ marginLeft: "1rem" }}>
        Check-in
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
