import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import displayThemeReducer from "./slices/displayThemeSlice";
import sidebarReducer from "./slices/sidebarSlice";
import userProfileReducer from "./slices/userProfileSlice";
import loggedInClientReducer from "./slices/loggedInClientSlice";
import stateInUsReducer from "./slices/stateInUsSlice";
import studentsReducer from "./slices/studentsSlice";
import actingServiceProviderReducer from "./slices/dataEntryProvider";
import refreshSwitchReducer from "./slices/refreshSwitch";
import studentDocumentationSlice from "./slices/studentDocumentationSlice";
import providerNotFoundErrorSlice from "./slices/providerNotFoundErrorSlice";
import forceAccountRegistrationSlice from "./slices/forceAccountRegistrationSlice";
import listenerMiddleWare from "../middleware/redux/listenerMiddleware";
import thankYouModalSlice from "./slices/thankYouModalSlice";
import removeProviderConfirmationModalSlice from "./slices/removeProviderConfirmationModalSlice";
import SimpleAttentionMessageSlice from "./slices/SimpleAttentionMessageSlice";
import unpostedSessionsSlice from "./slices/unpostedSessionsSlice";
import calendarViewModeSlice from "./slices/calendarViewModeSlice";
import featureFlagsReducer from "./slices/featureFlagsSlice";

// ------------ taken from old hooks file to keep the Redux logic together, here: -------------
// note from devs: Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useXNGDispatch = () => useDispatch<AppDispatch>();
export const useXNGSelector: TypedUseSelectorHook<RootState> = useSelector;
// --------------------------------------------------------------------------------------------

export const store = configureStore({
  reducer: {
    displayTheme: displayThemeReducer,
    sidebar: sidebarReducer,
    dataEntryProvider: actingServiceProviderReducer,
    userResponse: userProfileReducer,
    loggedInClient: loggedInClientReducer,
    stateInUs: stateInUsReducer,
    studentsReducer: studentsReducer,
    refreshSwitchReducer: refreshSwitchReducer,
    studentDocumentationSlice,
    providerNotFoundErrorSlice,
    forceAccountRegistrationSlice,
    thankYouModalSlice,
    removeProviderConfirmationModalSlice,
    SimpleAttentionMessageSlice,
    unpostedSessionsSlice,
    calendarViewModeSlice,
    featureFlags: featureFlagsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleWare.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
