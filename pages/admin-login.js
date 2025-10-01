import { useState } from "react";
import { useRouter } from "next/router";

const ADMIN_NICKNAMES = ["Carlos", "Jamie"]; // change to your admins
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function AdminLogin() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!ADMIN_NICKNAMES.includes(nickname)) {
      setStatus("❌ Not an admin");
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      setStatus("❌ Wrong password");
      return;
    }

    // Store login in sessionStorage (simple)
    sessionStorage.setItem("adminLoggedIn", "true");
    router.push("/admin");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Admin Login</h1>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{ padding: "0.5rem", display: "block", marginBottom: "1rem" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "0.5rem", display: "block", marginBottom: "1rem" }}
      />
      <button onClick={handleLogin} style={{ padding: "0.5rem 1rem" }}>
        Login
      </button>
      <p>{status}</p>
    </div>
  );
}
