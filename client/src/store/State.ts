import { Car, Draft, Driver, Entry, GameState, Race, User } from "@ill/common";

export interface State {
  token: string | null;
  user: User | null;

  active_server_requests: number;
  periodic_fetch_running: boolean;

  server_state: GameState | null;

  drivers: Driver[];
  races: Race[];
  users: User[];
  drafts: Draft[];
  entries: Entry[];
  cars: Car[];

  isAdmin: boolean;
}

export const state: State = {
  token: null,
  user: null,

  server_state: null,
  active_server_requests: 0,
  periodic_fetch_running: false,

  drivers: [],
  races: [],
  users: [],
  drafts: [],
  entries: [],
  cars: [],

  isAdmin: false,
};
