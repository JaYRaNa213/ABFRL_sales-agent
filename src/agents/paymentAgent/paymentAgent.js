export async function paymentAgent(context) {
  if (!context.cart.length) {
    return { status: "failed", reason: "Cart empty" };
  }

  return {
    status: "success",
    transactionId: `TXN-${Date.now()}`
  };
}
