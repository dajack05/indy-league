import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DraftOrder, Race } from "@ill/common"
import { MEntry } from "./MEntry";
import { MDraft } from "./MDraft";
import { MDraftOrder } from "./MDraftOrder";

@Entity("Races")
export class MRace implements Race {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    start!: Date;

    @OneToMany(() => MEntry, (entry) => entry.race, {cascade:true, eager:true})
    entries!: MEntry[];

    @OneToMany(() => MDraft, (draft) => draft.race, {cascade:true, eager:true})
    drafts!: MDraft[];

    @OneToMany(() => MDraftOrder, (draftOrder) => draftOrder.race)
    draft_orders!: DraftOrder[];
}