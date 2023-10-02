import { Request, Response } from "express";

export class BaseController {
    async Get(req: Request, res: Response) { }
    async Put(req: Request, res: Response) { }
    async Post(req: Request, res: Response) { }
    async Delete(req: Request, res: Response) { }
}