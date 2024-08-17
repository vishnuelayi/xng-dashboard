import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useXNGDispatch, useXNGSelector } from "../../../../../context/store";
import {
  ACTION_RemoveProviderFromProxyCaseLoad,
  ACTION_addProviderToProxyCaseload,
  selectLoggedInClientAssignment,
  selectUser,
  setUserResponse,
} from "../../../../../context/slices/userProfileSlice";
import Box from "../../../../components-dev/BoxExtended";
import { getSizing } from "../../../../sizing";
import { XNGUserCard_0 } from "./UserCard";
import {
  PatchClientAssignmentRequest,
  PostAccessRequest,
  ServiceProviderCaseloadOption,
  ServiceProviderRef,
  UserRef,
} from "../../../../../profile-sdk";
import { DataEntryProviderControl } from "./DataEntryProviderControl";
import { AddAnotherProvider } from "./AddAnotherProvider";
import {
  selectDataEntryProvider,
  setDataEntryProvider,
} from "../../../../../context/slices/dataEntryProvider";
import { AssistantProviderControl } from "./AssistantProviderControl";
import { CreateNewProvider } from "../../modals/CreateServiceProviderToCaseLoadModal";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import { selectClientID } from "../../../../../context/slices/loggedInClientSlice";
import { API_SERVICEPROVIDERS, API_USERS } from "../../../../../api/api";
import { providerNotFoundErrorActions } from "../../../../../context/slices/providerNotFoundErrorSlice";
import { placeholderForFutureLogErrorText } from "../../../../../temp/errorText";
import { ACTION_toggleRefreshSwitch } from "../../../../../context/slices/refreshSwitch";
import { MainMenuV1 } from "../_main_menu_components";
import { AddServiceProviderToCaseloadModal } from "../../modals/AddServiceProviderToCaseloadModal";
import { SingleActionModal } from "../../../../modal_templates/single_action";
import { XNGICONS, XNGIconRenderer } from "../../../../icons";

import usePalette from "../../../../../hooks/usePalette";

import { useDispatch } from "react-redux";
import { thankYouModalActions } from "../../../../../context/slices/thankYouModalSlice";
import { removeProvderConfirmationModalAction } from "../../../../../context/slices/removeProviderConfirmationModalSlice";

