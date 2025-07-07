// src/types/types.ts
export interface RowData {
  id: string;
  hourRange: string;
  text: string;
}

export interface DayData {
  date: string;
  rows: RowData[];
}

export type PlannerData = Record<string, DayData>;