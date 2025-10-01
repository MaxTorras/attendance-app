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

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Members!A:A", // column with nicknames
    });

    const nicknames = response.data.values ? response.data.values.flat() : [];

    res.status(200).json({ nicknames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export default function handler(req, res) {
  // For now, return hardcoded nicknames to test
  const nicknames = ["Carlos", "Jamie", "Leo", "Omar"];

  res.status(200).json({ nicknames });
}