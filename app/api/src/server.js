import express from "express";
import cors from "cors";

import "dotenv/config";

const port = process.env.PORT;
const crs = process.env.CORS_ORIGIN;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: crs,
  }),
);

const run = () => {
  try {
    app.listen(port, () => {
      console.log(`server runing on : http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

run();
