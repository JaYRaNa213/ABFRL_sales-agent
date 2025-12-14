export const notifyPOS = async (req, res) => {
  const { orderId, store, priority } = req.body;

  console.log("🏬 POS NOTIFICATION");
  console.log({ orderId, store, priority });

  res.json({
    success: true,
    message: "Store notified"
  });
};

export const updateLoyalty = async (req, res) => {
  const { userId, orderId, points } = req.body;

  console.log("🎁 LOYALTY UPDATED");
  console.log({ userId, orderId, points });

  res.json({
    success: true,
    message: "Loyalty points updated"
  });
};
