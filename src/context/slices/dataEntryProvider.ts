import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, useXNGSelector } from "../store";
import {
  ServiceProviderRef,
  ServiceProviderResponse,
  ServiceProviderType,
} from "../../profile-sdk";
import { selectLoggedInClientAssignment } from "./userProfileSlice";

type DataEntryProvider = ServiceProviderResponse | null;

export const dataEntryProviderSlice = createSlice({
  name: "data entry provider",
  initialState: null as DataEntryProvider,
  reducers: {
    setDataEntryProvider: (state, action: PayloadAction<DataEntryProvider>) => {
      return action.payload;
    },
  },
});

// SELECTORS, used to read state
export const selectDataEntryProvider = (state: RootState) => {
  return state.dataEntryProvider;
};

export const selectUserIsCurrentlyProxying = (state: RootState) => {
  return Boolean(state.dataEntryProvider);
};

// TODO: Phase out
export const selectUserIsSignedInAsDEP = (state: RootState) => {
  return Boolean(state.dataEntryProvider);
};

export function selectActingServiceProvider(state: RootState): ServiceProviderRef | undefined {
  const clientAssignment = selectLoggedInClientAssignment(state);

  const actingProvider = state.dataEntryProvider ?? clientAssignment.serviceProviderProfile;

  return actingProvider;
}

export function selectActingServiceProviderType(state: RootState): ServiceProviderType | undefined {
  const serviceProviderType =
    state.dataEntryProvider?.serviceProviderType ?? state.userResponse?.serviceProviderType;
  return serviceProviderType;
}
// ACTIONS, used to execute logic
export const { setDataEntryProvider } = dataEntryProviderSlice.actions;

export default dataEntryProviderSlice.reducer;
