import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ClientAssignment, DistrictRef, UserResponse } from "../../profile-sdk";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import { ServiceProviderRef } from "../../session-sdk";
import { cookieExists, extractCookieValue } from "../../utils/cookies";

type UserResponseSliceStateType = UserResponse | null;
type RemoveProviderActionPayload = { providerId: string; loggedinUserId: string; state: string };
type AddProviderActionPayload = {
  provider: ServiceProviderRef;
  loggedinUserId: string;
  state: string;
};
const initialState: UserResponseSliceStateType = null;

export const userResponseSlice = createSlice({
  name: "user response",
  initialState: initialState as UserResponseSliceStateType,
  reducers: {
    setUserResponse: (state, action: PayloadAction<UserResponseSliceStateType>) => {
      // console.log("userResponseSlice CHANGED");
      // state = action.payload didn't work, it only worked when I changed to return. Need to look into this more later.
      return action.payload;
    },
    ACTION_addProviderToProxyCaseload: (state, action: { payload: AddProviderActionPayload }) => {
      //ADDING PROVIDER
      const userClientAssignment = state?.clientAssignments?.find((assignment) => {
        if (cookieExists("loggedInUserClientID")) {
          return assignment.client?.id === extractCookieValue("loggedInUserClientID");
        } else {
          return assignment.client?.id === action.payload.loggedinUserId;
        }
      });
      userClientAssignment?.appointingServiceProviders?.push(action.payload.provider);
    },
    ACTION_RemoveProviderFromProxyCaseLoad: (
      state,
      action: { payload: RemoveProviderActionPayload },
    ) => {
      //REMOVING PROVIDER
    },
  },
});

// SELECTORS, used to read state
export function selectUser(state: RootState): UserResponse | null {
  return state.userResponse;
}

export function selectAuthorizedDistricts(state: RootState): DistrictRef[] {
  if (state.userResponse === undefined) return [];

  const res = state.userResponse?.clientAssignments?.find(
    (ca) => ca.client?.id === state.loggedInClient?.id,
  )?.authorizedDistricts;

  return res ?? [];
}

export function selectLoggedInClientAssignment(state: RootState): ClientAssignment {
  const user = state.userResponse;
  const loggedInClientId = state.loggedInClient?.id;
  const clientAssignment = user?.clientAssignments?.find((ca) => {
    if (cookieExists("loggedInUserClientID")) {
      return ca?.client?.id === extractCookieValue("loggedInUserClientID");
    } else {
      return ca?.client?.id === loggedInClientId;
    }
  });
  if (clientAssignment === undefined) throw Error(placeholderForFutureLogErrorText);
  return clientAssignment;
}

// ACTIONS, used to execute logic
export const {
  setUserResponse: setUserResponse,
  ACTION_addProviderToProxyCaseload,
  ACTION_RemoveProviderFromProxyCaseLoad,
} = userResponseSlice.actions;

export default userResponseSlice.reducer;
