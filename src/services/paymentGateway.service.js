export function processPayment(amount) {
  if (amount <= 0) {
    return { status: "failed" };
  }

  return {
    status: "success",
    transactionId: `TXN-${Date.now()}`
  };
}
