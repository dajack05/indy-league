import { Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { config } from "../config/config";
import { V4 } from 'paseto';
import { AppDataSource } from "../DataSource";
import { ReturnType } from "@ill/common";
import { MUser } from "../models/MUser";



async function jwtSignUser(user: MUser): Promise<string> {
    try {
        const token = await V4.sign(
            {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                id: user.id,
            },
            config.authentication.key,
            {
                expiresIn: "4 h",
            });
        return token;
    } catch (err) {
        console.error(err);
        return "";
    }
}

export class AuthController {
    async login(req: Request, res: Response) {
        if (req.body.token) {
            new AuthController().loginToken(req, res);
            return
        }

        new AuthController().loginEmailPassword(req, res);
    }

    async loginToken(req: Request, res: Response) {
        const { email, token } = req.body;

        if (!token) {
            res.json(ReturnType.Error("Missing Token"));
            return;
        }

        try {
            // Will throw if token is bad
            const value = await V4.verify(token, config.authentication.key) as any;

            if (value.id) {
                const user = await AppDataSource.manager.findOneBy(MUser, { id: value.id });
                if (!user) {
                    res.json(ReturnType.Error("Failed to find user"));
                    return;
                }

                const token = await jwtSignUser(user);
                res.json(ReturnType.Ok({
                    user,
                    token
                }));
            }

            return;
        } catch (err) {
            res.json(ReturnType.Error(err));
            return;
        }
    }

    async loginEmailPassword(req: Request, res: Response) {
        const { email, password } = req.body;
        console.log(`LOGIN: ${email}`);

        if (!email || !password) {
            res.json({
                error: "Missing Email or Password"
            });
            return;
        }

        try {
            const user = await AppDataSource.manager.findOneBy(MUser, { email });

            if (!user) {
                res.json({
                    error: "Cannot find user"
                });
                return;
            }

            if (!user.comparePassword(password)) {
                res.json({
                    error: "Wrong password"
                });
                return;
            }

            const token = await jwtSignUser(user);
            console.log("LOGIN: 🤘 Groovy 🤘");
            res.json({
                user,
                token
            });
            return;
        } catch (err) {
            res.json({
                error: err
            });
            return;
        }
    }

    async register(req: Request, res: Response) {
        const { email, password, first_name, last_name } = req.body;

        if (!email || !password || !first_name || !last_name) {
            res.json({
                error: "Missing Name, Email, or Password"
            });
            return;
        }

        console.log(`REGISTER: ${email},${password},${first_name},${last_name}`);

        try {
            const user = new MUser();
            user.email = email;
            user.first_name = first_name;
            user.last_name = last_name;
            user.password = password;

            await AppDataSource.manager.save(user);

            console.log(`REGISTER: OK`);

            res.json({
                user,
                token: jwtSignUser(user)
            });
            return;
        } catch (err) {
            let error = "Server Error";

            console.error(`REGISTER: `, err);

            if (err instanceof QueryFailedError) {
                switch (err.name) {
                    case "QueryFailedError":
                        if (err.message.includes("email")) error = "Email already used";
                        break;
                }

                console.log(err.message);
            }

            res.json({
                error
            });

            return;
        }
    }
}
