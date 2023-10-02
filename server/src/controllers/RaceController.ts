import { Request, Response } from "express";
import { AppDataSource } from "../DataSource";
import { Race, ReturnType } from "@ill/common";
import { MRace } from "../models/MRace";
import { BaseController } from "./BaseController";
import { MEntry } from "../models/MEntry";
import { MDraft } from "../models/MDraft";

export class RaceController extends BaseController {
  async Get(req: Request, res: Response) {
    const deep = req.body.deep == 1;

    if (req.body.id) {
      new RaceController().GetById(req, res, deep);
      return;
    }

    new RaceController().GetAll(req, res, deep);
  }

  private async PopulateRace(race: Race) {
    const es = await AppDataSource.manager.find(MEntry, {
      where: { race },
      relations: {
        car: true,
        driver: true,
      },
    });
    race.entries = es;

    const ds = await AppDataSource.manager.find(MDraft, {
      where: { race },
      relations: {
        car: true,
        drafter: true,
      },
    });

    race.drafts = ds;
  }

  async GetAll(req: Request, res: Response, deep: boolean) {
    const races = await AppDataSource.manager.find(MRace);

    if (deep) {
      for (const race of races) {
        await this.PopulateRace(race);
      }
    }

    if (races) {
      res.json(ReturnType.Ok(races));
      return;
    }

    res.json(ReturnType.Error("[GAR]:Races = null..."));
  }

  async GetById(req: Request, res: Response, deep: boolean) {
    const race = await AppDataSource.manager.findOne(MRace, {
      where: { id: req.body.id },
    });

    if (deep && race) {
      await this.PopulateRace(race);
    }

    if (race) {
      res.json(ReturnType.Ok(race));
      return;
    }

    res.json(
      ReturnType.Error(`[GRBID]:Could not find Race with id:${req.body.id}`)
    );
  }

  async Put(req: Request, res: Response) {
    if (req.body.id) {
      await new RaceController().Update(req, res);
      return;
    }

    await new RaceController().Add(req, res);
  }

  async Add(req: Request, res: Response) {
    const race = new MRace();

    const date_str = req.body.start_date;
    const splits = date_str.split("-");
    const year = Number.parseInt(splits[0]);
    const month = Number.parseInt(splits[1]);
    const day = Number.parseInt(splits[2]);
    race.start = new Date(year, month, day);

    race.name = req.body.name;

    const r = await AppDataSource.manager.save(MRace, race);

    if (r) {
      res.json(ReturnType.Ok(r));
      return;
    }

    res.json(
      ReturnType.Error(
        `[AR]:Failed to add Race.\n\n${JSON.stringify(req.body)}`
      )
    );
  }

  async Update(req: Request, res: Response) {
    const race = new MRace();

    race.id = req.body.id;
    race.name = req.body.name;
    race.entries = req.body.entries;
    race.start = req.body.start_date;
    race.drafts = req.body.drafts;

    const r = await AppDataSource.manager.update(MRace, { id: race.id }, race);

    if (r) {
      res.json(ReturnType.Ok(r));
      return;
    }

    res.json(
      ReturnType.Error(
        `[UR]:Failed to update Race.\n\n${JSON.stringify(req.body)}`
      )
    );
  }

  async Delete(req: Request, res: Response) {
    const race = await AppDataSource.manager.findOneBy(MRace, {
      id: req.body.id,
    });
    if (!race) {
      res.json(
        ReturnType.Error(`[RRBID]:Unable to find Race with ID:${req.body.id}`)
      );
      return;
    }

    const result = await AppDataSource.manager.delete(MRace, {
      id: req.body.id,
    });
    if (result.affected && result.affected > 0) {
      res.json(ReturnType.Ok(`Successfully removed ${race.name}`));
      return;
    }

    res.json(ReturnType.Error("[RRBID]: 0 rows affected by delete."));
  }
}
