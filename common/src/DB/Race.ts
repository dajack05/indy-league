import { Draft } from "./Draft";
import { DraftOrder } from "./DraftOrder";
import { Entry } from "./Entry";

export enum RaceState {
    WAITING,
    READY,
    GREEN,
    YELLOW,
    RED,
    FINISHED,
    COUNT,
}

export class Race {
    id!: number;
    name!: string;
    start!: Date;

    entries!: Entry[];
    drafts!: Draft[];

    draft_orders!:DraftOrder[];
}