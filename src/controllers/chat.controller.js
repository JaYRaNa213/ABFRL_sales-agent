export async function chatController(req, res) {
  const { message, sessionId, channel } = req.body;
  const sid = sessionId;

  const context = await getSession(sid, channel || "web");
  const response = await salesAgent(message, context);
  await updateSession(sid, context);

  res.json({ reply: response });
}
