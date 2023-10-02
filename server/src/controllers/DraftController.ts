import { Request, Response } from "express";
import { AppDataSource } from "../DataSource";
import { ReturnType } from "@ill/common";
import { BaseController } from "./BaseController";
import { MDraft } from "../models/MDraft";
import { MRace } from "../models/MRace";

export class DraftController extends BaseController {
  async Get(req: Request, res: Response) {
    if (req.body.id) {
      new DraftController().GetById(req, res);
      return;
    }else if(req.body.raceid){
      new DraftController().GetByRaceId(req,res);
      return;
    }

    new DraftController().GetAll(req, res);
  }

  async GetAll(req: Request, res: Response) {
    const drafts = await AppDataSource.manager.find(MDraft,{relations:{
      car:true,
      drafter:true,
      race:true,
    }});
    if (drafts) {
      res.json(ReturnType.Ok(drafts));
      return;
    }

    res.json(ReturnType.Error("[GAD]:Drafts = null..."));
  }

  async GetById(req: Request, res: Response) {
    const draft = await AppDataSource.manager.findOne(MDraft, {
      where: { id: req.body.id },
      relations: {
        car: true,
        drafter: true,
        race: true,
      },
    });
    if (draft) {
      res.json(ReturnType.Ok(draft));
      return;
    }

    res.json(
      ReturnType.Error(`[GDBID]:Could not find Draft with id:${req.body.id}`)
    );
  }

  async GetByRaceId(req: Request, res: Response) {
    const race = await AppDataSource.manager.findOneBy(MRace, {
      id: req.body.raceid,
    });
    if (!race) {
      res.json(
        ReturnType.Error("[GEBRID]Failed to find race with ID:" + req.body.raceid)
      );
      return;
    }

    const drafts = await AppDataSource.manager.find(MDraft, {
      where: { race },
      relations: {
        car: true,
        drafter: true,
      },
    });

    if (drafts) {
      res.json(ReturnType.Ok(drafts));
      return;
    }

    res.json(ReturnType.Error(`[GDBRID]:Could not find Drafts`));
  }

  async Put(req: Request, res: Response) {
    if (req.body.id) {
      new DraftController().Update(req, res);
      return;
    }
    new DraftController().Add(req, res);
  }

  async Add(req: Request, res: Response) {
    const draft = new MDraft();

    draft.car = req.body.car;
    draft.drafter = req.body.drafter;
    draft.race = req.body.race;

    const d = await AppDataSource.manager.save(MDraft, draft);

    if (d) {
      res.json(ReturnType.Ok(d));
      return;
    }

    res.json(
      ReturnType.Error(
        `[AD]:Failed to add draft.\n\n${JSON.stringify(req.body)}`
      )
    );
  }

  async Update(req: Request, res: Response) {
    const draft = await AppDataSource.manager.findOneBy(MDraft, {
      id: req.body.id,
    });

    if (!draft) {
      res.json(
        ReturnType.Error(`[UD] Failed to find Drat with id ${req.body.id}`)
      );
      return;
    }

    draft.id = req.body.id;
    draft.car = req.body.car;
    draft.drafter = req.body.drafter;

    const d = await AppDataSource.manager.update(
      MDraft,
      { id: req.body.id },
      draft
    );

    if (d.affected && d.affected > 0) {
      res.json(ReturnType.Ok(draft));
      return;
    }

    res.json(
      ReturnType.Error(
        `[UD]:Failed to update draft.\n\n${JSON.stringify(req.body)}`
      )
    );
  }

  async Delete(req: Request, res: Response) {
    const draft = await AppDataSource.manager.findOneBy(MDraft, {
      id: req.body.id,
    });
    if (!draft) {
      res.json(
        ReturnType.Error(`[RDBID]:Unable to find driver with ID:${req.body.id}`)
      );
      return;
    }

    const result = await AppDataSource.manager.delete(MDraft, {
      id: req.body.id,
    });
    if (result.affected && result.affected > 0) {
      res.json(ReturnType.Ok(`Successfully removed`));
      return;
    }

    res.json(ReturnType.Error("[RDBID]: 0 rows affected by delete."));
  }
}
