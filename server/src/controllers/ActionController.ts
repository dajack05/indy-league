import { Action, DraftOrder, Driver, GamePhase, ReturnType, UserClass } from "@ill/common";
import { Request, Response } from "express";
import { V4 } from "paseto";
import { config } from "../config/config";
import { AppDataSource, GetGameState, SetGameState } from "../DataSource";
import Discord from "../Discord";
import { MCar } from "../models/MCar";
import { MDraft } from "../models/MDraft";
import { MDraftOrder } from "../models/MDraftOrder";
import { MDriver } from "../models/MDriver";
import { MEntry } from "../models/MEntry";
import { MRace } from "../models/MRace";
import { MUser } from "../models/MUser";
import { ScrapeDrivers, ScrapeEntries } from "../scraper/Scraper";
import { BaseController } from "./BaseController";

async function CheckToken(token: string) {
  try {
    const tokenResult: any = await V4.verify(token, config.authentication.key);

    if (!tokenResult.id) {
      return "ClearDrafts: Token missing ID";
    }

    return await AppDataSource.manager.findOneBy(MUser, {
      id: tokenResult.id,
    });
  } catch (err) {
    return JSON.stringify(err);
  }
}

export class ActionController extends BaseController {
  async Put(req: Request, res: Response) {
    new ActionController().all(req, res);
  }
  async Post(req: Request, res: Response) {
    new ActionController().all(req, res);
  }

  async all(req: Request, res: Response) {
    const {
      action,
      args,
      token,
    }: { action: Action; args: any[]; token: string } = req.body;

    switch (action) {
      case Action.DRAFT:
        await new ActionController().draft(token, args, res);
        return;
      case Action.ADD_ENTRY:
        await new ActionController().addEntry(token, args, res);
        return;
      case Action.GET_ENTRIES:
        await new ActionController().getEntries(res);
        return;
      case Action.CLEAR_ALL_DRAFTS:
        await new ActionController().clearAllDrafts(token, args, res);
        return;
      case Action.SET_RACE_PHASE:
        await new ActionController().setRacePhase(token, args, res);
        return;
      case Action.SCRAPE_DRIVER_LIST:
        await new ActionController().scrapeDriverList(token, res);
        return;
      case Action.SCRAPE_ENTRIES:
        await new ActionController().scrapeEntries(
          token,
          args[0],
          args[1],
          args[2],
          res
        );
        return;
      case Action.SET_RACE:
        const race_id = Number.parseInt(args[0]);
        if (Number.isNaN(race_id)) {
          res.json(ReturnType.Error("race_id is NaN"));
          return;
        }
        await new ActionController().setRace(token, race_id, res);
        return;
      case Action.SET_DRAFTER:
        const drafter_id = Number.parseInt(args[0]);
        if (Number.isNaN(drafter_id)) {
          res.json(ReturnType.Error("drafter_id is NaN"));
          return;
        }
        await new ActionController().setDrafter(token, drafter_id, res);
        return;
      default:
        res.json(ReturnType.Error("Failed to find requested action"));
    }
  }

  async setRace(token: string, race_id: number, res: Response) {
    const user = await CheckToken(token);
    if (!user) {
      res.json(ReturnType.Error("Token Failure"));
      return;
    }

    if (typeof user == "string") {
      res.json(ReturnType.Error(user));
      return;
    }

    if (user.class !== UserClass.ADMIN) {
      res.json(ReturnType.Error("User not ADMIN"));
      return;
    }

    const s = GetGameState();
    s.currentRaceId = race_id;
    SetGameState(s);

    console.log("Setting race to " + race_id);

    res.json(ReturnType.Ok("OK"));
  }

  async setDrafter(token: string, drafter_id: number, res: Response) {
    const user = await CheckToken(token);
    if (!user) {
      res.json(ReturnType.Error("Token Failure"));
      return;
    }

    if (typeof user == "string") {
      res.json(ReturnType.Error(user));
      return;
    }

    if (user.class !== UserClass.ADMIN) {
      res.json(ReturnType.Error("User not ADMIN"));
      return;
    }

    const s = GetGameState();
    s.currentDrafterId = drafter_id;
    SetGameState(s);

    console.log("Setting drafter to " + drafter_id);

    res.json(ReturnType.Ok("OK"));
  }

