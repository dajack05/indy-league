import { Car } from "./Car";
import { Race } from "./Race";
import { User } from "./User";

export class Draft {
    id!: number;
    drafter!: User;
    car!: Car;
    race!: Race;
}