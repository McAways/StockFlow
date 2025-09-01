import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const folderId = req.query.folderId as string || process.env.GOOGLE_DRIVE_FOLDER_ID;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: "files(id, name, mimeType, webViewLink, webContentLink)",
    });

    res.status(200).json(response.data.files || []);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}