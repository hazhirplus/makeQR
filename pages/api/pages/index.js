<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Farcaster QR Claim</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      text-align: center;
      padding: 40px;
      background: #f5f7fa;
    }
    h1 {
      color: #333;
    }
    #qr {
      margin-top: 30px;
    }
    .input {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      width: 220px;
      margin-bottom: 10px;
    }
    button {
      background-color: #4a61ff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
    }
    button:hover {
      background-color: #384bd6;
    }
  </style>
</head>
<body>
  <h1>🎟️ Farcaster QR Generator</h1>
  <p>Enter your Farcaster username:</p>
  <input id="username" class="input" placeholder="e.g. shahin" />
  <br>
  <button onclick="generateQR()">Generate QR</button>

  <div id="qr"></div>

  <script>
    function generateQR() {
      const username = document.getElementById('username').value.trim();
      if (!username) return alert('Please enter your username');
      const claimURL = `https://vercel.com/shahinhizhas-projects/make-qr=${username}`;
      const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(claimURL)}&size=250x250`;
      document.getElementById('qr').innerHTML = `
        <h3>Your QR Code:</h3>
        <img src="${qrAPI}" alt="QR Code for ${username}" />
        <p><a href="${claimURL}" target="_blank">${claimURL}</a></p>
      `;
    }
  </script>
</body>
</html>
