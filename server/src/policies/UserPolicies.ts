import { ReturnType, UserClass } from "@ill/common";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { V4 } from "paseto";
import { config } from "../config/config";
import { AppDataSource } from "../DataSource";
import { MUser } from "../models/MUser";
import { BasePolicy } from "./BasePolicy";

export class UserPolicies extends BasePolicy {
  async Put(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      token: Joi.string().exist(),
      id: Joi.number().integer(),
      email: Joi.string().email(),
      password: Joi.string().regex(new RegExp("^[a-zA-Z0-9]{0,32}$")),
      first_name: Joi.string(),
      last_name: Joi.string(),
      class: Joi.number().integer().min(UserClass.USER).max(UserClass.ADMIN),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      res.json(ReturnType.Error(result.error.message));
      return;
    }

    // Check that token is valid
    if (!req.body.token) {
      res.json(ReturnType.Error("[UserPolicies] Missing Token"));
      return;
    }

    try {
      const result: any = await V4.verify(
        req.body.token,
        config.authentication.key
      );
      if (!result.id) {
        res.json(ReturnType.Error("[UserPolicies] Missing ID"));
        return;
      }

      const user = await AppDataSource.manager.findOneBy(MUser, {
        id: result.id,
      });
      if (!user) {
        res.json(
          ReturnType.Error("[UserPolicies] Failed to find user with ID")
        );
        return;
      }
    } catch (err) {
      res.json(ReturnType.Error("[UserPolicies] Token Invalid"));
      return;
    }

    next();
  }

  async Delete(req: Request, res: Response, next: NextFunction) {
    req.body = req.query;

    console.log(req.body);

    const schema = Joi.object({
      token: Joi.string().exist(),
      id: Joi.number().integer().exist(),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      res.json(ReturnType.Error(result.error.message));
      return;
    }

    // Check that token is valid
    if (!req.body.token) {
      res.json(ReturnType.Error("[UserPolicies] Missing Token"));
      return;
    }

    try {
      const result: any = await V4.verify(
        req.body.token,
        config.authentication.key
      );
      if (!result.id) {
        res.json(ReturnType.Error("[UserPolicies] Missing ID"));
        return;
      }

      const user = await AppDataSource.manager.findOneBy(MUser, {
        id: result.id,
      });
      if (!user) {
        res.json(
          ReturnType.Error("[UserPolicies] Failed to find user with ID")
        );
        return;
      }
    } catch (err) {
      res.json(ReturnType.Error("[UserPolicies] Token Invalid"));
      return;
    }

    next();
  }

  async Get(req: Request, res: Response, next: NextFunction) {
    req.body = req.query;
    await new UserPolicies().Put(req, res, next);
  }
}
