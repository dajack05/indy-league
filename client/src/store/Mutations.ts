import Api from "@/services/Api";
import CarService from "@/services/CarService";
import DraftService from "@/services/DraftService";
import DriverService from "@/services/DriverService";
import EntryService from "@/services/EntryService";
import RaceService from "@/services/RaceService";
import UserService from "@/services/UserService";
import { GameState, User, UserClass, Profiler } from "@ill/common";
import { MutationTree } from "vuex";
import { State } from "./State";

export enum Mutation {
  SET_TOKEN = "SET_TOKEN",
  SET_USER = "SET_USER",

  FETCH_DRIVERS = "FETCH_DRIVERS",
  FETCH_RACES = "FETCH_RACES",
  FETCH_RACES_DEEP = "FETCH_RACES_DEEP",
  FETCH_USERS = "FETCH_USERS",
  FETCH_DRAFTS = "FETCH_DRAFTS",
  FETCH_CARS = "FETCH_CARS",

  FETCH_ENTRIES = "FETCH_ENTRIES",
  FETCH_SERVER_STATE = "FETCH_SERVER_STATE",

  DELETE_USER = "DELETE_USER",
  UPDATE_USER = "UPDATE_USER",

  PERIODIC_FETCH = "PERIODIC_FETCH",
}

export const mutations: MutationTree<State> = {
  async [Mutation.SET_TOKEN](state, token: string) {
    state.token = token;
  },
  async [Mutation.SET_USER](state, user: User) {
    state.user = user;
    if (user) {
      state.isAdmin = user.class === UserClass.ADMIN || false;
    } else {
      state.isAdmin = false;
    }
  },

  async [Mutation.PERIODIC_FETCH](state) {
    state.periodic_fetch_running = true;

    {
      const result = await UserService.getAll();
      state.users = result;
    }

    {
      const result = await Api().get("state");
      state.server_state = result.data as GameState;
    }

    {
      const result = await DraftService.getAll();
      state.drafts = result;
    }

    state.periodic_fetch_running = false;
  },

  async [Mutation.FETCH_DRIVERS](state) {
    state.active_server_requests++;
    const result = await DriverService.getAll();
    state.drivers = result;
    state.active_server_requests--;
  },
  async [Mutation.FETCH_RACES](state) {
    state.active_server_requests++;
    const result = await RaceService.getAll();
    state.races = result;
    state.active_server_requests--;
  },
  async [Mutation.FETCH_RACES_DEEP](state) {
    state.active_server_requests++;
    const result = await RaceService.getAll(true);
    state.races = result;
    state.active_server_requests--;
  },
  async [Mutation.FETCH_USERS](state) {
    state.active_server_requests++;
    const result = await UserService.getAll();
    state.users = result;
    state.active_server_requests--;
  },
  async [Mutation.FETCH_DRAFTS](state) {
    state.active_server_requests++;
    const result = await DraftService.getAll();
    state.drafts = result;
    state.active_server_requests--;
  },
  async [Mutation.FETCH_ENTRIES](state) {
    state.active_server_requests++;
    const result = await EntryService.getAll();
    state.entries = result;
    state.active_server_requests--;
  },
  async [Mutation.FETCH_CARS](state) {
    state.active_server_requests++;
    const result = await CarService.getAll();
    state.cars = result;
    state.active_server_requests--;
  },

  async [Mutation.FETCH_SERVER_STATE](state) {
    state.active_server_requests++;
    const result = await Api().get("state");
    state.server_state = result.data as GameState;
    state.active_server_requests--;
  },

  async [Mutation.DELETE_USER](state, user: User) {
    const index = state.users.indexOf(user);
    if (index < 0) {
      // Failed to find user
      console.error("Failed to find delete user", user, "Unable to find");
      return;
    }

    state.users = state.users.splice(index + 1, 1);
  },
  async [Mutation.UPDATE_USER](state, user: User) {
    state.active_server_requests++;
    const u = await UserService.update(user);
    for (let _user of state.users) {
      if (_user.id === u.id) {
        _user = u;
        break;
      }
    }
    await mutations[Mutation.FETCH_USERS](state);
    state.active_server_requests--;
  },
};
