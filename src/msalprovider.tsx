import "./global.css";
import { AccountInfo, InteractionType } from "@azure/msal-browser";
import { placeholderForFutureLogErrorText } from "./temp/errorText";
import { useEffect, useState } from "react";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { useXNGDispatch, useXNGSelector } from "./context/store";
import { setStateInUs } from "./context/slices/stateInUsSlice";
import { setLoggedInClient } from "./context/slices/loggedInClientSlice";
import { selectUser, setUserResponse } from "./context/slices/userProfileSlice";
import { API_CLIENTS, API_USERS, msalAccount, msalInstance } from "./api/api";
import IfElseBox from "./design/components-dev/if_else_box";
import OnboardingFlowHandler from "./views/registration_flow/flow_handler";
import FullScreenLoadingMessage from "./design/high-level/fullscreen_loading_spinner";
import { CreateUserRequest, StatementType, UserResponse } from "./profile-sdk";
import dayjs from "dayjs";
import TrackedApp from "./App";
import { FourthView } from "./views/registration_flow/user_onboarding/views";
import {
  STATEMENT_ELECTRONIC_SIGNATURE_CONSENT,
  STATEMENT_FERPA_AUTHORIZATION,
  STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION,
} from "./views/registration_flow/user_onboarding/statements";
import { FormFourValues } from "./views/registration_flow/user_onboarding/types";
import SignElectronicSignature, { SignatureData } from "./utils/signElectronicSignature";
import { cookieExists, extractCookieValue } from "./utils/cookies";
import { initializeFeatureFlags } from "./context/slices/featureFlagsSlice";
import { eventEmitter } from "./event_emitter";
import InactiveUserView from "./views/registration_flow/user_onboarding/inactive_user_view";