  async scrapeEntries(
    token: string,
    url: string,
    selector: string,
    raceID: string,
    res: Response
  ) {
    const user = await CheckToken(token);
    if (!user) {
      res.json(ReturnType.Error("Token Failure"));
      return;
    }

    if (typeof user == "string") {
      res.json(ReturnType.Error(user));
      return;
    }

    if (user.class !== UserClass.ADMIN) {
      res.json(ReturnType.Error("User not ADMIN"));
      return;
    }

    const id = Number.parseInt(raceID);
    const race = await AppDataSource.manager.findOneBy(MRace, { id });
    if (!race) {
      res.json(ReturnType.Error(`Failed to find race with id: ${raceID}`));
      return;
    }

    const entries = await ScrapeEntries(url, selector, race);
    for (const entry of entries) {
      await AppDataSource.manager.save(entry);
    }
    res.json(ReturnType.Ok("OK"));
  }

  async scrapeDriverList(token: string, res: Response) {
    const user = await CheckToken(token);
    if (!user) {
      res.json(ReturnType.Error("Token Failure"));
      return;
    }

    if (typeof user == "string") {
      res.json(ReturnType.Error(user));
      return;
    }

    if (user.class !== UserClass.ADMIN) {
      res.json(ReturnType.Error("User not ADMIN"));
      return;
    }

    const drivers = await ScrapeDrivers();
    for (const driver of drivers) {
      let d = new MDriver();
      d.first_name = driver.first_name;
      d.last_name = driver.last_name;
      d.image_url = driver.image_url;
      AppDataSource.manager.save(d);
    }

    res.json(ReturnType.Ok("OK"));
  }

  async setRacePhase(token: string, args: any[], res: Response) {
    const user = await CheckToken(token);
    if (!user) {
      res.json(ReturnType.Error("Token Failure"));
      return;
    }

    if (typeof user == "string") {
      res.json(ReturnType.Error(user));
      return;
    }

    if (user.class !== UserClass.ADMIN) {
      res.json(ReturnType.Error("User not ADMIN"));
      return;
    }

    if (args.length != 1) {
      res.json(ReturnType.Error("Missing arg[0]"));
      return;
    }

    if (typeof args[0] !== "string") {
      res.json(ReturnType.Error("Arg[0] not number"));
      return;
    }

    const state = GetGameState();
    state.phase = args[0] as GamePhase;
    SetGameState(state);

    res.json(ReturnType.Ok(""));
  }

  /**
   * Clear all drafts IF the token allows it
   */
  async clearAllDrafts(token: string, args: any[], res: Response) {
    if (args.length >= 1) {
      res.json(ReturnType.Error("ClearDrafts: Argument Error"));
      return;
    }

    // Check token
    const user = await CheckToken(token);

    if (!user) {
      res.json(ReturnType.Error(`ClearDrafts: Failed to find User`));
      return;
    }

    if (typeof user == "string") {
      res.json(ReturnType.Error(user));
      return;
    }

    if (user.class !== UserClass.ADMIN) {
      res.json(
        ReturnType.Error(`ClearDrafts: User does not have proper permissions`)
      );
      return;
    }

    // Actually clear
    await AppDataSource.manager.clear(MDraft);

    res.json(ReturnType.Ok("Ok"));
  }

  /**
   * Just retunrs all the current entries (maybe should be refactored out) 🤷
   */
  async getEntries(res: Response) {
    const entries = await AppDataSource.manager.find(MEntry, {
      relations: {
        car: true,
        driver: true,
      },
    });
    res.json(ReturnType.Ok(entries));
  }

  /**
   * Take the DriverID and CarID from args and register an Entry
   */
  async addEntry(token: string, args: any[], res: Response) {
    if (args.length < 2) {
      res.json(ReturnType.Error("Entry: Missing arguments"));
      return;
    }

    if (typeof args[0] != "number" || typeof args[1] != "number") {
      res.json(ReturnType.Error("Entry: args are invalid"));
      return;
    }

    //todo: Verify token is ADMIN
    const driverid: number = args[0];
    const carid: number = args[1];

    const driver = await AppDataSource.manager.findOneBy(MDriver, {
      id: driverid,
    });
    const car = await AppDataSource.manager.findOneBy(MCar, { id: carid });

    if (!driver || !car) {
      res.json(ReturnType.Error("Entry: driver/car missing"));
      return;
    }

    let entry = new MEntry();
    entry.car = car;
    entry.driver = driver;

    entry = await AppDataSource.manager.save(entry);

    res.json(ReturnType.Ok(`Added ${driver.first_name} in car ${car.number}`));
  }

