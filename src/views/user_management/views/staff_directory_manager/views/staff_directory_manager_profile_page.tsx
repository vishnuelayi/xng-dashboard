import { Box, Skeleton, Typography } from "@mui/material";
import UserManagementTabs from "../../../components/user_management_tabs";
import GeneralInfoTabContent from "../components/containers/tabs_content/general_info_tab_content";
import DistrictAccessTabContent from "../components/containers/tabs_content/district_access_tab_content";
import MedicaidInfoTabContent from "../components/containers/tabs_content/medicaid_info_tab_content";
import CaseLoadInformationTabContent from "../components/containers/tabs_content/case_load_information_tab_content";
import TrainingInformationTabContent from "../components/containers/tabs_content/training_information_tab_content";
import { Navigate, useParams } from "react-router";
import { ROUTES_XLOGS } from "../../../../../constants/URLs";
import useUserManagementContext from "../../../hooks/context/use_user_management_context";
import React from "react";
import removeArrayDuplicates from "../../../../../utils/remove_array_duplicates";
import SkeletonTabContent from "../components/presentational/feedback/skeleton_tab_content";
import useFeedbackModal from "../../../../../hooks/use_feedback_modal";
import STAFF_DIRECTORY_LOCAL_STORAGE_KEYS from "../constants/staff_directory_local_storage_keys";
import PostedSessionsTabContent from "../components/containers/tabs_content/posted_sessions_tab_content";
import { useXNGSelector } from "../../../../../context/store";
import useApiQueryUserByServiceProviderAndUserId from "../../../../../api/hooks/service_provider/use_api_query_user_by_service_provider_and_user_id";
import useApiQueryServiceProviderById from "../../../../../api/hooks/service_provider/use_api_query_service_provider_by_id";
import useStaffDirectoryHomePageContext from "../hooks/context/use_staff_directory_home_page_context";
// import UserEditDataTabContent from "../components/containers/tabs_content/user_edit_data_tab_content";

