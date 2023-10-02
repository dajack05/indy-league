import { NextFunction, Request, Response } from "express";
import { BasePolicy } from "./BasePolicy";
import { ReturnType } from "@ill/common";
import Joi from "joi";

export class ActionPolicy extends BasePolicy {
  async Post(req: Request, res: Response, next: NextFunction) {
    new ActionPolicy().all(req, res, next);
  }

  async Put(req: Request, res: Response, next: NextFunction) {
    new ActionPolicy().all(req, res, next);
  }

  async all(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      action: Joi.number(),
      args: Joi.array().items(Joi.any()).exist(),
      token: Joi.string().exist(),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      res.json(ReturnType.Error(result.error.message));
      return;
    }

    next();
  }
}
