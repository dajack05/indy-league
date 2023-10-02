import { Driver } from "@ill/common";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
Unique,
} from "typeorm";
import { MCar } from "./MCar";

@Entity("Drivers")
export class MDriver implements Driver {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 128,
  })
  first_name!: string;

  @Column({
    length: 128,
  })
  last_name!: string;

  @Column()
  image_url!: string;

  @ManyToOne(() => MCar, (c) => c.default_driver)
  default_car: MCar | undefined;
}
