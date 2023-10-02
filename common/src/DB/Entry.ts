import { Car } from "./Car";
import { Driver } from "./Driver";
import { Race } from "./Race";

export class Entry {
    id!: number;
    driver!: Driver;
    car!: Car;
    race!: Race;
}