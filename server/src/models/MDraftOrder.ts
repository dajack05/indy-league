import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DraftOrder, Race } from "@ill/common";
import { MRace } from "./MRace";

@Entity("DraftOrders")
export class MDraftOrder implements DraftOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  order_json!: string;

  @ManyToOne(() => MRace)
  race!: Race;
}
