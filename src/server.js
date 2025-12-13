import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import chatRoute from "./routes/chat.route.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/chat", chatRoute);

export default app;
