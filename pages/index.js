// pages/index.js
export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Attendance App 🎉</h1>
      <p><a href="/qr">Go to QR Code</a></p>
      <p><a href="/check-in">Go to Check-In</a></p>
    </div>
  );
}
