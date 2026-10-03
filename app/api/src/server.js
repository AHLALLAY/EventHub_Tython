import app from "./app.js";
import "dotenv/config";

const port = process.env.PORT;

const run = () => {
  try {
    app.listen(port, () => {
      console.log(`server running on : http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

run();
