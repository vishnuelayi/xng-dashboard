import { ServiceAreaRef, ServiceProviderRef } from "../../../../../profile-sdk";
import { StudentRef } from "../../../../../session-sdk";

/// ------ IMMUTABLE STATE DEFINITION ------ ///

interface CalendarFilterStateMutable {
  fullSelectableAssistantList: ServiceProviderRef[];
  fullSelectableServiceAreaList: ServiceAreaRef[];
  fullSelectableStudentList: StudentRef[];
  defaultAccountChecked: boolean;
  selectedAssistantRefs: ServiceProviderRef[];
  selectedServiceAreas: ServiceAreaRef[];
  selectedStudents: StudentRef[];
  sessionName: string;
}

interface CalendarFilterStateCalculated {
  selectedServiceProviderIDs: string[];
  selectedServiceProviderRefs: ServiceProviderRef[];
  filtersDependencyArraySpreadable: any[];
}

/// ------ ACTION CONTRACTS ------ ///

interface CalendarFilterActionBase {
  type: CalendarFilterActionType;
}

interface SetSelectedServiceAreasAction extends CalendarFilterActionBase {
  type: CalendarFilterActionType.SET_SELECTED_SERVICE_AREAS;
  payload: ServiceAreaRef[];
}
interface SetSelectedStudentsAction extends CalendarFilterActionBase {
  type: CalendarFilterActionType.SET_SELECTED_STUDENTS;
  payload: StudentRef[];
}
interface SetSelectedAssistantIDsAction extends CalendarFilterActionBase {
  type: CalendarFilterActionType.SET_SELECTED_ASSISTANT_IDS;
  payload: ServiceProviderRef[];
}
interface SetFullSelectableAssistantListAction extends CalendarFilterActionBase {
  type: CalendarFilterActionType.SET_FULL_SELECTABLE_ASSISTANT_LIST;
  payload: ServiceProviderRef[];
}
interface SetFullServiceAreaListAction extends CalendarFilterActionBase {
  type: CalendarFilterActionType.SET_FULL_SERVICE_AREA_LIST;
  payload: ServiceAreaRef[];
}
interface SetFullStudentListAction extends CalendarFilterActionBase {
  type: CalendarFilterActionType.SET_FULL_STUDENT_LIST;
  payload: StudentRef[];
}
interface SetDefaultAccountCheckedAction extends CalendarFilterActionBase {
  type: CalendarFilterActionType.SET_DEFAULT_ACCOUNT_CHECKED;
  payload: boolean;
}
interface ResetAction extends CalendarFilterActionBase {
  type: CalendarFilterActionType.RESET;
}
interface SetSessionName extends CalendarFilterActionBase {
  type: CalendarFilterActionType.SET_SESSION_NAME;
  payload: string;
}

/// ------ EXPORTS ------ ///

export enum CalendarFilterActionType {
  SET_FULL_SELECTABLE_ASSISTANT_LIST,
  SET_FULL_SERVICE_AREA_LIST,
  SET_FULL_STUDENT_LIST,
  SET_SELECTED_SERVICE_PROVIDERS,
  SET_SELECTED_SERVICE_AREAS,
  SET_SELECTED_STUDENTS,
  SET_SELECTED_ASSISTANT_IDS,
  SET_DEFAULT_ACCOUNT_CHECKED,
  RESET,
  SET_SESSION_NAME,
}
export type CalendarFilterAction =
  | SetSelectedServiceAreasAction
  | SetSelectedStudentsAction
  | SetSelectedAssistantIDsAction
  | SetDefaultAccountCheckedAction
  | ResetAction
  | SetFullSelectableAssistantListAction
  | SetFullServiceAreaListAction
  | SetFullStudentListAction
  | SetSessionName;

export interface CalendarFilterDispatchers {
  setFullSelectableAssistantList: (assistants: ServiceProviderRef[]) => void;
  setFullServiceAreaList: (serviceAreas: ServiceAreaRef[]) => void;
  setFullStudentList: (students: StudentRef[]) => void;
  setSelectedServiceAreas: (serviceAreas: ServiceAreaRef[]) => void;
  setSelectedStudents: (students: StudentRef[]) => void;
  setSelectedAssistants: (assistantIDs: ServiceProviderRef[]) => void;
  setDefaultAccountChecked: (v: boolean) => void;
  setSessionName: (v: string) => void;
  reset: () => void;
}

export type CalendarFilterState = CalendarFilterStateMutable & CalendarFilterStateCalculated;
export type CalendarFilterReducer = CalendarFilterDispatchers & CalendarFilterState;
