import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  GetSlimSessionCardsResponse,
  GetUnpostedSessionCountResponse,
  SessionSlimCard,
  StudentRef,
} from "../../session-sdk";
import {
  SelectedUnpostedSessionsFilterType,
  filterObjectType,
} from "../../views/unposted_sessions/types/SelectedUnpostedSessionsFilter";
import UnpostedSessionsCardApiData from "../../views/unposted_sessions/types/UnpostedSessionsCardApiData";

type SelectedUnpostedSessionsFilterPayloadType = Omit<
  SelectedUnpostedSessionsFilterType,
  "sessions" | "sessionCards" | "sessionIndex"
>;

const initialState: {
  unpostedSessionsCountResponse: GetUnpostedSessionCountResponse | undefined;
  selectedUnpostedSessionsFilter: SelectedUnpostedSessionsFilterType;
  slimSessionCardsResponse: GetSlimSessionCardsResponse | undefined;
  unpostedSessionsMappedCards: UnpostedSessionsCardApiData["data"] | undefined;
  refetchUnpostedSessions:boolean;
} = {
  unpostedSessionsCountResponse: undefined,
  selectedUnpostedSessionsFilter: {
    providers: [],
    students: [],
    campuses: [],
    startDate: null,
    endDate: null,
    sessions: [],
    sessionCards:{},
    sessionIndex: 0,
  },
  slimSessionCardsResponse: undefined,
  unpostedSessionsMappedCards: undefined,
  refetchUnpostedSessions: false,
};

