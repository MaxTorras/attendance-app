import { useState, useEffect } from "react";

export default function CheckIn() {
  const [nickname, setNickname] = useState("");
  const [nicknames, setNicknames] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [checkedIn, setCheckedIn] = useState([]);
  const [status, setStatus] = useState("");
  const [creating, setCreating] = useState(false); // Are we creating a new nickname?

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function fetchData() {
      const membersRes = await fetch("/api/members");
      const membersData = await membersRes.json();
      setNicknames(membersData.nicknames);
      setFiltered(membersData.nicknames);

      const attendanceRes = await fetch("/api/today-attendance");
      const attendanceData = await attendanceRes.json();
      setCheckedIn(attendanceData.checkedInToday);
    }
    fetchData();
  }, []);

  useEffect(() => {
    setFiltered(
      nicknames.filter(
        (n) =>
          n.toLowerCase().includes(nickname.toLowerCase()) &&
          !checkedIn.includes(n)
      )
    );
  }, [nickname, nicknames, checkedIn]);

  const handleCreateNickname = async () => {
    if (!nickname) return setStatus("❌ Enter a nickname");

    if (nicknames.includes(nickname)) {
      setStatus("❌ This nickname already exists");
      return;
    }

    try {
      const res = await fetch("/api/create-nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberNickname: nickname }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Nickname created! You can now check in.");
        setNicknames((prev) => [...prev, nickname]);
        setCreating(false);
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  };

  const handleCheckIn = async () => {
    if (!nickname) return setStatus("❌ Enter your nickname");

    if (!nicknames.includes(nickname)) {
      setCreating(true); // Ask to create nickname
      return;
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberNickname: nickname, date: today }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Attendance recorded!");
        setCheckedIn((prev) => [...prev, nickname]);
        setNickname("");
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Rehearsal Check-in</h1>

      {creating ? (
        <>
          <p>Create your nickname (first time):</p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ padding: "0.5rem", marginRight: "1rem" }}
          />
          <button onClick={handleCreateNickname} style={{ padding: "0.5rem 1rem" }}>
            Create Nickname
          </button>
        </>
      ) : (
        <>
          <p>Select your nickname (already checked-in hidden):</p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ padding: "0.5rem", width: "250px" }}
          />

          {nickname && filtered.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                border: "1px solid #ccc",
                maxHeight: "150px",
                overflowY: "auto",
                width: "250px",
              }}
            >
              {filtered.map((n, i) => (
                <li
                  key={i}
                  onClick={() => setNickname(n)}
                  style={{
                    padding: "0.5rem",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {n}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleCheckIn}
            style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
          >
            Check In
          </button>
        </>
      )}

      <p>{status}</p>
    </div>
  );
}
