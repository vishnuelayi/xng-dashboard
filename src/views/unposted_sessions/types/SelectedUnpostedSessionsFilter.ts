/**
 * Represents the selected filters for unposted sessions.
 */

import { SessionSlimCard } from "../../../session-sdk";

export type filterObjectType = {
  id: string;
  name: string;
}

export type SelectedUnpostedSessionsFilterType = {
  providers?: filterObjectType[];
  students?: filterObjectType[];
  campuses?: string[];
  startDate?: Date | null | undefined;
  endDate?: Date | null | undefined;
  sessions?: SessionSlimCard[];
  sessionCards? : { [key: string]: SessionSlimCard[] }
  sessionIndex?: number;
};
