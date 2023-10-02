import api from "./Api";
import { Action, Draft, Driver, Race, ReturnType } from "@ill/common";

export default {
  async getAll(): Promise<Draft[]> {
    const result = await api().get("draft");
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }
    return response.payload;
  },

  async getByRace(race: Race): Promise<Draft[]> {
    const result = await api().get("draft", {
      params: {
        raceid: race.id,
      },
    });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }

    return response.payload as Draft[];
  },

  async draft(race: Race, driver: Driver, token: string) {
    const driverid = driver.id;
    const raceid = race.id;
    const result = (
      await api().put("action", {
        token,
        action: Action.DRAFT,
        args: [driverid, raceid],
      })
    ).data as ReturnType;

    if (result.error) {
      console.error(result.error);
      return;
    }
  },

  async clearAll(token: string) {
    const result = (
      await api().put("action", {
        action: Action.CLEAR_ALL_DRAFTS,
        args: [],
        token,
      })
    ).data as ReturnType;

    if (result.error) {
      console.error(result.error);
      return;
    }
  },
};