export function MSALProvider() {
  // STATE
  const [reduxPopulated, setReduxPopulated] = useState<boolean>(false);
  const [showSignatoryVeiw, setShowSignatoryVeiw] = useState(false);
  const [userInactive, setUserInactive] = useState(false);
  const user = useXNGSelector(selectUser);
  const [disable_flow, setDisable_flow] = useState<boolean>(false);
  const [flagsInitialized, setFlagsInitialized] = useState<boolean>(false);
  // HOOKS
  const dispatch = useXNGDispatch();

  /**
   * This effect handles the initialization of feature flags and populates the Redux store,
   * effectively dismissing the loading screens and granting user access to the application.
   * We use an event-driven approach here as `api.ts` is a TypeScript module and operates
   * outside the React lifecycle, preventing the use of React's reactive patterns.
   */
  useEffect(() => {
    function handleApiReady() {
      populateReduxStoreDeprecated(msalAccount!);
      initializeFeatureFlagsAsync();
    }

    eventEmitter.addEventListener("apiReady", handleApiReady);

    return () => {
      eventEmitter.removeEventListener("apiReady", handleApiReady);
    };
  }, []);

  // THIS USE EFFECT HOOK IS STRICTLY FOR DEBUGGING.
  // change the 'debugUnsignedSignature' constant to true to test out what happens
  // WHEN A PROVIDER LOGS IN WITHOUT HAVING ONE OF THEIR STATEMENT TYPES SIGNED.
  const debugUnsignedSignature = false;
  useEffect(() => {
    if (!debugUnsignedSignature) return;
    const unsign = async () => {
      const signatureData: SignatureData = {
        fullName: `${msalAccount?.idTokenClaims?.given_name as string} ${
          msalAccount?.idTokenClaims?.family_name as string
        }`,
        iod: msalAccount?.idTokenClaims?.oid as string,
        ipAddress: "",
        state: msalAccount?.idTokenClaims?.state as string,
      };

      await SignElectronicSignature(
        STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION,
        StatementType.NUMBER_0,
        signatureData,
        true,
      );
      console.log("unsigning... ");
    };

    const timout = setTimeout(() => unsign(), 3000);

    return () => clearTimeout(timout);
  });
  // console.log("USER: ", user);
  async function initializeFeatureFlagsAsync() {
    dispatch(initializeFeatureFlags());
    setFlagsInitialized(true);
  }
  async function populateReduxStoreDeprecated(account: Readonly<AccountInfo>) {
    setReduxPopulated(false);
    // HANDLE POPULATE REDUX STORE

    if (account.idTokenClaims === undefined) throw new Error(placeholderForFutureLogErrorText);

    const _state = account.idTokenClaims.state as string;
    const _oid = account.idTokenClaims.oid;
    const _email = account.idTokenClaims.emails![0] as string;
    const _given_name = account.idTokenClaims.given_name as string;
    const _family_name = account.idTokenClaims.family_name as string;
    const _extension_DoB = dayjs(account.idTokenClaims.extension_DoB as string).toDate();
    if (_oid === undefined) throw new Error(placeholderForFutureLogErrorText);

    // populate state in US
    dispatch(setStateInUs(_state));
    let userResponse: UserResponse | null = null;
    try {
      if (cookieExists("loggedInAsUserID")) {
        const providerID = extractCookieValue("loggedInUserProviderID");
        const clientID = extractCookieValue("loggedInUserClientID");
        userResponse = await API_USERS.v1UsersByServiceProviderGet(providerID, clientID, _state);
        // prevents users from getting stuck on the electronic signature onboarding view
        // until a better method for logging in as another user is implemented
        setDisable_flow(true);
      } else {
        userResponse = await API_USERS.v1UsersIdGet(_oid, _state, _email);
      }
      // console.log("USER MSAL PROVIDER: ", userResponse);
    } catch {
      const newUser: CreateUserRequest = {
        objectId: _oid,
        firstName: _given_name,
        lastName: _family_name,
        email: _email,
        dateOfBirth: _extension_DoB,
      };
      userResponse = await API_USERS.v1UsersPost(_state, newUser);
    }
    // populate setUserResponse
    dispatch(setUserResponse(userResponse));

    if (userResponse.clientAssignments !== null) {
      if (userResponse.clientAssignments!.length > 0) {
        // set to last logged in or zeroth by default
        const authorizedClientIDs =
          userResponse.clientAssignments
            ?.filter((ca) => (ca.authorizedDistricts?.length ?? 0) > 0)
            .map((ca) => ca.client!.id) ?? [];
        const fallbackClientID =
          authorizedClientIDs[0] ?? userResponse.clientAssignments![0].client!.id;
        const loggedInClientID = userResponse.loggedInClientId ?? fallbackClientID;
        if (!loggedInClientID) throw new Error(placeholderForFutureLogErrorText);
        if (loggedInClientID === undefined) throw new Error(placeholderForFutureLogErrorText);
        const loggedInClient = await API_CLIENTS.v1ClientsIdGet(loggedInClientID, _state);

        // populate setLoggedInClient
        dispatch(setLoggedInClient(loggedInClient));

        const clientAssignment = userResponse?.clientAssignments?.find((ca) => {
          return ca.client?.id === loggedInClientID;
        });

        const serviceProvider = clientAssignment?.serviceProviderProfile;

        if (
          userResponse.electronicSignatures &&
          (userResponse.electronicSignatures?.length < 3 ||
            !!userResponse.electronicSignatures.find((signature) => !signature.isSigned)) &&
          !!serviceProvider
        ) {
          setShowSignatoryVeiw(true);
        }
      } else if (
        userResponse.loggedInClientId === null ||
        userResponse.clientAssignments?.length === 0
      ) {
        setUserInactive(true);
      }
    }

    // We thought that this state for Scheduler screen operation  would have to be cached on page load
    // const dropdownOptions: Service[] = [];
    // const ServicesByServiceProviderTypeResponse =
    //   API_STATESNAPSHOTS.v1StateSnapshotsByDateServicesByServiceProviderTypeGet(_state, )
    // dispatch(setServiceDropdownOptions(dropdownOptions));

    setReduxPopulated(true);
  }

  const DISABLE_FLOW = false;

  return disable_flow ? (
    <TrackedApp />
  ) : (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <IfElseBox
          if={userInactive}
          then={<InactiveUserView onLogout={() => msalInstance.logoutRedirect()} />}
          else={
            <IfElseBox
              if={showSignatoryVeiw}
              then={
                <FourthView
                  onValidNext={async (values: FormFourValues) => {
                    // Handle values...

                    const signatureData: SignatureData = {
                      fullName: `${user?.firstName as string} ${user?.lastName as string}`,
                      iod: msalAccount?.idTokenClaims?.oid as string,
                      ipAddress: "",
                      state: msalAccount?.idTokenClaims?.state as string,
                    };
                    try {
                      await SignElectronicSignature(
                        STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION,
                        StatementType.NUMBER_0,
                        signatureData,
                      );
                      await SignElectronicSignature(
                        STATEMENT_FERPA_AUTHORIZATION,
                        StatementType.NUMBER_1,
                        signatureData,
                      );
                      await SignElectronicSignature(
                        STATEMENT_ELECTRONIC_SIGNATURE_CONSENT,
                        StatementType.NUMBER_2,
                        signatureData,
                      );
                      setShowSignatoryVeiw(false);
                    } catch (err) {
                      console.log("UNABLE SIGN ELECTRONIC SIGNATURE: ", err);
                    }
                  }}
                  apiDependentValues={{
                    ferpaAuthorizationStatement: STATEMENT_FERPA_AUTHORIZATION,
                    electronicSignatureConsent: STATEMENT_ELECTRONIC_SIGNATURE_CONSENT,
                    trueAndAccurateDataAuthorization:
                      STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION,
                  }}
                />
              }
              else={
                <IfElseBox
                  if={msalAccount === null}
                  then={<FullScreenLoadingMessage message="Logging you in..." />}
                  else={
                    <IfElseBox
                      if={!(reduxPopulated && flagsInitialized)}
                      then={<FullScreenLoadingMessage message="Gathering info..." />}
                      else={
                        <OnboardingFlowHandler
                          onLogout={() => msalInstance.logoutRedirect()}
                          account={msalAccount!}
                        />
                      }
                    />
                  }
                />
              }
            />
          }
        />
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}
