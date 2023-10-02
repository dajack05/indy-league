import { NextFunction, Request, Response } from "express";

export class BasePolicy {
    async Get(req: Request, res: Response, next: NextFunction) {
        req.body = req.query;
        next();
    }
    async Post(req: Request, res: Response, next: NextFunction) { next() }
    async Put(req: Request, res: Response, next: NextFunction) { next() }
    async Delete(req: Request, res: Response, next: NextFunction) {
        req.body = req.query;
        next();
    }
}