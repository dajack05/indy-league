import api from "./Api";
import { DraftOrder, Race, ReturnType } from "@ill/common";

const API_NAME = "draftorder";

export default {
  async getAll(): Promise<DraftOrder[]> {
    const result = await api().get(API_NAME);
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return [];
    }

    const orders = response.payload as any[];

    return orders as DraftOrder[];
  },

  async getByRace(race:Race):Promise<DraftOrder|null>{
    const result = await api().get(API_NAME,{
      params:{
        race_id:race.id
      }
    });

    const response = result.data as ReturnType;
    if(response.error){
      console.error(response.error);
      return null;
    }

    return response.payload as DraftOrder;
  },

  async remove(order: DraftOrder) {
    const result = await api().delete(API_NAME, {
      params: {
        id: order.id,
      },
    });

    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }
  },

  async set(race: Race, order_json: string, token:string) {
    const result = await api().put(API_NAME, {
      race_id: race.id,
      order_json,
      token,
    });

    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }
  },
};
