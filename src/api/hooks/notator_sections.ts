import { useEffect, useState } from "react";
import { NotatorSection } from "../../profile-sdk";
import { SessionResponse } from "../../session-sdk";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { useXNGSelector } from "../../context/store";
import { API_STATESNAPSHOTS } from "../api";

/**
 * Retrieves a list of NotatorSections, which controls the rendering of tabs on the Notator as well as the requirement statuses.
 * This will only ever be called in the context of the notator, and should be called everytime the hook mounts, or effectively
 * every time the notator lifecyle begins.
 * @param session Indicates what session we are retrieving notator sections for.
 */
export default function useFetchNotatorSections(session: SessionResponse): NotatorSection[] | null {
  const [notatorSections, setNotatorSections] = useState<NotatorSection[] | null>(null);

  const stateInUS = useXNGSelector(selectStateInUS);

  useEffect(() => {
    const serviceID = session?.service?.id;
    const startDate = session.meetingDetails?.date;

    if (!(serviceID && startDate)) return;

    fetchNotatorSectionData(serviceID, startDate);
  }, [session]);

  async function fetchNotatorSectionData(serviceID: string, startDate: Date) {
    try {
      const response = await API_STATESNAPSHOTS.v1StateSnapshotsByDateNotatorSectionsGet(
        serviceID,
        stateInUS,
        new Date(),
      );
      const res = await response.notatorSections;
      setNotatorSections(res!);
    } catch (err) {
      throw err;
    }
  }

  return notatorSections;
}
