import { Request, Response } from "express";
import { AppDataSource } from "../DataSource"
import { ReturnType } from "@ill/common";
import { BaseController } from "./BaseController";
import { MCar } from "../models/MCar";

export class CarController extends BaseController {
    async Get(req: Request, res: Response) {
        if (req.body.id) {
            new CarController().GetById(req, res);
            return;
        }

        new CarController().GetAll(req, res);
    }

    async GetAll(req: Request, res: Response) {
        const cars = await AppDataSource.manager.find(MCar);
        if (cars) {
            res.json(ReturnType.Ok(cars));
            return;
        }

        res.json(ReturnType.Error("[GAC]:cars = null..."));
    }

    async GetById(req: Request, res: Response) {
        const car = await AppDataSource.manager.findOneBy(MCar, { id: req.body.id });
        if (car) {
            res.json(ReturnType.Ok(car));
            return;
        }

        res.json(ReturnType.Error(`[GCBID]:Could not find Car with id:${req.body.id}`));
    }

    async Put(req: Request, res: Response) {
        if (req.body.id) {
            new CarController().Update(req, res);
            return;
        }
        new CarController().Add(req, res);
    }

    async Add(req: Request, res: Response) {
        const car = new MCar();

        car.number = req.body.number;
        car.team_name = req.body.team_name;

        const d = await AppDataSource.manager.save(MCar, car);

        if (d) {
            res.json(ReturnType.Ok(d));
            return;
        }

        res.json(ReturnType.Error(`[AC]:Failed to add car.\n\n${JSON.stringify(req.body)}`));
    }

    async Update(req: Request, res: Response) {
        const car = await AppDataSource.manager.findOneBy(MCar, { id: req.body.id });

        if (!car) {
            res.json(ReturnType.Error(`[UD] Failed to find Drat with id ${req.body.id}`));
            return;
        }

        car.id = req.body.id;
        car.number = req.body.number;
        car.team_name = req.body.team_name;

        const d = await AppDataSource.manager.update(MCar, { id: req.body.id }, car);

        if (d.affected && d.affected > 0) {
            res.json(ReturnType.Ok(d));
            return;
        }

        res.json(ReturnType.Error(`[UC]:Failed to update car.\n\n${JSON.stringify(req.body)}`));
    }

    async Delete(req: Request, res: Response) {
        const car = await AppDataSource.manager.findOneBy(MCar, { id: req.body.id });
        if (!car) {
            res.json(ReturnType.Error(`[RCBID]:Unable to find car with ID:${req.body.id}`));
            return;
        }

        const result = await AppDataSource.manager.delete(MCar, { id: req.body.id });
        if (result.affected && result.affected > 0) {
            res.json(ReturnType.Ok(`Successfully removed`));
            return;
        }

        res.json(ReturnType.Error("[RCBID]: 0 rows affected by delete."));
    }
}