  /**
   * Take the UserID and DriverID from args and register a Draft
   */
  async draft(token: string, args: any[], res: Response) {
    console.log("DRAFT: ATTEMPT", args);
    if (GetGameState().phase !== GamePhase.DRAFTING) {
      res.json(ReturnType.Error("Not in drafting phase"));
      return;
    }

    if (!args || args.length < 2) {
      res.json(ReturnType.Error("Draft: Missing arguments"));
      return;
    }

    if (typeof args[0] != "number" || typeof args[1] != "number") {
      res.json(ReturnType.Error("args are not valid"));
      return;
    }

    const user = await CheckToken(token);
    if (!user) {
      res.json(ReturnType.Error("Invalid Token"));
      return;
    }

    if (typeof user === "string") {
      res.json(ReturnType.Error(user));
      return;
    }

    console.log(`DRAFT: ATTEMPT DRAFT BY ${user.first_name} ${user.last_name}`);
    if (user.id !== GetGameState().currentDrafterId) {
      res.json(ReturnType.Error("You aren't the current drafter"));
      return;
    }

    const driverid: number = args[0];
    const raceid: number = args[1];

    const driver = await AppDataSource.manager.findOneBy(MDriver, {
      id: driverid,
    });
    const race = await AppDataSource.manager.findOneBy(MRace, { id: raceid });

    if (!user || !driver || !race) {
      res.json(ReturnType.Error("Failed to find user and/or driver"));
      return;
    }

    const entry = await AppDataSource.manager.findOne(MEntry, {
      where: {
        driver,
        race,
      },
      relations: {
        car: true,
      },
    });

    if (!entry) {
      res.json(
        ReturnType.Error(
          `${driver.first_name} ${driver.last_name[0]} is not entered into the ${race.name} race`
        )
      );
      return;
    }

    const state = GetGameState();

    // Check if we are done drafting
    if (state.currentRound > state.draftRounds) {
      res.json(ReturnType.Error("Drafting Has Concluded"));
      return;
    }

    const car = entry.car;

    // Make sure the entry isn't already drafted 😬
    const existingDraft = await AppDataSource.manager.findOneBy(MDraft, {
      car,
      race,
    });

    if (existingDraft) {
      res.json(ReturnType.Error(`car ${car.number} already drafted`));
      return;
    }

    const draft = new MDraft();
    draft.car = car;
    draft.drafter = user;
    draft.race = race;

    const draft_order_obj = await AppDataSource.manager.findOneBy(MDraftOrder,{race});
    if(!draft_order_obj){
      const err = `Failed to load draft order for race with id:${race.id}`;
      res.json(ReturnType.Error(err));
      console.error(err);
      return;
    }

    const draft_order = JSON.parse(draft_order_obj.order_json) as number[];

    await AppDataSource.manager.save(draft);
    const drafterIndex = draft_order.indexOf(state.currentDrafterId);

    // Set next ID or 0 if wrapping
    if (draft_order[drafterIndex + 1]) {
      state.currentDrafterId = draft_order[drafterIndex + 1];
    } else {
      state.currentRound++;
      state.currentDrafterId = draft_order[0];

      // Check if we're done drafting
      if (state.currentRound > state.draftRounds) {
        state.phase = GamePhase.RACING;
      }
    }

    // IF we're drafting, send a reminder to the next user
    if (state.phase == GamePhase.DRAFTING) {
      const nextUser = await AppDataSource.manager.findOneBy(MUser, {
        id: state.currentDrafterId,
      });
      if (nextUser) {
        Discord.SendReminder(nextUser);
      }
    }

    SetGameState(state);

    console.log(`DRAFT: OK`);
    res.json(
      ReturnType.Ok(
        `${user.first_name} drafted ${driver.first_name} in car ${car.number} for the ${race.name} race`
      )
    );
  }
}
