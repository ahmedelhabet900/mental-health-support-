import express from "express";
import { bootstrap } from "./src/app.controller.js";

import dotenv from "dotenv";

dotenv.config();
const app = express();

await bootstrap(express, app);
app.listen(process.env.PORT, () => console.log("Server is running"));
