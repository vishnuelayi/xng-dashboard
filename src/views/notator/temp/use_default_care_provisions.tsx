import { useEffect, useState } from "react";
import { selectClientID } from "../../../context/slices/loggedInClientSlice";
import { selectStateInUS } from "../../../context/slices/stateInUsSlice";
import { useXNGSelector } from "../../../context/store";
import { NotatorTabViewportProps } from "../layouts/tab_viewport";
import dayjs from "dayjs";
import { API_STUDENTS } from "../../../api/api";
import { useNotatorTools } from "../tools";
import { AllStudentViewportProps } from "../layouts/all_students_layout/components/student_accordion";

/**
 NOTE: This section is commonly referred to as the "filter module". This section is what is currently responsible for populating the
 default care provisions  for activities, accommodations, and modifications. This was created out of necessity under a tight deadline,
 and will be removed in a later refactor to instead internally derive defaults within the GenericCareProvisionListRenderer module.
 */
export default function useTemporaryDefaultCareProvisionLists(
  props: NotatorTabViewportProps | AllStudentViewportProps,
) {
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);

  const notatorTools = useNotatorTools();

  useEffect(() => {
    getPrescribedCareProvisions();
  }, [notatorTools.selectedStudentIndex]);

  const [defaultActivities, setDefaultActivities] = useState<string[] | undefined>([]);
  const [defaultAccommodations, setStudentAccommodationOptions] = useState<string[] | undefined>(
    [],
  );
  const [defaultModifications, setStudentModificationOptions] = useState<string[] | undefined>([]);

  async function getPrescribedCareProvisions() {
    if (notatorTools.draftSession.studentJournalList === undefined) return;
    const studentJournal =
      notatorTools.draftSession.studentJournalList[notatorTools.selectedStudentIndex];
    const student = studentJournal.student;
    let studentId = student?.id!;
    let sessionDate = dayjs(notatorTools.draftSession.meetingDetails?.date).toDate();

    const response = await API_STUDENTS.v1StudentsIdPrescribedCareProvisionsByDateGet(
      studentId,
      loggedInClientId!,
      state,
      sessionDate,
    );

    const activityOptions = props.defaultCareProvisions.activities?.map((a) => a.name!) ?? [];
    const prescribedActivitiesNotAlreadyIncluded =
      response.activities
        ?.map((a) => a.name!)
        ?.filter((a) => !activityOptions.some((ao) => ao === a)) ?? [];

    activityOptions?.push(...prescribedActivitiesNotAlreadyIncluded);

    // The filter on the following line should not be necessary, but since activities were incorrectly populated with increments = 0, adding this filter to avoid unexpected behavior.
    const selectedActivities =
      studentJournal.careProvisionLedger?.activities
        ?.filter((a) => (a.increments ?? 0) > 0)
        .map((a) => a.name!) ?? [];
    const selectedActsNotAlreadyIncluded = selectedActivities.filter(
      (sa) => activityOptions.findIndex((ao) => ao === sa) === -1,
    );
    activityOptions?.push(...selectedActsNotAlreadyIncluded);

    // The filter on the following line should not be necessary, but since accommodations were incorrectly populated with increments = 0, adding this filter to avoid unexpected behavior.
    const accommodationOptions = props.defaultCareProvisions.accommodations ?? [];
    const prescribedAccommodationsNotAlreadyIncluded =
      response.accommodations
        ?.map((a) => a.name!)
        .filter((a) => !accommodationOptions.some((ao) => ao === a)) ?? [];
    accommodationOptions?.push(...prescribedAccommodationsNotAlreadyIncluded);

    const selectedAccommodations =
      studentJournal.careProvisionLedger?.accommodations
        ?.filter((a) => (a.increments ?? 0) > 0)
        .map((a) => a.name!) ?? [];
    const selectedAccsNotAlreadyIncluded = selectedAccommodations.filter(
      (sa) => accommodationOptions.findIndex((ao) => ao === sa) === -1,
    );
    accommodationOptions?.push(...selectedAccsNotAlreadyIncluded);

    // The filter on the following line should not be necessary, but since modifications were incorrectly populated with increments = 0, adding this filter to avoid unexpected behavior.
    const modificationOptions = props.defaultCareProvisions.modifications ?? [];
    const prescribedModificationsNotAlreadyIncluded =
      response.modifications
        ?.map((m) => m.name!)
        .filter((m) => !modificationOptions.some((mo) => mo === m)) ?? [];
    modificationOptions?.push(...prescribedModificationsNotAlreadyIncluded);

    const selectedModifications =
      studentJournal.careProvisionLedger?.modifications
        ?.filter((m) => (m.increments ?? 0) > 0)
        .map((m) => m.name!) ?? [];
    const selectedModsNotAlreadyIncluded = selectedModifications.filter(
      (sm) => modificationOptions.findIndex((mo) => mo === sm) === -1,
    );
    modificationOptions?.push(...selectedModsNotAlreadyIncluded);

    const HOTFIX_activitiesOptionsWithoutCustomsIfAny = activityOptions.filter((ao) => {
      const isCustom =
        notatorTools.session.sessionJournal?.customCareProvisionLedger!.activities!.includes(ao);
      return !isCustom;
    });
    setDefaultActivities(HOTFIX_activitiesOptionsWithoutCustomsIfAny);
    setStudentAccommodationOptions(accommodationOptions);
    setStudentModificationOptions(modificationOptions);
  }

  return { defaultActivities, defaultAccommodations, defaultModifications };
}
