import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  ClientAssignment,
  ClientRef,
  ClientResponse,
  ServiceProviderResponse,
} from "../../profile-sdk";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { cookieExists, extractCookieValue } from "../../utils/cookies";

export type LoggedInClientSliceStateType = ClientResponse | null;

const initialState: LoggedInClientSliceStateType = null;

export const loggedInClientSlice = createSlice({
  name: "logged in client",
  initialState: initialState as LoggedInClientSliceStateType,
  reducers: {
    setLoggedInClient: (state, action: PayloadAction<LoggedInClientSliceStateType>) => {
      return action.payload;
    },
  },
});

// SELECTORS, used to read state
export const selectClientID = (state: RootState) => {
  const loggedInUserClientIDCookie = cookieExists("loggedInUserClientID")
    ? extractCookieValue("loggedInUserClientID")
    : "";
  return loggedInUserClientIDCookie || state.loggedInClient?.id;
};
export function selectClient(state: RootState): ClientResponse | null {
  return state.loggedInClient;
}

// If undefined, user hasn't completed onboarding flow
export function selectServiceProviderProfile(
  state: RootState,
): ServiceProviderResponse | undefined {
  const clientAssignment: ClientAssignment | undefined =
    state.userResponse?.clientAssignments?.find((ca) => {
      return ca.client?.id === state.loggedInClient?.id;
    });

  const res = clientAssignment?.serviceProviderProfile;

  return res;
}

// ACTIONS, used to execute logic
export const { setLoggedInClient: setLoggedInClient } = loggedInClientSlice.actions;

export default loggedInClientSlice.reducer;
