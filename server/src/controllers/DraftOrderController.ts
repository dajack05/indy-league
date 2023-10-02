import { ReturnType } from "@ill/common";
import { Request, Response } from "express";
import { AppDataSource } from "../DataSource";
import { MDraftOrder } from "../models/MDraftOrder";
import { MRace } from "../models/MRace";

export class DraftOrderController {
  async Get(req: Request, res: Response) {
    if (req.body.id) {
      new DraftOrderController().GetByID(req, res);
      return;
    } else if (req.body.race_id) {
      new DraftOrderController().GetByRaceID(req, res);
      return;
    }

    new DraftOrderController().GetAll(req, res);
  }

  private async GetAll(req: Request, res: Response) {
    const draftOrders = await AppDataSource.manager.find(MDraftOrder);
    if (draftOrders) {
      res.json(ReturnType.Ok(draftOrders));
      return;
    }

    res.json(ReturnType.Error("[GADO]:draftOrders = null..."));
  }

  private async GetByID(req: Request, res: Response) {
    const draftOrder = await AppDataSource.manager.findBy(MDraftOrder, {
      id: req.body.id,
    });
    if (draftOrder) {
      res.json(ReturnType.Ok(draftOrder));
      return;
    }

    res.json(ReturnType.Error("[GDOBID]:draftOrder = null..."));
  }

  private async GetByRaceID(req: Request, res: Response) {
    const race = await AppDataSource.manager.findOneBy(MRace, {
      id: req.body.race_id,
    });

    if (race == null) {
      res.json(
        ReturnType.Error(`Failed to find race with ID ${req.body.race_id}`)
      );
      return;
    }

    const draftOrder = await AppDataSource.manager.findOneBy(MDraftOrder, {
      race,
    });
    if (draftOrder == null) {
      res.json(ReturnType.Error("[GDOBRID]:draftOrder = null..."));
      return;
    }

    res.json(ReturnType.Ok(draftOrder));
  }

  async Put(req: Request, res: Response) {
    const { race_id, order_json } = req.body;

    const race = await AppDataSource.manager.findOneBy(MRace, { id: race_id });
    if (!race) {
      res.json(ReturnType.Error(`Failed to find race with id ${race_id}`));
      return;
    }

    const existingOrder = await AppDataSource.manager.findOneBy(MDraftOrder, {
      race,
    });

    if (existingOrder) {
      await AppDataSource.manager.update(MDraftOrder, { race }, { order_json });
    } else {
      await AppDataSource.manager.insert(MDraftOrder, {
        order_json,
        race,
      });
    }

    res.json(ReturnType.Ok("OK"));
  }

  async Post(req: Request, res: Response) {}

  async Delete(req: Request, res: Response) {
    const id = req.body.id;
    const result = await AppDataSource.manager.delete(MDraftOrder, { id });
    if (result.affected != 1) {
      res.json(ReturnType.Error(`${result.affected} rows affected`));
      return;
    }
    res.json(ReturnType.Ok("OK"));
    return;
  }
}
