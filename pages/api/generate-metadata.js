import QRCode from "qrcode";
import { NFTStorage, File } from "nft.storage";

const NFT_KEY = process.env.NFT_STORAGE_KEY;
const client = NFT_KEY ? new NFTStorage({ token: NFT_KEY }) : null;

export default async function handler(req, res) {
  try {
    const { address, fid } = req.body;
    if (!address && !fid) return res.status(400).json({ error: "address or fid required" });

    const qrData = fid ? `farcaster://fid:${fid}` : `https://warpcast.com/u/${address}`;
    const pngBuffer = await QRCode.toBuffer(qrData, { width: 600 });

    if (!client) {
      const dataUrl = `data:image/png;base64,${pngBuffer.toString("base64")}`;
      const metadata = {
        name: `Farcaster QR - ${address || fid}`,
        description: `QR code for ${address || fid}`,
        image: dataUrl,
        properties: { address, fid }
      };
      return res.json({ tokenURI: `data:application/json;utf8,${JSON.stringify(metadata)}` });
    }

    const imageFile = new File([pngBuffer], `qr_${address || fid}.png`, { type: "image/png" });
    const metadata = await client.store({
      name: `Farcaster QR - ${address || fid}`,
      description: `QR code for ${address || fid}`,
      image: imageFile,
      properties: { address, fid }
    });

    return res.json({ tokenURI: metadata.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}
