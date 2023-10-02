import api from "./Api";
import { Driver, ReturnType } from "@ill/common";

const API_NAME = "driver";

export default {
  async getAll(): Promise<Driver[]> {
    const result = await api().get(API_NAME);
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }

    return response.payload;
  },

  async set(driver: Driver, token: string): Promise<void> {
    const result = await api().put(API_NAME, {
      id: driver.id,
      first_name: driver.first_name,
      last_name: driver.last_name,
      image_url: driver.image_url,
      car_id: driver.default_car?.id,
      token,
    });

    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }

    console.log("Updated Driver");
  },
};
