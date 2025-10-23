export default function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  // اینجا می‌تونی منطق واقعی mint روی بلاکچین بذاری
  // فعلا فقط QR می‌سازیم
  const qrData = `https://example.com/user/${userId}`;

  res.status(200).json({ qr: qrData });
}
