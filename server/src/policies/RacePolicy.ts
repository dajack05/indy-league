import { ReturnType } from "@ill/common";
import { NextFunction, Request, Response } from "express";
import Joi from 'joi';
import { BasePolicy } from "./BasePolicy";

export class RacePolicy extends BasePolicy {

    async Get(req:Request, res:Response, next:NextFunction){
        req.body = req.query;

        const schema = Joi.object({
            id: Joi.number(),
            deep: Joi.number(),
        });

        const result = schema.validate(req.body)
        if (result.error) {
            res.json(ReturnType.Error(result.error.message));
            return;
        }

        next();
    }

    async Put(req: Request, res: Response, next: NextFunction) {

        const schema = Joi.object({
            id: Joi.number(),
            start_date: Joi.string().exist(),
            name: Joi.string().exist(),
            entries: Joi.array().exist(),
            drafts: Joi.array().exist(),
        });

        const result = schema.validate(req.body);
        if (result.error) {
            res.json(ReturnType.Error(result.error.message));
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

        next();
    }
}