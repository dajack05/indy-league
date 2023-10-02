import { ReturnType } from "@ill/common";
import { NextFunction, Request, Response } from "express";
import Joi from 'joi';
import { BasePolicy } from "./BasePolicy";

export class AuthPolicy extends BasePolicy {
    register(req: Request, res: Response, next: NextFunction) {

        const schema = Joi.object({
            email: Joi.string().email(),
            password: Joi.string().regex(new RegExp('^[a-zA-Z0-9]{0,32}$')),
            first_name: Joi.string(),
            last_name: Joi.string(),
        });

        const result = schema.validate(req.body);
        if (result.error) {
            res.json(ReturnType.Error(result.error.message));
            return;
        }

        next();
    }
}