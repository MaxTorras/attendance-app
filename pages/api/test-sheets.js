import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    // Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Append a test row
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["2025-09-30", "TEST_USER", new Date().toISOString()]],
      },
    });

    res.status(200).json({ message: "✅ Test row added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
