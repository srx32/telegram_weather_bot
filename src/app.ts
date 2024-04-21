import cors from "cors";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(cors());

// Logging middleware
app.use(morgan("combined"));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server up and running");
});

export default app;
