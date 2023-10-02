/* eslint-disable no-unused-vars */
import { TokenCookie } from "@/Cookie";
import router from "@/router";
import EntryService from "@/services/EntryService";
import { Entry, User } from "@ill/common";
import Cookies from "js-cookie";
import { ActionContext, ActionTree } from "vuex";
import { Mutation } from "./Mutations";
import { State } from "./State";

export enum Action {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",

  FETCH_DRIVERS = "FETCH_DRIVERS",
  FETCH_RACES = "FETCH_RACES",
  FETCH_RACES_DEEP = "FETCH_RACES_DEEP",
  FETCH_USERS = "FETCH_USERS",
  FETCH_DRAFTS = "FETCH_DRAFTS",
  FETCH_CARS = "FETCH_CARS",

  FETCH_RACE_DATA = "FETCH_RACE_DATA",
  FETCH_SERVER_STATE = "FETCH_SERVER_STATE",

  FETCH_ALL = "FETCH_ALL",

  PERIODIC_FETCH = "PERIODIC_FETCH",

  DELETE_USER = "DELETE_USER",
  UPDATE_USER = "UPDATE_USER",

  ADD_ENTRY = "ADD_ENTRY",
  DELETE_ENTRY = "DELETE_ENTRY",
}

export const actions: ActionTree<State, State> = {
  [Action.LOGIN](
    context: ActionContext<State, State>,
    args: { user: User; token: string }
  ) {
    context.commit(Mutation.SET_USER, args.user);
    context.commit(Mutation.SET_TOKEN, args.token);
    context.commit(Mutation.FETCH_DRAFTS, args.token);
    context.commit(Mutation.FETCH_CARS, args.token);

    Cookies.set("userinfo", TokenCookie.ToString(args.user, args.token));
  },
  [Action.LOGOUT](context: ActionContext<State, State>) {
    context.commit(Mutation.SET_USER, null);
    context.commit(Mutation.SET_TOKEN, null);
    Cookies.remove("userinfo");
    router.push("/");
  },

  [Action.FETCH_DRIVERS](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_DRIVERS);
  },
  [Action.FETCH_RACES](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_RACES);
  },
  [Action.FETCH_RACES_DEEP](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_RACES_DEEP);
  },
  [Action.FETCH_USERS](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_USERS);
  },
  [Action.FETCH_DRAFTS](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_DRAFTS);
  },
  [Action.FETCH_CARS](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_CARS);
  },
  [Action.FETCH_RACE_DATA](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_DRIVERS);
    context.commit(Mutation.FETCH_DRAFTS);
    context.commit(Mutation.FETCH_ENTRIES);
  },
  [Action.FETCH_SERVER_STATE](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_SERVER_STATE);
  },

  [Action.FETCH_ALL](context: ActionContext<State, State>) {
    context.commit(Mutation.FETCH_RACES);
    context.commit(Mutation.FETCH_DRAFTS);
    context.commit(Mutation.FETCH_DRIVERS);
    context.commit(Mutation.FETCH_USERS);
    context.commit(Mutation.FETCH_SERVER_STATE);
  },

  [Action.DELETE_USER](context: ActionContext<State, State>, user: User) {
    context.commit(Mutation.DELETE_USER, user);
  },
  [Action.UPDATE_USER](context: ActionContext<State, State>, user: User) {
    context.commit(Mutation.UPDATE_USER, user);
  },

  [Action.PERIODIC_FETCH](context: ActionContext<State, State>) {
      context.commit(Mutation.PERIODIC_FETCH);
  },

  async [Action.ADD_ENTRY](context: ActionContext<State, State>, entry: Entry) {
    if (context.state.token) {
      await EntryService.add(context.state.token, entry);
      context.commit(Mutation.FETCH_RACES_DEEP);
    }
  },
  async [Action.DELETE_ENTRY](
    context: ActionContext<State, State>,
    entry: Entry
  ) {
    if (context.state.token) {
      await EntryService.remove(context.state.token, entry);
      context.commit(Mutation.FETCH_RACES_DEEP);
    }
  },
};
