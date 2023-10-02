export enum GamePhase {
  WAITING = "WAITING",
  DRAFTING = "DRAFTING",
  RACING = "RACING",
}

export interface GameState {
  lastUpdated: Date;
  phase: GamePhase;
  currentDrafterId: number;
  draftOrderIds: number[];
  currentRaceId: number;
  draftRounds: number;
  currentRound:number;
}
