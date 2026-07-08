import { integrationEnabled } from "./index";

export async function getWorkDriveFolderLink(examId: string): Promise<string | null> {
  if (!integrationEnabled("WORKDRIVE_ENABLED")) return null;
  const folderId = process.env.WORKDRIVE_TRANSCRIPT_FOLDER_ID;
  if (!folderId) return null;
  return `https://workdrive.zoho.com/folder/${folderId}?exam=${encodeURIComponent(examId)}`;
}
