import { User } from "@ill/common";

export class TokenCookie {
    user!: User;
    token!: string;

    static ToString(user: User, token: string): string {
        return JSON.stringify({ user, token } as TokenCookie);
    }

    static FromString(json: string): TokenCookie {
        return JSON.parse(json) as TokenCookie;
    }
}