const mintBtn = document.getElementById('mintBtn');
const userIdInput = document.getElementById('userId');
const qrDiv = document.getElementById('qrCode');

mintBtn.addEventListener('click', async () => {
  const userId = userIdInput.value.trim();
  if (!userId) {
    alert("Enter your ID first!");
    return;
  }

  try {
    // درخواست به سرورلس فانکشن
    const res = await fetch(`/api/mint?userId=${userId}`);
    const data = await res.json();

    if (data.qr) {
      qrDiv.innerHTML = "";
      QRCode.toCanvas(qrDiv, data.qr, { width: 200 }, function (error) {
        if (error) console.error(error);
      });
    }
  } catch (err) {
    console.error(err);
  }
});
