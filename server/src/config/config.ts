import { KeyObject } from "crypto";
import { DataSourceOptions } from "typeorm";
import { IsDevMode } from "../Globals";

const DEBUG = true;
const database = IsDevMode()
  ? (process.env.DEV_DB_NAME as string)
  : (process.env.DB_NAME as string);

export let config = {
  port: process.env.PORT || 8081,
  mode: process.env.DEBUG || DEBUG ? "debug" : "production",
  scrape: {
    race_control_url: "https://racecontrol.indycar.com/",
  },
  authentication: {
    key: {} as KeyObject,
  },
  dbOptions: {
    type: "sqlite",
    host: "localhost",

    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,

    database,

    synchronize: true,
    logging: false,
    subscribers: [],
    migrations: [],
  } as DataSourceOptions,
};
