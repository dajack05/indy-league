import { Car } from "./Car";

export class Driver {
  id!: number;
  first_name!: string;
  last_name!: string;
  image_url!: string;
  default_car: Car | undefined;
}
