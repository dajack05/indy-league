import { Request, Response } from "express";
import { AppDataSource } from "../DataSource";
import { ReturnType } from "@ill/common";
import { BaseController } from "./BaseController";
import { MDriver } from "../models/MDriver";
import { MCar } from "../models/MCar";

export class DriverController extends BaseController {
  async Get(req: Request, res: Response) {
    if (req.body.id) {
      new DriverController().GetById(req, res);
      return;
    }

    new DriverController().GetAll(req, res);
  }

  async GetAll(req: Request, res: Response) {
    const drivers = await AppDataSource.manager.find(MDriver,{relations:{
        default_car:true,
    }});
    if (drivers) {
      res.json(ReturnType.Ok(drivers));
      return;
    }

    res.json(ReturnType.Error("[GAD]:Drivers = null..."));
  }

  async GetById(req: Request, res: Response) {
    const driver = await AppDataSource.manager.findOneBy(MDriver, {
      id: req.body.id,
    });
    if (driver) {
      res.json(ReturnType.Ok(driver));
      return;
    }

    res.json(
      ReturnType.Error(`[GDBID]:Could not find Driver with id:${req.body.id}`)
    );
  }

  async Put(req: Request, res: Response) {
    if (req.body.id) {
      new DriverController().Update(req, res);
      return;
    }
    new DriverController().Add(req, res);
  }

  async Add(req: Request, res: Response) {
    const driver = new MDriver();

    driver.first_name = req.body.first_name;
    driver.last_name = req.body.last_name;
    driver.image_url = req.body.image_url;

    if (req.body.car_id) {
      const car = await AppDataSource.manager.findOneBy(MCar, {
        id: req.body.car_id,
      });
      if (car) {
        driver.default_car = car;
      }
    }

    const d = await AppDataSource.manager.save(MDriver, driver);

    if (d) {
      res.json(ReturnType.Ok(d));
      return;
    }

    res.json(
      ReturnType.Error(
        `[AD]:Failed to add driver.\n\n${JSON.stringify(req.body)}`
      )
    );
  }

  async Update(req: Request, res: Response) {
    const driver = await AppDataSource.manager.findOneBy(MDriver, {
      id: req.body.id,
    });

    if (driver == null) {
      res.json(
        ReturnType.Error(`[UD] Failed to find Driver with id ${req.body.id}`)
      );
      return;
    }

    driver.id = req.body.id;
    driver.first_name = req.body.first_name;
    driver.last_name = req.body.last_name;
    driver.image_url = req.body.image_url;

    if (req.body.car_id) {
      const car = await AppDataSource.manager.findOneBy(MCar, {
        id: req.body.car_id,
      });
      if (car) {
        console.log(car);
        driver.default_car = car;
      }
    }

    try {
      await AppDataSource.manager.save(driver);
      // );
    } catch (err) {
      console.error(err);
      res.json(ReturnType.Error(err));
      return;
    }

    res.json(ReturnType.Ok(driver));
  }

  async Delete(req: Request, res: Response) {
    const driver = await AppDataSource.manager.findOneBy(MDriver, {
      id: req.body.id,
    });
    if (!driver) {
      res.json(
        ReturnType.Error(`[RDBID]:Unable to find driver with ID:${req.body.id}`)
      );
      return;
    }

    const result = await AppDataSource.manager.delete(MDriver, {
      id: req.body.id,
    });
    if (result.affected && result.affected > 0) {
      res.json(
        ReturnType.Ok(
          `Successfully removed ${driver.first_name} ${driver.last_name}`
        )
      );
      return;
    }

    res.json(ReturnType.Error("[RDBID]: 0 rows affected by delete."));
  }
}
