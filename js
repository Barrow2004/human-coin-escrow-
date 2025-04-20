let depositor = 100%
let escrow = 10%;
let receiver = 90%;

function updateDisplay() {
  document.getElementById("depositorBalance").textContent = depositor;
  document.getElementById("escrowBalance").textContent = escrow;
  document.getElementById("receiverBalance").textContent = receiver;
}

function handlePaymentMethodChange() {
  const method = document.getElementById("paymentMethod").value;
  document.getElementById("mpesaInput").classList.add("hidden");
  document.getElementById("binanceInput").classList.add("hidden");

  if (method === "mpesa") {
    document.getElementById("mpesaInput").classList.remove("hidden");
  } else if (method === "binance") {
    document.getElementById("binanceInput").classList.remove("hidden");
  }
}

function deposit() {
  const method = document.getElementById("paymentMethod").value;
  const amount = parseInt(document.getElementById("amount").value);
  let isValid = false;

  if (method === "mpesa") {
    const mpesa = document.getElementById("mpesaNumber").value;
    if (!mpesa || mpesa.length < 8) {
      setStatus("Please enter a valid M-Pesa number.");
      return;
    }
    isValid = true;
  } else if (method === "binance") {
    const uid = document.getElementById("binanceUID").value;
    if (!uid || uid.length < 5) {
      setStatus("Please enter a valid Binance UID.");
      return;
    }
    isValid = true;
  } else {
    setStatus("Please select a payment method.");
    return;
  }

  if (amount < 100) {
    setStatus("Minimum deposit amount is 100 HUC.");
    return;
  }

  if (amount > depositor) {
    setStatus("Insufficient balance for deposit.");
    return;
  }

  const confirmPayment = confirm(
    `Please send exactly ${amount} HUC to the following address:\n\nhwt1e3anyng3k5sucu2pyrhn37qnu4640a9glkdtns\n\nClick OK once you've made the payment.`
  );

  if (!confirmPayment) {
    setStatus("Deposit cancelled. Awaiting payment.");
    return;
  }

  depositor -= amount;
  escrow += amount;
  setStatus(`Deposited ${amount} HUC using ${method.toUpperCase()} into escrow. Please upload your payment screenshot.`);
  document.getElementById("screenshotSection").classList.remove("hidden");
  updateDisplay();
}

function release() {
  receiver += escrow;
  setStatus(`Released ${escrow} HUC to receiver.`);
  escrow = 0;
  updateDisplay();
}

function refund() {
  depositor += escrow;
  setStatus(`Refunded ${escrow} HUC to depositor.`);
  escrow = 0;
  updateDisplay();
}

function setStatus(message) {
  document.getElementById("status").textContent = message;
}

function copyAddress() {
  const addressText = document.getElementById("depositAddress").textContent;
  navigator.clipboard.writeText(addressText).then(() => {
    setStatus("Address copied to clipboard!");
  }).catch(() => {
    setStatus("Failed to copy address.");
  });
}

function previewScreenshot() {
  const input = document.getElementById("screenshotInput");
  const preview = document.getElementById("previewImage");
  const section = document.getElementById("screenshotPreview");

  const file = input.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      section.classList.remove("hidden");
      setStatus("Screenshot uploaded for verification.");
    };
    reader.readAsDataURL(file);
  } else {
    setStatus("Please upload a valid image file.");
    section.classList.add("hidden");
  }
}

updateDisplay();