const StaffDirectoryManagerProfilePage = () => {
  const stateInUs = useUserManagementContext().store.userManagementData.stateInUs;
  const clientId = useUserManagementContext().store.userManagementData.client?.id;
  const userId = useUserManagementContext().store.userManagementData.user?.id;
  const refetchStaffDirectory = useStaffDirectoryHomePageContext().apiQueryStaffDirectory.refetch;
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const param = useParams();
  const providerInfoId: string = React.useMemo(() => {
    return param.provider_info_id || "";
  }, [param.provider_info_id]);

  const {
    data: serviceProvider,
    status: serviceProviderRequestStatus,
    refetch: refetchServiceProvider,
  } = useApiQueryServiceProviderById({
    queryParams: {
      providerId: providerInfoId,
      clientId,
      state: stateInUs,
    },
  });

  const {
    data: serviceProviderUserProfile,
    status: serviceProviderUserProfileStatus,
    refetch: refetchUserProfile,
  } = useApiQueryUserByServiceProviderAndUserId({
    queryParams: {
      serviceProviderId: providerInfoId,
      clientId,
      state: stateInUs,
    },
  });

  const adminClientAssignments =
    useUserManagementContext().store.userManagementData.user?.clientAssignments;

  const { onFailedSave } = useFeedbackModal();

  const sercviceProviderClientAssignment = React.useMemo(() => {
    return serviceProviderUserProfile?.clientAssignments?.find(
      (clientAssigmnet) => clientAssigmnet.client?.id === clientId,
    );
  }, [clientId, serviceProviderUserProfile?.clientAssignments]);

  // TODO: this is a duplicate of the one in district_access_tab_content.tsx, so we should move it to a common place
  const districtOptions = React.useMemo(() => {
    return removeArrayDuplicates(
      [...(sercviceProviderClientAssignment?.authorizedDistricts || [])],
      () => "id",
    );
  }, [sercviceProviderClientAssignment?.authorizedDistricts]);

  const loadingProfilePageData =
    serviceProviderRequestStatus === "pending" || serviceProviderUserProfileStatus === "pending";

  const clientIdFromLocalStorage = localStorage.getItem(
    STAFF_DIRECTORY_LOCAL_STORAGE_KEYS.client_id,
  );

  const staffDirectorySessionCountActive = useXNGSelector(
    (state) => state.featureFlags.flags["StaffDirectorySessionCountActive"],
  );
  // business logic for redirecting to the staff directory manager page if the client id in the url does not match the client id in local storage
  // this is used to prevent unexpected behavior when the user changes clients while in the profile page
  if (clientIdFromLocalStorage !== clientId) {
    return <Navigate to={ROUTES_XLOGS._admin.staffDirectoryManager} replace />;
  } else if (
    serviceProviderRequestStatus === "error" ||
    serviceProviderUserProfileStatus === "error"
  ) {
    onFailedSave(
      `Failed to load ${serviceProvider?.firstName} ${serviceProvider?.lastName} service provider profile.`,
    );
    return <Navigate to={ROUTES_XLOGS._admin.staffDirectoryManager} replace />;
  }

  return (
    <Box>
      {serviceProvider ? (
        <Typography component={"h3"} fontSize={"24px"} py={2}>
          {serviceProvider?.firstName} {serviceProvider?.lastName}
        </Typography>
      ) : (
        <Skeleton variant="text" width={200} height={68} />
      )}
      <UserManagementTabs
        disableInteraction={loadingProfilePageData}
        contentOverrideOnDisable={<SkeletonTabContent />}
        tabs={[
          {
            label: "General Info",
            // if the user is not a service provider, or the service provider does not have a user profile, or the service provider does not have a client assignment, then we should show a skeleton
            //TODO: TECH DEBT, include serviceProvider, serviceProviderUserProfile, and sercviceProviderClientAssignment in the if statement for disabling the tab
            content: (
              <GeneralInfoTabContent
                serviceProvider={serviceProvider!}
                serivceProviderUserProfile={serviceProviderUserProfile!}
                districtOptions={districtOptions}
                stateInUs={stateInUs}
                clientAssignment={sercviceProviderClientAssignment!}
                refetchServiceProvider={refetchServiceProvider}
                refetchUserProfile={refetchUserProfile}
                client_id={clientId || ""}
              />
            ),
          },
          {
            label: "District Access",
            content: (
              <DistrictAccessTabContent
                serviceProviderProps={{
                  id: serviceProvider?.id,
                  districtsOfOperation: serviceProvider?.districtsOfOperation || [],
                  activeSchoolCampuses: serviceProvider?.activeSchoolCampuses || [],
                  firstName: serviceProvider?.firstName,
                  lastName: serviceProvider?.lastName,
                }}
                serivceProviderUserProfileId={serviceProviderUserProfile?.id || ""}
                clientId={clientId || ""}
                stateInUs={stateInUs}
                userIdPerformingUpdate={userId || ""}
                adminClientAssignment={adminClientAssignments}
                refetchServiceProvider={refetchServiceProvider}
                refetchUserProfile={refetchUserProfile}
                refetchStaffDirectory={refetchStaffDirectory}
              />
            ),
          },
          {
            label: "Medicaid Info",
            content: (
              <MedicaidInfoTabContent
                service_provider={serviceProvider!}
                state_in_us={stateInUs}
                client_id={clientId || ""}
                refetchServiceProvider={refetchServiceProvider}
              />
            ),
          },
          {
            label: "Caseload Information",
            content:(
                <CaseLoadInformationTabContent
                  service_provider={serviceProvider!}
                  client_id={clientId}
                  state_in_us={stateInUs}
                />
              ),
          },
          {
            label: "Training Info",
            content:(
                <TrainingInformationTabContent
                  service_provider={serviceProvider!}
                  state_in_us={stateInUs}
                  client_id={clientId || ""}
                  refetchServiceProvider={refetchServiceProvider}
                />
              ),
          },
          staffDirectorySessionCountActive
            ? {
                label: "Posted Sessions",
                content: (
                  <PostedSessionsTabContent
                    serviceProviderId={serviceProvider?.id || ""}
                    clientId={clientId}
                    stateInUs={stateInUs}
                  />
                ),
              }
            : ({} as any),
          // { label: "Posted Sessions", content: <PostedSessionsTabContent serviceProviderId={serviceProvider?.id || ""}/> }
          // { label: "User Edit Data", content: <UserEditDataTabContent /> },
        ]}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={(value) => {
          setSelectedTabIndex(value);
        }}
      />
    </Box>
  );
};

export default StaffDirectoryManagerProfilePage;