export default function ProfileSlideContent() {
  // Hooks
  const user = useXNGSelector(selectUser);
  const dispatch = useXNGDispatch();
  const serviceProviderOptions = useCaseloadServiceProviders();
  const {
    setActiveProvider,
    removeProviderFromApproverCaseload,
    addProviderToProxyCaseload,
    addProviderToApproverCaseload,
    removeProviderFromProxyCaseload,
    decRequestPostAccess,
  } = useProfileMenuActions();

  // States
  const [showAddToProxyCaseloadModal, setShowAddToProxyCaseloadModal] = useState<boolean>(false);
  const [showAddToApproverCaseloadModal, setShowAddToApproverCaseloadModal] =
    useState<boolean>(false);
  const [showCreateNewProvider, setShowCreateNewProvider] = useState<boolean>(false);
  const [dataTrue, setDataTrue] = useState<boolean>(false);

  // Selectors
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const signedInDataEntryProvider = useXNGSelector(selectDataEntryProvider);

  return (
    <MainMenuV1.Wrapper>
      <Typography sx={{ marginLeft: getSizing(2), marginY: getSizing(2) }} variant="h6">
        My Profile
      </Typography>
      <Typography sx={{ marginLeft: getSizing(2) }} variant="overline">
        ACCOUNT
      </Typography>
      <XNGUserCard_0
        user={{
          email: user?.emailAddress!,
          firstName: user?.firstName!,
          lastName: user?.lastName!,
        }}
        useNavigationPath={{ path: "/xlogs/my-profile" }}
      />
      {userClientAssignment.isProxyDataEntry ? (
        <>
          <ProxyCaseloadManager
            appointingServiceProviders={userClientAssignment?.appointingServiceProviders ?? []}
            signedInServiceProvider={signedInDataEntryProvider ?? {}}
            onRemove={(serviceProviderId) => removeProviderFromProxyCaseload(serviceProviderId)}
            onSignIn={(serviceProviderId) => setActiveProvider(serviceProviderId)}
            onSignOut={() => dispatch(setDataEntryProvider(null))}
            showAddProxyCaseloadProviderModal={() => setShowAddToProxyCaseloadModal(true)}
            onRequestAccess={decRequestPostAccess}
          />
          <AddServiceProviderToCaseloadModal
            setDataTrue={setDataTrue}
            addButtonText="Request Access"
            handleAdd={(serviceProvider: ServiceProviderRef | undefined) =>
              addProviderToProxyCaseload(serviceProvider)
            }
            setShowAddToCaseloadModal={(show: boolean) => setShowAddToProxyCaseloadModal(show)}
            showAddToCaseloadModal={showAddToProxyCaseloadModal}
            serviceProviderOptions={serviceProviderOptions.filter(
              (provider) =>
                !userClientAssignment.appointingServiceProviders?.find(
                  (DEProvider) => DEProvider.id === provider.id,
                ),
            )}
            setShowCreateNewProvider={(show: boolean) => setShowCreateNewProvider(show)}
            showCreateNewProvider={showCreateNewProvider}
          />
        </>
      ) : (
        <></>
      )}
      {userClientAssignment.isApprover ? (
        <>
          <ApproverCaseloadManager
            supervisedServiceProviders={userClientAssignment?.supervisedServiceProviders ?? []}
            onRemove={(serviceProviderId) => removeProviderFromApproverCaseload(serviceProviderId)}
            showAddApproverCaseloadProviderModal={() => {
              setShowAddToApproverCaseloadModal(true);
            }}
          />
          <AddServiceProviderToCaseloadModal
            setDataTrue={() => {}}
            addButtonText="Add Provider"
            handleAdd={(serviceProvider: ServiceProviderRef | undefined) =>
              addProviderToApproverCaseload(serviceProvider)
            }
            setShowAddToCaseloadModal={(show: boolean) => setShowAddToApproverCaseloadModal(show)}
            showAddToCaseloadModal={showAddToApproverCaseloadModal}
            serviceProviderOptions={serviceProviderOptions.filter(
              (provider) =>
                !userClientAssignment.supervisedServiceProviders?.find(
                  (assistant) => assistant.id === provider.id,
                ),
            )}
            setShowCreateNewProvider={(show: boolean) => setShowCreateNewProvider(show)}
            showCreateNewProvider={showCreateNewProvider}
          />
          <CreateNewProvider
            addProviderToApproverCaseload={addProviderToApproverCaseload}
            dataTrue={dataTrue}
            addProviderToProxyCaseload={addProviderToApproverCaseload}
            open={showCreateNewProvider}
            handleClose={() => setShowCreateNewProvider(false)}
          />
        </>
      ) : (
        <></>
      )}
    </MainMenuV1.Wrapper>
  );
}

// ------------ GLOBAL-COMPATIBLE API HOOKS, SEPARATE FROM FILE LATER ------------

function useCaseloadServiceProviders() {
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);

  const [serviceProviderOptions, setServiceProviderOptions] = useState<
    ServiceProviderCaseloadOption[]
  >([]);

  async function fetchAndSetCaseloadServiceProviders() {
    try {
      const response =
        await API_SERVICEPROVIDERS.v1ServiceProvidersGetAllServiceProvidersInCampusesGet(
          loggedInClientId!,
          state,
        );
      const serviceProviders = response.serviceProviderCaseloadOptions;
      setServiceProviderOptions(serviceProviders ?? []);
    } catch (e) {
      throw e;
    }
  }

  useEffect(() => {
    fetchAndSetCaseloadServiceProviders();
  }, []);

  return serviceProviderOptions;
}

