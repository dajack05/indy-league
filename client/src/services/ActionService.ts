import api from "./Api";
import { Action, ReturnType } from "@ill/common";

export default {
  async submit(action: Action, args: any[], token: string) {
    const result = await api().put("action", { action, args, token });
    const response = result.data as ReturnType;
    if (response.error) {
      console.error(response.error);
      return;
    }
    return response.payload;
  },
};
