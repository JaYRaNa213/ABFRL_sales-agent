import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import chatRoute from "./routes/chat.route.js";
import internalRoute from "./routes/internal.route.js";
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/chat", chatRoute);

/**
 * n8n → Backend internal APIs
 */
app.use("/api/internal", internalRoute);


export default app;
