import * as http from "http";

import dotenv from "dotenv";

import app from "./app";
import bot from "./bot";

bot.launch();

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`[server] - Listening on port ${PORT}...`);
});
