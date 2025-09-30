import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { memberNickname } = req.body;
  if (!memberNickname) return res.status(400).json({ error: "Nickname required" });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Get existing nicknames
    const membersRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Members!A:A",
    });

    const members = membersRes.data.values ? membersRes.data.values.flat() : [];

    if (members.includes(memberNickname)) {
      return res.status(400).json({ error: "Nickname already exists" });
    }

    // Append new nickname
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Members!A:A",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[memberNickname]],
      },
    });

    res.status(200).json({ message: "✅ Nickname created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