// I'm not sure which of these can be made into global, reusable API hooks and which are contextual
// only to this file, so for now I'll organize it in this hook to make refactoring it easier later.
export function useProfileMenuActions() {
  const dispatch = useXNGDispatch();
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);
  const user = useXNGSelector(selectUser);
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  async function setActiveProvider(serviceProviderId: string) {
    // TODO: This function should set the ActingServiceProvider redux variable to the
    try {
      const serviceProvider = await API_SERVICEPROVIDERS.v1ServiceProvidersIdGet(
        serviceProviderId,
        loggedInClientId!,
        state,
      );
      // Redux variable for ActingServiceProvider should be set to serviceProvider.
      dispatch(setDataEntryProvider(serviceProvider));
    } catch (err) {
      dispatch(
        providerNotFoundErrorActions.ACTION_ShowProviderNotFound({
          show: true,
          errorMsg: (err as Error).message,
        }),
      );
    }
  }

  async function removeProviderFromApproverCaseload(serviceProviderId: string) {
    const a = userClientAssignment.supervisedServiceProviders;
    if (a === undefined) throw new Error(placeholderForFutureLogErrorText);
    const approverCaseload = a.filter((sp) => sp.id !== serviceProviderId);

    const request: PatchClientAssignmentRequest = {
      supervisedServiceProviders: approverCaseload,
    };
    const response = await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      user!.id!,
      loggedInClientId!,
      state,
      request,
    );
    dispatch(setUserResponse(response));
    dispatch(
      thankYouModalActions.ACTION_ShowThankyouModal({
        show: true,
        text: `This provider has been removed from \nyour profile.`,
      }),
    );
  }

  async function addProviderToProxyCaseload(serviceProvider: ServiceProviderRef | undefined) {
    if (!serviceProvider) return;
    //Patch users ClientAssignment to add ServiceProviderRef to user.AppointingServiceProviders
    dispatch(
      ACTION_addProviderToProxyCaseload({
        loggedinUserId: loggedInClientId || "",
        provider: serviceProvider,
        state,
      }),
    );
    dispatch(
      thankYouModalActions.ACTION_ShowThankyouModal({
        show: true,
        text: `You can now access ${serviceProvider.firstName} ${serviceProvider.lastName}'s account 
    by navigating to “My Profile” in the 
    navigation bar. Access to post in their 
    account has been requested.`,
      }),
    );
  }

  async function addProviderToApproverCaseload(serviceProvider: ServiceProviderRef | undefined) {
    if (!serviceProvider) return;
    //Patch users ClientAssignment to add ServiceProviderRef to user.SupervisedServiceProviders
    const supervisedServiceProviders = userClientAssignment.supervisedServiceProviders ?? [];
    const newSupervisedServiceProviders = [...supervisedServiceProviders, serviceProvider];
    const patchClientAssignmentRequest: PatchClientAssignmentRequest = {
      supervisedServiceProviders: newSupervisedServiceProviders,
    };
    await API_USERS.v1UsersIdClientAssignmentsClientIdPatch(
      user!.id!,
      loggedInClientId!,
      state,
      patchClientAssignmentRequest,
    );

    dispatch(ACTION_toggleRefreshSwitch());
    dispatch(
      thankYouModalActions.ACTION_ShowThankyouModal({
        show: true,
        text: `You can now access ${serviceProvider.firstName} ${serviceProvider.lastName}'s account 
    by navigating to “My Profile” in the 
    navigation bar.`,
      }),
    );
  }

  async function removeProviderFromProxyCaseload(serviceProviderId: string) {
    dispatch(
      ACTION_RemoveProviderFromProxyCaseLoad({
        loggedinUserId: loggedInClientId || "",
        providerId: serviceProviderId,
        state,
      }),
    );
    dispatch(
      thankYouModalActions.ACTION_ShowThankyouModal({
        show: true,
        text: `This provider has been removed from \nyour profile.`,
      }),
    );
  }

  async function decRequestPostAccess(requestedServiceProvider: ServiceProviderRef) {
    try {
      const postAccessRequestBody: PostAccessRequest = {
        requestedServiceProvider,
        requestingUser: {
          id: user?.id,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.emailAddress,
        } as UserRef,
      };
      const postAccessResponse = await API_USERS.v1UsersRequestProxyAccessToPostPost(
        state,
        postAccessRequestBody,
      );
      dispatch(
        thankYouModalActions.ACTION_ShowThankyouModal({
          show: true,
          text: `Access to post in ${requestedServiceProvider.firstName} ${requestedServiceProvider.lastName}'s account \nhas been re-requested.`,
        }),
      );
      return postAccessResponse;
    } catch (err) {
      console.log("XNG Error - dec request Access Method: ", (err as Error).message);
      console.error("XNG Error - dec request Access Method: ", (err as Error).message);
    }
  }

  return {
    setActiveProvider,
    removeProviderFromApproverCaseload,
    addProviderToProxyCaseload,
    addProviderToApproverCaseload,
    removeProviderFromProxyCaseload,
    decRequestPostAccess,
  };
}

