export async function sendOperatorNotification(subject: string, body: string): Promise<void> {
  if (process.env.NOTIFICATION_EMAIL_ENABLED !== "1") return;
  const to = process.env.NOTIFICATION_EMAIL_TO ?? "carmenaburoda@gmail.com";
  const helper = "/home/ubuntu/scripts/cca-uptime-sendmail.py";
  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    await promisify(execFile)("python3", [helper, subject, body], { env: { ...process.env, CCA_UPTIME_EMAIL: to } });
  } catch {
    // non-fatal
  }
}
