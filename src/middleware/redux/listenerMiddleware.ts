import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  ACTION_RemoveProviderFromProxyCaseLoad,
  ACTION_addProviderToProxyCaseload,
  setUserResponse,
} from "../../context/slices/userProfileSlice";
import { PatchClientAssignmentRequest, PostAccessRequest, UserRef } from "../../profile-sdk";
import { RootState } from "../../context/store";
import { API_USERS } from "../../api/api";
import { unpostedSessionsActions } from "../../context/slices/unpostedSessionsSlice";
import { cookieExists, extractCookieValue } from "../../utils/cookies";

const listenerMiddleWare = createListenerMiddleware();

listenerMiddleWare.startListening({
  actionCreator: ACTION_addProviderToProxyCaseload,
  effect: async (action, listerApi) => {
    const state = listerApi.getState() as RootState;
    const userClientAssignment = state.userResponse?.clientAssignments?.find((assignment) => {
      if (cookieExists("loggedInUserClientID")) {
        return assignment.client?.id === extractCookieValue("loggedInUserClientID");
      } else {
        return assignment.client?.id === action.payload.loggedinUserId;
      }
    });
    const appointingServiceProviders = userClientAssignment?.appointingServiceProviders;
    const patchClientAssignmentRequest: PatchClientAssignmentRequest = {
      appointingServiceProviders: appointingServiceProviders,
    };

    await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      state.userResponse?.id || "", // user!.id!,
      action.payload.loggedinUserId, // loggedInClientId!,
      action.payload.state,
      patchClientAssignmentRequest,
    );

    const postAccessRequest: PostAccessRequest = {
      requestedServiceProvider: action.payload.provider,
      requestingUser: {
        id: state.userResponse?.id,
        firstName: state.userResponse?.firstName,
        lastName: state.userResponse?.lastName,
        email: state.userResponse?.emailAddress,
      } as UserRef,
    };
    await API_USERS.v1UsersRequestProxyAccessToPostPost(action.payload.state, postAccessRequest);
  },
});

listenerMiddleWare.startListening({
  actionCreator: ACTION_RemoveProviderFromProxyCaseLoad,
  effect: async (action, listerApi) => {
    const state = listerApi.getState() as RootState;
    const userClientAssignment = state.userResponse?.clientAssignments?.find(
      (assignment) => assignment.client?.id === action.payload.loggedinUserId,
    );

    const proxyCaseload = userClientAssignment?.appointingServiceProviders
      ? [...userClientAssignment?.appointingServiceProviders]
      : [];
    proxyCaseload?.splice(
      proxyCaseload.findIndex((sp) => sp.id === action.payload.providerId),
      1,
    );
    const request: PatchClientAssignmentRequest = {
      appointingServiceProviders: proxyCaseload,
    };
    const response = await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      state.userResponse?.id || "",
      action.payload.loggedinUserId,
      action.payload.state,
      request,
    );

    listerApi.dispatch(setUserResponse(response));
  },
});

listenerMiddleWare.startListening({
  actionCreator: unpostedSessionsActions.setSelectedUnpostedFilterFromMainMenu,
  effect: async (action, listenerApi) => {
    const state = (listenerApi.getState() as RootState).unpostedSessionsSlice;

    if (!state.slimSessionCardsResponse || !state.unpostedSessionsMappedCards) {
      await new Promise<void>((resolve) => {
        const intervalId = setInterval(() => {
          // console.log("checking data");
          const state = (listenerApi.getState() as RootState).unpostedSessionsSlice;
          if (
            state.slimSessionCardsResponse !== undefined &&
            state.unpostedSessionsMappedCards !== undefined
          ) {
            clearInterval(intervalId);
            resolve();
          }
        }, 500);
      });
    }

    listenerApi.dispatch(unpostedSessionsActions.setSelectedUnpostedSessionsFilter(action.payload));
  },
});

export default listenerMiddleWare;
