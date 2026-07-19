export interface Show {
  id: string;
  name: string;
  /** ISO date string, e.g. "2026-08-12" */
  date: string;
  ticketUrl: string;
}

export type NewShow = Omit<Show, "id">;
