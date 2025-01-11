import express from "express";
import cors from "cors";  // Import the cors package
import { router } from "./routes/v1";

// import client from "@repo/db/client";

const app = express();

// Allow CORS for all origins
app.use(cors());

app.use(express.json());

app.use("/api/v1", router);

app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running on port 3000")
);
