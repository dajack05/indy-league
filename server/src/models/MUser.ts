import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import BCrypt from "bcrypt-nodejs";
import { User, UserClass } from "@ill/common";

@Entity("Users")
export class MUser implements User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("integer")
  class: UserClass = UserClass.USER;

  @Column({
    length: 128,
  })
  first_name!: string;

  @Column({
    length: 128,
  })
  last_name!: string;

  @Column({
    length: 128,
    unique: true,
  })
  email!: string;

  @Column({
    length: 128,
  })
  password!: string;

  temp_password!: string;

  @AfterLoad()
  private checkPassword() {
    this.temp_password = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    const SALT_FACTOR = 9;

    console.log("Checking...");
    if (this.temp_password !== this.password) {
      const salt = BCrypt.genSaltSync(SALT_FACTOR);
      this.password = BCrypt.hashSync(this.password, salt);
    }
  }

  static HashPassword(password: string): string {
    const SALT_FACTOR = 9;
    const salt = BCrypt.genSaltSync(SALT_FACTOR);
    return BCrypt.hashSync(password, salt);
  }

  comparePassword(password: string): boolean {
    return BCrypt.compareSync(password, this.password);
  }
}
