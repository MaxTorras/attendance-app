import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // --- Authenticate with Google Sheets ---
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // --- Fetch members from Members sheet ---
    const membersRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Members!A:A", // Assuming nicknames are in column A
    });

    const nicknames = membersRes.data.values ? membersRes.data.values.flat() : [];

    res.status(200).json({ nicknames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
