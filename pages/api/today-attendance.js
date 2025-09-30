import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const today = new Date().toISOString().slice(0, 10);

    const attendanceRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:B", // only date and nickname
    });

    const attendance = attendanceRes.data.values || [];

    // Filter nicknames that already checked in today
    const checkedInToday = attendance
      .filter((row) => row[0] === today)
      .map((row) => row[1]);

    res.status(200).json({ checkedInToday });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
