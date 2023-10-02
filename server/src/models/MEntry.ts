import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entry, Race } from "@ill/common";
import { MCar } from "./MCar";
import { MDriver } from "./MDriver";
import { MRace } from "./MRace";

@Entity("Entries")
export class MEntry implements Entry {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => MDriver)
    driver!: MDriver;

    @ManyToOne(() => MCar)
    car!: MCar;

    @ManyToOne(() => MRace, r=>r.entries)
    race!: MRace;
}