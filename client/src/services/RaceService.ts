import api from "./Api";
import { Draft, Entry, Race, ReturnType } from "@ill/common";

export default {
  async getAll(deep = true): Promise<Race[]> {

    const result = await api().get("race", {
      params: { deep: deep ? 1 : 0 },
    });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }

    const races = response.payload as any[];

    for(const race of races){
      race.start = new Date(race.start);
    }

    return races as Race[];
  },

  async remove(race: Race) {
    const result = await api().delete("race", {
      params: {
        id: race.id,
      },
    });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }
  },

  async add(
    name: string,
    start_date: string,
    entries: Entry[] = [],
    drafts: Draft[] = []
  ) {
    const result = await api().put("race", {
      name,
      start_date,
      entries,
      drafts,
    });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }
  },

  async update(race: Race) {
    const result = await api().put("race", {
      id: race.id,
      name: race.name,
      start: race.start,
    });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }
  },
};
