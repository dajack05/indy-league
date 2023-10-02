import { Car, Draft, Race, User } from "@ill/common";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MCar } from "./MCar";
import { MRace } from "./MRace";
import { MUser } from "./MUser";

@Entity("Drafts")
export class MDraft implements Draft {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => MUser)
    drafter!: User;

    @ManyToOne(() => MCar)
    car!: Car;

    @ManyToOne(() => MRace)
    race!: Race;
}