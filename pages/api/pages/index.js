import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const CONTRACT_ABI = [
  "function mint(string tokenURI) payable",
  "function priceWei() view returns (uint256)"
];

export default function Home() {
  const [status, setStatus] = useState("");
  const [addr, setAddr] = useState("");
  const [tx, setTx] = useState("");

  async function connect() {
    if (!window.ethereum) return alert("Install MetaMask or Coinbase Wallet");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const a = await signer.getAddress();
    setAddr(a);
  }

  async function mintNFT() {
    if (!addr) return alert("Connect wallet first");

    setStatus("Generating metadata...");
    const res = await fetch("/api/generate-metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: addr })
    });
    const { tokenURI } = await res.json();

    setStatus("Minting... please confirm transaction");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // حدود ۳ سنت به Base تبدیل کن (تقریباً 0.00002 ETH)
    const value = ethers.parseEther("0.00002");

    try {
      const tx = await contract.mint(tokenURI, { value });
      setTx(tx.hash);
      setStatus("Transaction sent: " + tx.hash);
      await tx.wait();
      setStatus("✅ Mint complete!");
    } catch (e) {
      console.error(e);
      setStatus("❌ Error: " + e.message);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Farcaster QR NFT</h2>
      {!addr ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <p>Connected: {addr}</p>
      )}
      <button onClick={mintNFT} disabled={!addr}>
        Mint My QR
      </button>
      <p>{status}</p>
      {tx && (
        <p>
          <a href={`https://base.blockscout.com/tx/${tx}`} target="_blank" rel="noreferrer">
            View on Blockscout
          </a>
        </p>
      )}
    </div>
  );
}
