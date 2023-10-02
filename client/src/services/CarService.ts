import api from "./Api";
import { Car, ReturnType } from "@ill/common";

export default {
  async getAll(): Promise<Car[]> {
    const result = await api().get('car');
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }
    return response.payload;
  },
};
