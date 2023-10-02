import { ReturnType } from "@ill/common";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { BasePolicy } from "./BasePolicy";

export class DraftPolicy extends BasePolicy {
  async Put(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      token: Joi.string().exist(),
      id: Joi.number(),
      raceid: Joi.number().exist(),
      carid: Joi.number().exist(),
      drafterid: Joi.number().exist(),
    });

    const result = schema.validate(req.body);
    if (result.error) {
      res.json(ReturnType.Error(result.error.message));
      return;
    }

    next();
  }
}
