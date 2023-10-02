import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "./config/config";
import { MCar } from "./models/MCar";
import { MDraft } from "./models/MDraft";
import { MDriver } from "./models/MDriver";
import { MEntry } from "./models/MEntry";
import { MRace } from "./models/MRace";
import { MUser } from "./models/MUser";
import { GamePhase, GameState } from "@ill/common";
import * as fs from "fs";
import Discord from "./Discord";
import { clone, IsDevMode } from "./Globals";
import { MDraftOrder } from "./models/MDraftOrder";

const STATE_FILE = IsDevMode()
  ? process.env.DEV_STATE_JSON
  : process.env.STATE_JSON;

const options: DataSourceOptions = {
  ...config.dbOptions,
  entities: [MUser, MDriver, MRace, MDraft, MCar, MEntry, MDraftOrder],
};
export const AppDataSource = new DataSource(options);

let gameState: GameState | undefined;

export function SetGameState(data: GameState) {
  if (!gameState) {
    gameState = LoadGameState();
  }

  const old_state = clone(gameState);

  const new_state = {
    ...old_state,
    ...data,
  };

  console.log(old_state.phase, new_state.phase);
  if (new_state.phase !== old_state.phase) {
    // Phase Changed
    console.log("Phase Changed!", old_state.phase, new_state.phase);
    if (new_state.phase == GamePhase.DRAFTING) {
      Discord.SendMessage("Let the draft begin!");
      AppDataSource.manager.findOneBy(MUser,{id:new_state.currentDrafterId}).then(user=>{
        if(user){
          Discord.SendReminder(user);
        }
      })
    } else if (
      old_state.phase == GamePhase.DRAFTING &&
      new_state.phase == GamePhase.RACING
    ) {
      Discord.SendMessage("That concludes the draft.");
    }
  }

  gameState = new_state;
  gameState.lastUpdated = new Date();

  fs.writeFileSync(STATE_FILE as string, JSON.stringify(gameState));
}

export function GetGameState(): GameState {
  if (!gameState) {
    gameState = LoadGameState();
  }

  return clone(gameState);
}

function LoadGameState(): GameState {
  const exists = fs.existsSync(STATE_FILE as string);
  if (!exists) {
    const defaultState: GameState = {
      currentDrafterId: -1,
      currentRaceId: -1,
      draftOrderIds: [],
      lastUpdated: new Date(),
      phase: GamePhase.WAITING,
      draftRounds: 1,
      currentRound: 1,
    };

    fs.writeFileSync(STATE_FILE as string, JSON.stringify(defaultState));
  }

  const stateStr = fs.readFileSync(STATE_FILE as string, "utf-8");
  const state = JSON.parse(stateStr) as GameState;
  return state;
}

fs.watchFile(
  STATE_FILE as string,
  {
    interval: 100,
  },
  (curr, prev) => {
    console.log("STATE CHANGE DETECTED!");
    gameState = LoadGameState();
  }
);
