require("dotenv").config();

import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "./config/config";
import { Routes } from "./routes";
import { AppDataSource, GetGameState } from "./DataSource";
import { V4 } from "paseto";
import Discord from "./Discord";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/state", (req, res) => {
  res.json(GetGameState());
});

Routes(app);

async function Start() {
  // Setup today's Key
  config.authentication.key = await V4.generateKey("public");
  await AppDataSource.initialize();

  // Setup discord stuff
  await Discord.Initalize();

  app.listen(config.port);

  console.log(`Server started on port ${config.port}`);
}

Start();
