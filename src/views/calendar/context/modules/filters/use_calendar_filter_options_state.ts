import { useEffect, useReducer } from "react";
import {
  PatchClientAssignmentRequest,
  ServiceAreaRef,
  ServiceProviderRef,
} from "../../../../../profile-sdk";
import { useXNGSelector } from "../../../../../context/store";
import {
  selectLoggedInClientAssignment,
  selectUser,
} from "../../../../../context/slices/userProfileSlice";
import { StudentRef } from "../../../../../session-sdk";
import { API_USERS } from "../../../../../api/api";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import useEffectSkipMount from "../../../../../hooks/use_effect_after_mount";
import {
  CalendarFilterActionType as ActionType,
  CalendarFilterAction,
  CalendarFilterDispatchers,
  CalendarFilterReducer,
  CalendarFilterState,
} from "./types";

const initialState: CalendarFilterState = {
  selectedServiceAreas: [],
  selectedStudents: [],
  defaultAccountChecked: true,
  selectedAssistantRefs: [],
  fullSelectableAssistantList: [],
  fullSelectableServiceAreaList: [],
  fullSelectableStudentList: [],
  selectedServiceProviderIDs: [],
  selectedServiceProviderRefs: [],
  filtersDependencyArraySpreadable: [],
  sessionName: "",
};

export function useCalendarFilterOptionsReducer(): CalendarFilterReducer {
  const [state, dispatch] = useReducer(filterOptionsReducer, initialState);

  const dispatchers: CalendarFilterDispatchers = {
    setSelectedServiceAreas: (serviceAreas: ServiceAreaRef[]) => {
      if (!serviceAreas) return;

      dispatch({
        type: ActionType.SET_SELECTED_SERVICE_AREAS,
        payload: serviceAreas,
      });
    },
    setSelectedStudents: (students: StudentRef[]) => {
      if (!students) return;

      dispatch({ type: ActionType.SET_SELECTED_STUDENTS, payload: students });
    },
    setSelectedAssistants: (assistantIDs: ServiceProviderRef[]) => {
      if (!assistantIDs) return;

      dispatch({ type: ActionType.SET_SELECTED_ASSISTANT_IDS, payload: assistantIDs });
    },
    setDefaultAccountChecked: (value: boolean) =>
      dispatch({ type: ActionType.SET_DEFAULT_ACCOUNT_CHECKED, payload: value }),
    reset: () => dispatch({ type: ActionType.RESET }),
    // Full List Dispatchers
    setFullSelectableAssistantList: (assistants: ServiceProviderRef[]) => {
      dispatch({ type: ActionType.SET_FULL_SELECTABLE_ASSISTANT_LIST, payload: assistants });
    },
    setFullServiceAreaList: (serviceAreas: ServiceAreaRef[]) => {
      dispatch({ type: ActionType.SET_FULL_SERVICE_AREA_LIST, payload: serviceAreas });
    },
    setFullStudentList: (students: StudentRef[]) => {
      dispatch({ type: ActionType.SET_FULL_STUDENT_LIST, payload: students });
    },
    setSessionName: (v: string) => {
      dispatch({ type: ActionType.SET_SESSION_NAME, payload: v });
    },
  };

  const stateWithConstants: CalendarFilterState = {
    ...state,
    selectedServiceProviderIDs: useSelectedServiceProviderIDs(state),
    selectedServiceProviderRefs: useSelectedServiceProviderRefs(state),
    filtersDependencyArraySpreadable: [
      state.defaultAccountChecked,
      state.selectedAssistantRefs,
      state.selectedServiceAreas,
      state.selectedStudents,
      state.sessionName,
    ],
  };

  const reducer: CalendarFilterReducer = {
    ...stateWithConstants,
    ...dispatchers,
  };

  useFilterLifecycleEffects(reducer);

  return reducer;
}

function filterOptionsReducer(
  state: CalendarFilterState = initialState,
  action: CalendarFilterAction,
): CalendarFilterState {
  switch (action.type) {
    case ActionType.SET_SELECTED_SERVICE_AREAS:
      return { ...state, selectedServiceAreas: action.payload };
    case ActionType.SET_SELECTED_STUDENTS:
      return { ...state, selectedStudents: action.payload };
    case ActionType.SET_SELECTED_ASSISTANT_IDS:
      return { ...state, selectedAssistantRefs: action.payload };
    case ActionType.SET_FULL_SELECTABLE_ASSISTANT_LIST:
      return { ...state, fullSelectableAssistantList: action.payload };
    case ActionType.SET_DEFAULT_ACCOUNT_CHECKED:
      return { ...state, defaultAccountChecked: action.payload };
    case ActionType.SET_FULL_SERVICE_AREA_LIST:
      return { ...state, fullSelectableServiceAreaList: action.payload };
    case ActionType.SET_FULL_STUDENT_LIST:
      return { ...state, fullSelectableStudentList: action.payload };
    case ActionType.SET_SESSION_NAME:
      return { ...state, sessionName: action.payload };
    case ActionType.RESET:
      return {
        ...state,
        defaultAccountChecked: true,
        selectedAssistantRefs: [],
        selectedServiceAreas: [],
        selectedStudents: [],
      };
    default:
      throw new Error(
        "Fallthrough in Calendar switch statement! Has a new filter action been introduced?",
      );
  }
}

/**
 * At any point that data needs to be updated after its blank initialization, please place that here.
 */
function useFilterLifecycleEffects(reducer: CalendarFilterReducer) {
  const clientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const user = useXNGSelector(selectUser);
  const stateInUS = useXNGSelector(selectStateInUS);

  // Persistence Logic: Write
  useEffectSkipMount(() => {
    const req: PatchClientAssignmentRequest = {
      calendarFilters: {
        serviceProviders: reducer.selectedAssistantRefs,
        serviceAreas: reducer.selectedServiceAreas,
        students: reducer.selectedStudents,
        selfIsSelected: reducer.defaultAccountChecked,
      },
    };

    API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      user!.id!,
      clientAssignment.client?.id!,
      stateInUS,
      req,
    );
  }, [...reducer.filtersDependencyArraySpreadable]);

  useEffect(() => {
    reducer.setFullSelectableAssistantList(clientAssignment?.supervisedServiceProviders ?? []);

    // Persistence Logic: Read
    reducer.setSelectedAssistants(clientAssignment.selectedCalendarFilters?.serviceProviders!);
    reducer.setSelectedServiceAreas(clientAssignment.selectedCalendarFilters?.serviceAreas!);
    reducer.setSelectedStudents(clientAssignment.selectedCalendarFilters?.students!);
    reducer.setDefaultAccountChecked(clientAssignment.selectedCalendarFilters?.selfIsSelected!);
  }, []);
}

function useSelectedServiceProviderIDs(state: CalendarFilterState): string[] {
  const assistantIDs = state.selectedAssistantRefs?.map((a) => a.id!);
  const userID = useXNGSelector(selectLoggedInClientAssignment)?.serviceProviderProfile?.id!;

  const res = [...assistantIDs];
  if (state.defaultAccountChecked) {
    res.push(userID);
  }

  return res;
}

function useSelectedServiceProviderRefs(state: CalendarFilterState): ServiceProviderRef[] {
  const res = [...state.selectedAssistantRefs];
  const user = useXNGSelector(selectLoggedInClientAssignment)?.serviceProviderProfile;

  if (state.defaultAccountChecked) {
    res.push(user!);
  }

  return res;
}
