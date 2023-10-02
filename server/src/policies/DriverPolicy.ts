import { ReturnType, UserClass } from "@ill/common";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { V4 } from "paseto";
import { config } from "../config/config";
import { AppDataSource } from "../DataSource";
import { MUser } from "../models/MUser";
import { BasePolicy } from "./BasePolicy";

async function isTokenAdmin(
  token: string
): Promise<{ result: boolean; error: string }> {
  try {
    const value = (await V4.verify(token, config.authentication.key)) as any;

    if (!value.id) {
      return {
        result: false,
        error: "'value' has no id",
      };
    }

    const user = await AppDataSource.manager.findOneBy(MUser, { id: value.id });
    if (!user) {
      return {
        result: false,
        error: "Failed to find user with id" + value.id,
      };
    }

    return {
      result: user.class === UserClass.ADMIN,
      error: "",
    };
  } catch (error: any) {
    return {
      result: false,
      error,
    };
  }
}

export class DriverPolicy extends BasePolicy {
    
  async Get(req: Request, res: Response, next: NextFunction) {
    req.body = req.query;
    next();
  }

  async Post(req: Request, res: Response, next: NextFunction) {
    next();
  }

  async Put(req: Request, res: Response, next: NextFunction) {

    const schema = Joi.object({
      id:Joi.number(),
      first_name: Joi.string().exist(),
      last_name: Joi.string().exist(),
      image_url: Joi.string().exist(),
      token: Joi.string().exist(),
      car_id: Joi.number(),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      res.json(ReturnType.Error(result.error.message));
      return;
    }

    //Check we're valid
    const isAdmin = await isTokenAdmin(req.body.token);
    if (!isAdmin.result) {
      res.json(ReturnType.Error(isAdmin.error));
      return;
    }

    next();
  }

  async Delete(req: Request, res: Response, next: NextFunction) {
    req.body = req.query;

    const schema = Joi.object({
      id: Joi.number().exist(),
      token: Joi.string().exist(),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      res.json(ReturnType.Error(result.error.message));
      return;
    }

    //Check we're valid
    const isAdmin = await isTokenAdmin(req.body.token);
    if (!isAdmin.result) {
      res.json(ReturnType.Error(isAdmin.error));
      return;
    }

    next();
  }
}
