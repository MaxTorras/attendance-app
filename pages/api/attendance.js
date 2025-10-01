import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Debug route to check env vars
    return res.status(200).json({
      sheetId: process.env.GOOGLE_SHEET_ID || "MISSING",
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "MISSING",
      hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
    });
  }

  if (req.method === "POST") {
    const { memberNickname, date } = req.body;

    if (!memberNickname || !date) {
      return res.status(400).json({ error: "Missing memberNickname or date" });
    }

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      // --- Step 1: Verify nickname exists ---
      const membersRes = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Members!A:A",
      });

      const members = membersRes.data.values ? membersRes.data.values.flat() : [];

      if (!members.includes(memberNickname)) {
        return res.status(400).json({ error: "Nickname not recognized" });
      }

      // --- Step 2: Check if already checked in ---
      const attendanceRes = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A:C",
      });

      const attendance = attendanceRes.data.values || [];

      const alreadyCheckedIn = attendance.some(
        (row) => row[0] === date && row[1] === memberNickname
      );

      if (alreadyCheckedIn) {
        return res.status(400).json({ error: "Already checked in today" });
      }

      // --- Step 3: Append attendance row ---
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: "Sheet1!A:C",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[date, memberNickname, new Date().toISOString()]],
        },
      });

      return res.status(200).json({ message: "✅ Attendance recorded!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