const unpostedSessionsSlice = createSlice({
  name: "unpostedSessionsCount",
  initialState,
  reducers: {
    setUnpostedSessionsCount(state, action) {
      state.unpostedSessionsCountResponse = action.payload;
    },
    setSelectedUnpostedSessionsFilter(
      state,
      action: PayloadAction<{
        filter: Partial<SelectedUnpostedSessionsFilterPayloadType>;
        fromMainMenu?: boolean;
      }>,
    ) {
      if (Object.keys(action.payload.filter).includes("providers")) {
        if (action.payload.fromMainMenu) {
          state.selectedUnpostedSessionsFilter.students = [];
          state.selectedUnpostedSessionsFilter.providers = [];
          action.payload.filter.students = [];
          // console.log("from main menu", action.payload.filter.students); // from main menu
        }

        action.payload.filter.providers?.forEach((provider) => {
          const allAddedProviderStudents: StudentRef[] = [];
          const card =
            state.slimSessionCardsResponse?.providerUnpostedSessionsDictionary?.[provider.id];
          if (card) {
            card?.forEach((session) => {
              const students = session?.students;

              students?.forEach((student) => {
                const optionStudent = allAddedProviderStudents.find(
                  (option) => option.id === student?.id,
                );
                if (!optionStudent) {
                  allAddedProviderStudents.push(student);
                }
              });
            });
          }

          // check if provider just got added
          if (!state.selectedUnpostedSessionsFilter.providers?.find((p) => p.id === provider.id)) {
            // console.log("newly added", provider.name); // newly added

            action.payload.filter.students = [
              ...(action.payload.filter.students || []),
              ...(state.selectedUnpostedSessionsFilter.students || []),
            ];
            // console.log("filter.students", action.payload.filter.students); // filter.students

            const nonRepeatedStudents: StudentRef[] = [];
            const providerStudents: StudentRef[] = [];
            if (card) {
              Object.values(card).forEach((session) => {
                const students = session?.students || [];
                students.forEach((student) => {
                  const optionStudent = providerStudents.find(
                    (option) => option.id === student?.id,
                  );
                  if (!optionStudent) {
                    providerStudents.push(student);
                  }
                });
              });
            }

            // console.log("providerStudents", providerStudents); // providerStudents
            providerStudents?.forEach((student) => {
              if (!action.payload.filter?.students?.find((s) => s.id === student.id)) {
                nonRepeatedStudents.push(student);
              }
            });
            // console.log("nonRepeatedStudents", nonRepeatedStudents); // nonRepeatedStudents
            const newSelectedStudents: filterObjectType[] = [
              ...(nonRepeatedStudents?.map((s) => ({
                id: s?.id || "",
                name: `${s.firstName} ${s.lastName}`,
              })) || []),
            ];
            // console.log("newSelectedStudents", newSelectedStudents); // newSelectedStudents
            action.payload.filter.students = [
              ...(action.payload.filter.students || []),
              ...(newSelectedStudents || []),
            ];
            // console.log("all students", action.payload.filter.students); // all students
            // // console.log("all students", filter.students);
          }
        });

        // we removed an item
        if (!action.payload.fromMainMenu) {
          if (
            action.payload.filter.providers &&
            state.selectedUnpostedSessionsFilter.providers &&
            action.payload.filter?.providers?.length <
              state.selectedUnpostedSessionsFilter.providers?.length
          ) {
            const slimCardMappedStudents: StudentRef[] = [];
            // console.log("removed"); // removed
            state.selectedUnpostedSessionsFilter.providers.forEach((provider) => {
              if (!action.payload.filter.providers?.find((p) => p.id === provider.id)) {
                // console.log("removed", provider.name); // removed

                const card =
                  state.slimSessionCardsResponse?.providerUnpostedSessionsDictionary?.[provider.id];
                if (card) {
                  card?.forEach((session) => {
                    const students = session?.students;

                    students?.forEach((student) => {
                      const optionStudent = slimCardMappedStudents.find(
                        (option) => option.id === student?.id,
                      );
                      if (!optionStudent) {
                        slimCardMappedStudents.push(student);
                      }
                    });
                    // check if provider just got added
                  });
                }
                action.payload.filter.students = [
                  ...(state.selectedUnpostedSessionsFilter.students || []),
                ];
                // console.log("old selected filter.students", action.payload.filter.students); // old selected filter.students

                // console.log("providerStudents", slimCardMappedStudents); // providerStudents

                action.payload.filter.students = action.payload.filter.students?.filter(
                  (student) => {
                    const studentToRemove = slimCardMappedStudents.find(
                      (option) => option.id === student?.id,
                    );
                    return !studentToRemove;
                  },
                );
                // console.log("filtered students", action.payload.filter.students); // filtered students
              }
            });
          }
        }
      }

      // create filtered sessions
      const stateBeforeFilteredSessions = {
        ...state.selectedUnpostedSessionsFilter,
        ...action.payload.filter,
      };

      const slimCards = state.unpostedSessionsMappedCards?.slimCards || {};
      const slimKeys = Object.keys(slimCards || {});
      const selectedStudents = stateBeforeFilteredSessions.students;
    //   console.log("mapped cards should be updated: ", slimCards);
      const filteredSessionsCards: {
        [key: string]: SessionSlimCard[];
      } = {};

      stateBeforeFilteredSessions.providers?.forEach((provider) => {
        if (slimKeys.includes(provider.id) && slimCards[provider.id]) {
          filteredSessionsCards[provider.id] = slimCards[provider.id].filter(
            (card) =>
              card.students?.find(
                (student) =>
                  selectedStudents?.find((selectedStudent) => selectedStudent.id === student.id),
              ),
          );
        }
      });

      const filteredSessions = Object.values(filteredSessionsCards).flat();

      let newSessionsIndex = 0;
      if(filteredSessions.length === 0){
        newSessionsIndex = 0;
      }
      else if((state.selectedUnpostedSessionsFilter.sessionIndex || 0) > filteredSessions.length - 1){
        newSessionsIndex = filteredSessions.length - 1;
      }

      // return cards;

      // console.log("action.payload.filter", action.payload.filter); // action.payload.filter

      // const stateBeforeFilteredSessions = {
      //     ...state.selectedUnpostedSessionsFilter,
      //     ...action.payload.filter
      // };

      // const filteredSessions: SessionSlimCard[] | undefined = stateBeforeFilteredSessions.providers?.flatMap((provider) => {
      //     const card = state.slimSessionCardsResponse?.providerUnpostedSessionsDictionary?.[provider.id];
      //     if (card) {
      //         // Filter the sessions based on the students in stateBeforeFilteredSessions
      //         return card.filter((session) => {
      //             const sessionStudents = session.students || [];
      //             return sessionStudents.some((student) => {
      //                 return stateBeforeFilteredSessions.students?.some((selectedStudent) => {
      //                     return selectedStudent.id === student.id;
      //                 });
      //             });
      //         });
      //     }
      //     return [];
      // });

      state.selectedUnpostedSessionsFilter = {
        //         ...state.selectedUnpostedSessionsFilter,
        // ...action.payload.filter,
        ...stateBeforeFilteredSessions,
        sessions: filteredSessions || [],
        sessionCards: filteredSessionsCards,
        sessionIndex: newSessionsIndex,
      };
    },
    setUnpostedSessionsCards(state, action: PayloadAction<GetSlimSessionCardsResponse>) {
      state.slimSessionCardsResponse = action.payload;
    },
    setUnpostedSessionsMappedCards(
      state,
      action: PayloadAction<UnpostedSessionsCardApiData["data"]>,
    ) {
      state.unpostedSessionsMappedCards = action.payload;
    },
    setSelectedUnpostedSessionsFilterSessionIndex(state, action: PayloadAction<{
        incrementValue?: 1 | -1 | undefined;
        sessionId?: string | undefined;
    }>) {
        

        if(action.payload.sessionId){
            const sessionIndex = (state.selectedUnpostedSessionsFilter.sessions || []).findIndex((session) => session.id === action.payload.sessionId);
            if(sessionIndex >= 0){
                state.selectedUnpostedSessionsFilter.sessionIndex = sessionIndex;
            }
        }
        else if(action.payload.incrementValue){
            if((state.selectedUnpostedSessionsFilter.sessionIndex || 0) >= (state.selectedUnpostedSessionsFilter.sessions || []).length - 1 && action.payload.incrementValue > 0){
                state.selectedUnpostedSessionsFilter.sessionIndex = 0;
            }
            else if((state.selectedUnpostedSessionsFilter.sessionIndex || 0) <= 0 && action.payload.incrementValue < 0){
                state.selectedUnpostedSessionsFilter.sessionIndex = (state.selectedUnpostedSessionsFilter.sessions || []).length - 1;
            }
            else{
                state.selectedUnpostedSessionsFilter.sessionIndex = (state.selectedUnpostedSessionsFilter.sessionIndex || 0) + action.payload.incrementValue;
            }
        }
        else{
            state.selectedUnpostedSessionsFilter.sessionIndex = 0;
        }
        
    },
    triggerRefetchUnpostedSessions(state) {
      state.refetchUnpostedSessions = !state.refetchUnpostedSessions;
    },
    setSelectedUnpostedFilterFromMainMenu(state,
      action: PayloadAction<{
        filter: Partial<SelectedUnpostedSessionsFilterPayloadType>;
        fromMainMenu?: boolean;
      }>){
        // setting filter from main menu
      }
  },
});

export const unpostedSessionsActions = unpostedSessionsSlice.actions;

export default unpostedSessionsSlice.reducer;
