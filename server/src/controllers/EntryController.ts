import { Request, Response } from "express";
import { AppDataSource } from "../DataSource";
import { ReturnType, User, UserClass } from "@ill/common";
import { BaseController } from "./BaseController";
import { MEntry } from "../models/MEntry";
import { MDriver } from "../models/MDriver";
import { MCar } from "../models/MCar";
import { MRace } from "../models/MRace";
import { V4 } from "paseto";
import { config } from "../config/config";
import { MUser } from "../models/MUser";

async function CheckToken(
  token: string,
  matchingClass: UserClass
): Promise<User | string> {
  // Check token
  try {
    const result = (await V4.verify(token, config.authentication.key)) as any;
    if (!result.id) {
      return "Unable to verify token";
    }

    const user = await AppDataSource.manager.findOneBy(MUser, {
      id: result.id,
    });
    if (!user || user.class !== matchingClass) {
      return "Failed to authenticate user class";
    }

    return user;
  } catch (err) {
    return JSON.stringify(err);
  }
}

export class EntryController extends BaseController {
  async Get(req: Request, res: Response) {
    if (req.body.id) {
      new EntryController().GetById(req, res);
      return;
    } else if (req.body.raceid) {
      new EntryController().GetByRaceId(req, res);
      return;
    }

    new EntryController().GetAll(req, res);
  }

  async GetAll(req: Request, res: Response) {
    const entries = await AppDataSource.manager.find(MEntry, {
      relations: {
        car: true,
        driver: true,
      },
    });

    if (entries) {
      res.json(ReturnType.Ok(entries));
      return;
    }

    res.json(ReturnType.Error("[GAE]:Entries = null..."));
  }

  async GetById(req: Request, res: Response) {
    const entry = await AppDataSource.manager.findOne(MEntry, {
      where: { id: req.body.id },
      relations: {
        car: true,
        driver: true,
      },
    });
    if (entry) {
      res.json(ReturnType.Ok(entry));
      return;
    }

    res.json(
      ReturnType.Error(`[GEBID]:Could not find Entry with id:${req.body.id}`)
    );
  }

  async GetByRaceId(req: Request, res: Response) {
    const race = await AppDataSource.manager.findOneBy(MRace, {
      id: req.body.raceid,
    });
    if (!race) {
      res.json(
        ReturnType.Error("[GEBRID]Failed to find race with ID:" + req.body.id)
      );
      return;
    }

    const entries = await AppDataSource.manager.find(MEntry, {
      where: { race },
      relations: {
        car: true,
        driver: true,
        race: true,
      },
    });
    if (entries) {
      res.json(ReturnType.Ok(entries));
      return;
    }

    res.json(ReturnType.Error(`[GEBRID]:Could not find Entries`));
  }

  async Put(req: Request, res: Response) {
    const result = await CheckToken(req.body.token, UserClass.ADMIN);
    if (typeof result == "string") {
      res.json(ReturnType.Error(result));
      return;
    }

    if (req.body.id) {
      new EntryController().Update(req, res);
      return;
    }
    new EntryController().Add(req, res);
  }

  // Add from IDs
  async Add(req: Request, res: Response) {
    const { driverid, carid, raceid } = req.body;

    const driver = await AppDataSource.manager.findOneBy(MDriver, {
      id: driverid,
    });
    const car = await AppDataSource.manager.findOneBy(MCar, { id: carid });
    const race = await AppDataSource.manager.findOne(MRace, {
      where: { id: raceid },
    });

    if (!driver || !car || !race) {
      res.json(
        ReturnType.Error(
          "Add Entry: Unable to add entry. Race|Driver|Car = null"
        )
      );
      return;
    }

    // Make sure the car and/or driver isn't already entered
    let result = await AppDataSource.manager.findBy(MEntry, {
      car,
      race,
    });

    if (result.length > 0) {
      res.json(
        ReturnType.Error("Add Entry: Car is already entered for this race")
      );
      return;
    }

    result = await AppDataSource.manager.findBy(MEntry, {
      race,
      driver,
    });

    if (result.length > 0) {
      res.json(
        ReturnType.Error("Add Entry: Driver is already entered for this race")
      );
      return;
    }

    if (!race) {
      res.json(ReturnType.Error("[AE] Missing race"));
      return;
    }

    let entry = new MEntry();
    entry.car = car;
    entry.driver = driver;
    entry.race = race;

    entry = await AppDataSource.manager.save(entry);

    if (!entry) {
      res.json(
        ReturnType.Error(
          `[AE]:Failed to add Entry.\n\n${JSON.stringify(req.body)}`
        )
      );
      return;
    }

    res.json(ReturnType.Ok(entry));
  }

  async Update(req: Request, res: Response) {
    const entry = await AppDataSource.manager.findOneBy(MEntry, {
      id: req.body.id,
    });

    if (!entry) {
      res.json(
        ReturnType.Error(`[UD] Failed to find Drat with id ${req.body.id}`)
      );
      return;
    }

    entry.id = req.body.id;
    entry.car = req.body.car; // Get
    entry.driver = req.body.driver; // Get

    const d = await AppDataSource.manager.update(
      MEntry,
      { id: req.body.id },
      entry
    );

    if (d.affected && d.affected > 0) {
      res.json(ReturnType.Ok(entry));
      return;
    }

    res.json(
      ReturnType.Error(
        `[UE]:Failed to update Entry.\n\n${JSON.stringify(req.body)}`
      )
    );
  }

  async Delete(req: Request, res: Response) {
    // Check token
    try {
      const result = (await V4.verify(
        req.body.token,
        config.authentication.key
      )) as any;
      if (!result.id) {
        res.json(ReturnType.Error("Unable to verify token"));
        return;
      }

      const user = await AppDataSource.manager.findOneBy(MUser, {
        id: result.id,
      });
      if (!user || user.class !== UserClass.ADMIN) {
        res.json(ReturnType.Error("Failed to authenticate user class"));
        return;
      }

      // Otherwise we're an Admin
    } catch (err) {
      res.json(ReturnType.Error(err));
      return;
    }

    const result = await AppDataSource.manager.delete(MEntry, {
      id: req.body.id,
    });
    console.log(req.body.id);
    if (result.affected && result.affected > 0) {
      res.json(ReturnType.Ok(`Successfully removed`));
      return;
    }

    res.json(ReturnType.Error("[REBID]: 0 rows affected by delete."));
  }
}