// Local artifact components, organized down here to clear things up. Can likely be separated from the file into the root of this folder, /my-profile 8/11/23

interface IProxyCaseloadManager {
  appointingServiceProviders: ServiceProviderRef[];
  signedInServiceProvider: ServiceProviderRef;
  onRemove: (serviceProviderId: string) => void;
  onSignIn: (serviceProviderId: string) => void;
  onRequestAccess: (requestedProvider: ServiceProviderRef) => void;
  onSignOut: () => void;
  showAddProxyCaseloadProviderModal: () => void;
}
function ProxyCaseloadManager(props: IProxyCaseloadManager) {
  const dispatch = useDispatch();
  return (
    <>
      <Typography sx={{ marginLeft: getSizing(2) }} variant="overline">
        DATA ENTRY PROVIDERS
      </Typography>
      {props.appointingServiceProviders?.map((asp) => {
        return (
          <DataEntryProviderControl
            key={asp.id}
            firstName={asp?.firstName ?? ""}
            lastName={asp?.lastName ?? ""}
            email={asp?.email ?? ""}
            onSignIn={() => props.onSignIn(asp.id!)}
            onSignOut={() => props.onSignOut()}
            signedIn={props.signedInServiceProvider.id === asp.id}
            onRequestAccess={() => props.onRequestAccess(asp)}
            onRemove={() => {
              dispatch(
                removeProvderConfirmationModalAction.ACTION_ShowModal({
                  show: true,
                  confirmationData: {
                    confirmationText: `Are you sure you would like to remove \n${asp?.firstName} ${asp?.lastName} from your profile?`,
                    providerInformation: {
                      providerId: asp.id || "",
                      caseloadType: "proxyCaseload",
                    },
                  },
                }),
              );
            }}
          />
        );
      })}
      <AddAnotherProvider showModal={() => props.showAddProxyCaseloadProviderModal()} />
    </>
  );
}

interface IApproverCaseloadManager {
  supervisedServiceProviders: ServiceProviderRef[];
  onRemove: (serviceProviderId: string) => void;
  showAddApproverCaseloadProviderModal: () => void;
}
function ApproverCaseloadManager(props: IApproverCaseloadManager) {
  const dispatch = useXNGDispatch();
  return (
    <>
      <Typography sx={{ marginLeft: getSizing(2) }} variant="overline">
        ASSISTANTS
      </Typography>
      {props.supervisedServiceProviders?.map((asp) => {
        return (
          <AssistantProviderControl
            firstName={asp?.firstName ?? "NULL"}
            lastName={asp?.lastName ?? "NULL"}
            email={asp?.email ?? ""}
            onRemove={() => {
              dispatch(
                removeProvderConfirmationModalAction.ACTION_ShowModal({
                  show: true,
                  confirmationData: {
                    confirmationText: `Are you sure you would like to remove \n${asp?.firstName} ${asp?.lastName} from your profile?`,
                    providerInformation: {
                      providerId: asp.id || "",
                      caseloadType: "approverCaseload",
                    },
                  },
                }),
              );
            }}
          />
        );
      })}
      <AddAnotherProvider showModal={() => props.showAddApproverCaseloadProviderModal()} />
    </>
  );
}
