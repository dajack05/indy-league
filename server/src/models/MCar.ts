import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Car } from "@ill/common";
import { MDriver } from "./MDriver";

@Entity("Cars")
export class MCar implements Car {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  number!: string;

  @Column()
  team_name!: string;

  @OneToMany(() => MDriver, (d) => d.default_car)
  default_driver!: MDriver[];
}
