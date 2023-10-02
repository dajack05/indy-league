import api from "./Api";
import { Entry, Race, ReturnType } from "@ill/common";

export default {
  async getAll(): Promise<Entry[]> {
    const result = await api().get("entry");
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }
    return response.payload;
  },

  async getByRace(race: Race): Promise<Entry[]> {
    const result = await api().get("entry", {
      params: {
        raceid: race.id,
      },
    });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }

    return response.payload;
  },

  async add(token: string, entry: Entry): Promise<Entry | null> {
    const result = await api().put("entry", {
      driverid: entry.driver.id,
      carid: entry.car.id,
      raceid: entry.race.id,
      token,
    });

    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return null;
    }

    return response.payload;
  },

  async remove(token: string, entry: Entry) {
    const result = await api().delete("entry", {
      params: {
        id: entry.id,
        token,
      },
    });

    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }
  },
};
