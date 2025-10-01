import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminPage() {
  const [checkedIn, setCheckedIn] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        router.push("/admin-login");
      }
    }
    fetch("/api/today-attendance")
      .then((res) => res.json())
      .then((data) => setCheckedIn(data.checkedInToday));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Admin Dashboard</h1>
      <h2>Today's Attendance</h2>
      <ul>
        {checkedIn.map((name, i) => (
          <li key={i}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
