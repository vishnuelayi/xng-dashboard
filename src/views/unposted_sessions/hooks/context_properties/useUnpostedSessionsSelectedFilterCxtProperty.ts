import {
  SelectedUnpostedSessionsFilterType,
  // filterObjectType,
} from "../../types/SelectedUnpostedSessionsFilter";
import UnpostedSessionsContextType from "../../types/UnpostedSessionsContextType";
import { useXNGDispatch, useXNGSelector } from "../../../../context/store";
import { unpostedSessionsActions } from "../../../../context/slices/unpostedSessionsSlice";
import { SessionSlimCard } from "../../../../session-sdk";
// import { StudentRef } from "../../../../profile-sdk";


type SelectedUnpostedSessionsFilterPayloadType = Omit<
  SelectedUnpostedSessionsFilterType,
  "sessions" | "sessionCards" | "sessionIndex"
>;
/**
 * A hook that provides the context properties for filtering unposted sessions.
 * @returns An object containing the context properties for filtering unposted sessions.
 */
const useUnpostedSessionsSelectedFilterCxtProperty = (
  slimCards:
    | {
        [key: string]: SessionSlimCard[];
      }
    | undefined,
) => {
  const selectedFilter = useXNGSelector(
    (state) => state.unpostedSessionsSlice.selectedUnpostedSessionsFilter,
  );
  const dispatch = useXNGDispatch();

  /**
   * Updates the selected filter with the provided filter object.
   * @param filter - The filter object to update the selected filter with.
   */
  const updateSelectedFilter = (filter: Partial<SelectedUnpostedSessionsFilterPayloadType>) => {
    // if (Object.keys(filter).includes("providers")) {
    //   filter.providers?.forEach((provider) => {
    //     const allowedStudents: StudentRef[] = [];
    //     const card = slimCards?.[provider.id];
    //     if (card) {
    //       card?.forEach((session) => {
    //         const students = session?.students;

    //         students?.forEach((student) => {
    //           const optionStudent = allowedStudents.find((option) => option.id === student?.id);
    //           if (!optionStudent) {
    //             allowedStudents.push(student);
    //           }
    //         });
    //       });
    //     }
        
    //     // check if provider just got added
    //     if (!selectedFilter.providers?.find((p) => p.id === provider.id)) {
    //       console.log("newly added", provider.name);

    //       filter.students = [...(selectedFilter.students || [])];
    //       console.log("filter.students", filter.students);

    //       const nonRepeatedStudents: StudentRef[] = [];
    //       const providerStudents: StudentRef[] = [];
    //       if (card) {
    //         Object.values(card).forEach((session) => {
    //           const students = session?.students || [];
    //           students.forEach((student) => {
    //             const optionStudent = providerStudents.find((option) => option.id === student?.id);
    //             if (!optionStudent) {
    //               providerStudents.push(student);
    //             }
    //           });
    //         });
    //       }

    //       console.log("providerStudents", providerStudents);
    //       providerStudents?.forEach((student) => {
    //         if (!filter?.students?.find((s) => s.id === student.id)) {
    //           nonRepeatedStudents.push(student);
    //         }
    //       });
    //       console.log("nonRepeatedStudents", nonRepeatedStudents);
    //       const newSelectedStudents: filterObjectType[] = [
    //         ...(nonRepeatedStudents?.map((s) => ({
    //           id: s?.id || "",
    //           name: `${s.firstName} ${s.lastName}`,
    //         })) || []),
    //       ];
    //       console.log("newSelectedStudents", newSelectedStudents);
    //       filter.students = [...(filter.students || []), ...newSelectedStudents];

    //       // // console.log("all students", filter.students);
    //     }
    //   });
     
    //   // we removed an item
    //   if (
    //     filter.providers &&
    //     selectedFilter.providers &&
    //     filter?.providers?.length < selectedFilter.providers?.length
    //   ) {
    //     const slimCardMappedStudents: StudentRef[] = [];
    //     console.log("removed");
    //     selectedFilter.providers.forEach((provider) => {
    //       if (!filter.providers?.find((p) => p.id === provider.id)) {
    //         console.log("removed", provider.name);
    //         const card = slimCards?.[provider.id];
    //         if (card) {
    //           card?.forEach((session) => {
    //             const students = session?.students;

    //             students?.forEach((student) => {
    //               const optionStudent = slimCardMappedStudents.find((option) => option.id === student?.id);
    //               if (!optionStudent) {
    //                 slimCardMappedStudents.push(student);
    //               }
    //             });
    //             // check if provider just got added
    //           });
    //         }
    //         filter.students = [...(selectedFilter.students || [])];
    //         console.log("old selected filter.students", filter.students);

    //         console.log("providerStudents", slimCardMappedStudents); //change this to existing students or something that makes more sense
    //         filter.students = filter.students?.filter((student) => {
    //           const studentToRemove = slimCardMappedStudents.find((option) => option.id === student?.id);
    //           return !studentToRemove;
    //         });
    //         console.log("filtered students", filter.students);

    //       }
    //     });

    //   }
    // }
    dispatch(unpostedSessionsActions.setSelectedUnpostedSessionsFilter({filter}));
  };

  const updateSelectedFilterSessionIndex = (value: -1 | 1 | string) => {
    dispatch(unpostedSessionsActions.setSelectedUnpostedSessionsFilterSessionIndex({
      incrementValue: typeof value === "number" ? value : undefined,
      sessionId: typeof value === "string" ? value : undefined,
    }));
  }

  // Context object for unposted sessions filter
  const filterCtx: UnpostedSessionsContextType["selectedFilterData"] = {
    selectedFilter,
    setSelectedFilter: updateSelectedFilter,
    updateSelectedFilterSessionIndex
  };

  return filterCtx;
};

export default useUnpostedSessionsSelectedFilterCxtProperty;
