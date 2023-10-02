import { Request, Response } from "express";
import { AppDataSource } from "../DataSource";
import { ReturnType } from "@ill/common";
import { BaseController } from "./BaseController";
import { MUser } from "../models/MUser";

export class UserController extends BaseController {
  async Get(req: Request, res: Response) {
    if (req.body.id) {
      new UserController().GetById(req, res);
      return;
    }

    new UserController().GetAll(req, res);
  }

  async GetAll(req: Request, res: Response) {
    const users = await AppDataSource.manager.find(MUser);
    if (users) {
      res.json(ReturnType.Ok(users));
      return;
    }

    res.json(ReturnType.Error("[GAU]:Users = null..."));
  }

  async GetById(req: Request, res: Response) {
    const user = await AppDataSource.manager.findOneBy(MUser, {
      id: req.body.id,
    });
    if (user) {
      res.json(ReturnType.Ok(user));
      return;
    }

    res.json(
      ReturnType.Error(`[GUBID]:Could not find User with id:${req.body.id}`)
    );
  }

  async Put(req: Request, res: Response) {
    if (req.body.id) {
      new UserController().Update(req, res);
      return;
    }
    new UserController().Add(req, res);
  }

  async Add(req: Request, res: Response) {
    res.json(ReturnType.Ok("Blanky Boi"));
    // const user = new User();

    // if (req.body.id) {
    //     driver.id = req.body.id;
    // }

    // driver.first_name = req.body.first_name;
    // driver.last_name = req.body.last_name;
    // driver.image_url = req.body.image_url;

    // const d = await AppDataSource.manager.save(Driver, driver);

    // if (d) {
    //     res.json(ReturnType.Ok(d));
    //     return;
    // }

    // res.json(ReturnType.Error(`[AD]:Failed to add driver.\n\n${JSON.stringify(req.body)}`));
  }

  async Update(req: Request, res: Response) {
    const user = await AppDataSource.manager.findOneBy(MUser, {
      id: req.body.id,
    });

    if (!user) {
      res.json(
        ReturnType.Error(`[UU] Failed to find User with id ${req.body.id}`)
      );
      return;
    }

    if (req.body.id) user.id = req.body.id;

    if (req.body.first_name) user.first_name = req.body.first_name;

    if (req.body.last_name) user.last_name = req.body.last_name;

    if (req.body.email) user.email = req.body.email;

    if (req.body.class) user.class = req.body.class;

    if (req.body.password) user.password = MUser.HashPassword(req.body.password);

    try {
      const d = await AppDataSource.manager.update(
        MUser,
        { id: req.body.id },
        {
          ...user,
          temp_password: undefined,
        }
      );

      if (d.affected && d.affected > 0) {
        res.json(ReturnType.Ok(user));
        return;
      }
    } catch (err) {
      res.json(ReturnType.Error(`[UU] ${err}`));
      return;
    }
    res.json(
      ReturnType.Error(
        `[UU]:Failed to update User.\n\n${JSON.stringify(req.body)}`
      )
    );
  }

  async Delete(req: Request, res: Response) {
    const user = await AppDataSource.manager.findOneBy(MUser, {
      id: req.body.id,
    });
    if (!user) {
      res.json(
        ReturnType.Error(`[RUBID]:Unable to find driver with ID:${req.body.id}`)
      );
      return;
    }

    const result = await AppDataSource.manager.delete(MUser, {
      id: req.body.id,
    });
    if (result.affected && result.affected > 0) {
      res.json(
        ReturnType.Ok(
          `Successfully removed ${user.first_name} ${user.last_name}`
        )
      );
      return;
    }

    res.json(ReturnType.Error("[RUBID]: 0 rows affected by delete."));
  }
}
