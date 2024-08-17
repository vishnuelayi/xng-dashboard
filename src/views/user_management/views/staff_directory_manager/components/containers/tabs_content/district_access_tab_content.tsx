import { Alert, Box, FormHelperText, IconButton, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import useApiMutatePatchServiceProviderById from "../../../../../../../api/hooks/service_provider/use_api_mutate_patch_service_provider_by_id";
import useApiQueryServiceProviderById from "../../../../../../../api/hooks/service_provider/use_api_query_service_provider_by_id";
import useApiQueryUserByServiceProviderAndUserId from "../../../../../../../api/hooks/service_provider/use_api_query_user_by_service_provider_and_user_id";
import useApiMutatePatchUsersAuthorizedDistricts from "../../../../../../../api/hooks/user/use_api_mutate_patch_users_authorized_districts";
import { DualActionModal, XNGICONS, XNGIconRenderer } from "../../../../../../../design";
import GridSectionLayout from "../../../../../../../design/high-level/common/grid_section_layout";
import XNGCheckboxLabel from "../../../../../../../design/low-level/checkbox_label";
import QueryStatusModal from "../../../../../../../design/modal_templates/query_status_modal";
import { MSBICONS, MSBSearchMultiselect } from "../../../../../../../fortitude";
import {
  ClientAssignment,
  SchoolCampusAssignment,
  ServiceProviderResponse,
} from "../../../../../../../profile-sdk";
import msbMUIAutoCompleteFilterOptions from "../../../../../../../utils/msb_mui_auto_complete_filter_options";
import useUserManagementCampusDropDownsOptions from "../../../../../hooks/helper/use_user_management_campus_drop_downs_options";
import useStaffDirectoryHomePageContext from "../../../hooks/context/use_staff_directory_home_page_context";
import useSelectedDistricts from "../../../hooks/helper/use_selected_districts";
import StaffDirectoryProfileTabToolbar from "../interactive/staff_directory_profile_tab_toolbar";

type Props = {
  serviceProviderProps:{
    id: ServiceProviderResponse["id"];
    districtsOfOperation: ServiceProviderResponse["districtsOfOperation"];
    activeSchoolCampuses: ServiceProviderResponse["activeSchoolCampuses"];
    firstName: ServiceProviderResponse["firstName"];
    lastName: ServiceProviderResponse["lastName"];
  };
  serivceProviderUserProfileId: string;
  clientId: string;
  userIdPerformingUpdate: string;
  stateInUs: string;
  adminClientAssignment: ClientAssignment[] | undefined;
  refetchServiceProvider: ReturnType<typeof useApiQueryServiceProviderById>["refetch"];
  refetchUserProfile: ReturnType<typeof useApiQueryUserByServiceProviderAndUserId>["refetch"];
  refetchStaffDirectory: ReturnType<typeof useStaffDirectoryHomePageContext>["apiQueryStaffDirectory"]["refetch"];
};

const DistrictAccessTabContent = (props: Props) => {
  const palette = useTheme().palette;
  const [showQueryStatusModal, setShowQueryStatusModal] = React.useState(false);
  const [isShowingDistrictAccessRemovalModal, setIsShowingDistrictAccessNoticeModal] =
    React.useState(false);
 
    const { mutateAsync: mutateAuthorizedDistricts, status: authorizedDistrictsMutationStatus } =
    useApiMutatePatchUsersAuthorizedDistricts({
      queryParams: {
        userId: props.serivceProviderUserProfileId || "",
        clientId: props.clientId,
        state: props.stateInUs,
      },
      options: {
        onMutate: () => {
          if (!showQueryStatusModal) setShowQueryStatusModal(true);
        },
        onSuccess: () => {
          props.refetchUserProfile();
          props.refetchServiceProvider();
          props.refetchStaffDirectory();
        },
      },
    });

  const { mutateAsync: mutateServiceProvider, status: serviceProviderMutationStatus } =
    useApiMutatePatchServiceProviderById({
      queryParams: {
        id: props.serviceProviderProps?.id || "",
        clientId: props.clientId,
        state: props.stateInUs,
      },
      options: {
        onMutate: () => {
          if (!showQueryStatusModal) setShowQueryStatusModal(true);
        },
        onSuccess: () => {
          props.refetchServiceProvider();
        },
      },
    });

  const tabStatus =
    authorizedDistrictsMutationStatus === "error" || serviceProviderMutationStatus === "error"
      ? "error"
      : authorizedDistrictsMutationStatus === "pending" ||
        serviceProviderMutationStatus === "pending"
      ? "pending"
      : authorizedDistrictsMutationStatus === "success" &&
        serviceProviderMutationStatus === "success"
      ? "success"
      : "idle";

  const {
    selectedDistricts,
    setSelectedDistricts,
    selectedAllAuthorizedDistricts,
    deselectedDistricts,
    districtOptions,
  } = useSelectedDistricts(
    props.clientId,
    props.adminClientAssignment,
    undefined,
    props.serviceProviderProps?.districtsOfOperation,
  );

  const {
    campusDropdownOptions,
    refetch,
    // status: campusDropdownOptionsFetchStatus,
    isError: campusDropdownOptionsFetchError,
    isLoading: campusDropdownOptionsFetchLoading,
  } = useUserManagementCampusDropDownsOptions(props.stateInUs);

  const [selectedCampuses, setSelectedCampuses] = React.useState<
    SchoolCampusAssignment[] | undefined
  >(props.serviceProviderProps?.activeSchoolCampuses || []);

  function onSaveBtnClick() {
    if (
      // If no districts are selected, and the user has not deselected any districts, then proceed with saving
      selectedAllAuthorizedDistricts ||
      ((deselectedDistricts.current === undefined || deselectedDistricts.current.length === 0) && selectedDistricts.length === 0)
    ) {
      onSaveDistrictAccessTabInfo();
    } else {
      setIsShowingDistrictAccessNoticeModal(true);
    }
  }

  const onSaveDistrictAccessTabInfo = async () => {
    await mutateAuthorizedDistricts({
      districts: selectedDistricts,
      userIdPerformingUpdate: props.userIdPerformingUpdate,
    });

    await mutateServiceProvider({
      ...props.serviceProviderProps,
      districtsOfOperation: selectedDistricts,
      schoolCampuses: selectedCampuses,
    });
  };

  const districtAccess = (
    <GridSectionLayout
      headerConfig={{
        title: "District Access",
        headerContent: districtOptions?.length > 0 && (
          <XNGCheckboxLabel
          aria-label="select-all-districts"
            label={"Select All Districts"}
            size="small"
            checked={selectedAllAuthorizedDistricts}
            onChange={(e) => {
              if (e.target.checked) {
                deselectedDistricts.current = [];
                setSelectedDistricts([...districtOptions]);
              } else {
                deselectedDistricts.current =
                  districtOptions?.map((district) => district.name || "") || [];
                setSelectedDistricts([]);
              }
            }} // checked={false}
          />
        ),
      }}
      divider
      rows={[
        {
          cellSizes: {
            xs: 6,
            sm: 3,
            lg: 2,
          },
          cells: districtOptions.map((district) => (
            <XNGCheckboxLabel
              aria-label={`district-${district.id}`}
              whiteSpace="unset"
              label={district.name}
              size="small"
              checked={selectedDistricts.some(
                (selected_district) => selected_district.id === district.id,
              )}
              onChange={(e) => {
                if (e.target.checked) {
                  deselectedDistricts.current = deselectedDistricts.current?.filter(
                    (d) => d !== district.name,
                  );
                  setSelectedDistricts((prev) => [...prev, district]);
                } else {
                  if (district?.name)
                    deselectedDistricts.current = [
                      ...(deselectedDistricts.current || []),
                      district.name,
                    ];
                  setSelectedDistricts((prev) =>
                    prev.filter((selected_district) => selected_district.id !== district.id),
                  );
                }
              }} // checked={false}
            />
          )),
        },
        {
          fullwidth: true,
          cells: [
            <Box maxWidth={"500px"}>
              {districtOptions.length <= 0 && (
                <Alert severity="info">
                  This service provider is not currently operating in any district.
                </Alert>
              )}
            </Box>,
          ],
        },
      ]}
    />
  );

  const campusAssignments = (
    <GridSectionLayout
      headerConfig={{
        title: "Campus Assignments",
      }}
      // divider
      rows={[
        {
          cells: [
            <Stack direction={"row"}>
              <MSBSearchMultiselect
                selectedOptions={selectedCampuses || []}
                options={campusDropdownOptions?.schoolCampuses || []}
                getOptionLabel={(option) => `${option.name}`}
                onChange={(campuses) => setSelectedCampuses(campuses)}
                renderOptionVariant="checkbox"
                variant="default"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                label={
                  campusDropdownOptionsFetchLoading
                    ? "Loading Options..."
                    : campusDropdownOptionsFetchError
                    ? "Error Loading Options"
                    : "Campus Assignments"
                }
                sx={{ width: "100%" }}
                autocompleteProps={{
                  disabled: campusDropdownOptionsFetchError || campusDropdownOptionsFetchLoading,
                  disableCloseOnSelect: true,
                  filterOptions: msbMUIAutoCompleteFilterOptions(),
                }}
              />
              {campusDropdownOptionsFetchError && (
                <IconButton
                  color="error"
                  sx={{ alignSelf: "center" }}
                  onClick={() => {
                    refetch();
                  }}
                >
                  <XNGIconRenderer size={"xs"} i={<MSBICONS.Refresh />} color="primary.main" />
                </IconButton>
              )}
            </Stack>,
          ],
        },
        {
          cells: [
            campusDropdownOptionsFetchError && (
              <FormHelperText error={campusDropdownOptionsFetchError}>
                Couldn't retrieve list of campus options, please click on the refresh icon to retry
              </FormHelperText>
            ),
          ],
        },
      ]}
    />
  );

  return (
    <Box position={"relative"}>
      <Box
        sx={{
          opacity: tabStatus === "pending" ? 0.6 : 1,
        }}
      >
        <StaffDirectoryProfileTabToolbar
          onClick={() => {
            onSaveBtnClick();
          }}
        />
        {districtAccess}
        {campusAssignments}
      </Box>
      <>
        <QueryStatusModal
          isOpen={showQueryStatusModal}
          status={tabStatus}
          content={{
            successTitle: "Thank You!",
            successBody: "District Access Information Saved successfully",
            errorTitle: "Error!",
            errorBody:
              "Failed to save district access information. Please refresh window and try again.",
            pendingTitle: "Saving district access information...",
          }}
          onSettledClose={() => {
            setShowQueryStatusModal(false);
          }}
        />
        <DualActionModal
          open={isShowingDistrictAccessRemovalModal}
          injectContent={{
            icon: <XNGIconRenderer color={palette.warning[4]} size="2rem" i={<XNGICONS.Alert />} />,
            header: "Notice",
            body: (() =>
              deselectedDistricts.current && deselectedDistricts.current?.length > 0 ? (
                <Typography maxWidth={"320px"}>
                  You are about to remove
                  <Box component={"span"} fontWeight={"700"}>
                    {" "}
                    {props.serviceProviderProps?.firstName} {props.serviceProviderProps?.lastName}{" "}
                  </Box>
                  from the following districts:
                  <Box component={"span"} fontWeight={"700"} data-testid="deselected-districts-list">
                    {" "}
                    {deselectedDistricts.current?.join(", ")}{" "}
                  </Box>
                  . This will revoke access to these districts, and will remove any students within
                  those districts from their caseload. Are you sure you want to proceed?
                </Typography>
              ) : (
                <Typography maxWidth={"320px"}>
                  You are about to Add
                  <Box component={"span"} fontWeight={"700"} >
                    {" "}
                    {props.serviceProviderProps?.firstName} {props.serviceProviderProps?.lastName}{" "}
                  </Box>
                  to the following districts:
                  <Box component={"span"} fontWeight={"700"} data-testid="selected-districts-list">
                    {" "}
                    {selectedDistricts.map((d) => d.name)?.join(", ")}{" "}
                  </Box>
                </Typography>
              ))(),
            noText: "Cancel",
            buttonStyles: {
              yesButton: {
                p: 2,
                width: "102px",
                borderColor: "error.2",
                bgcolor: "error.2",
                "&:hover": {
                  color: "white",
                  borderColor: "error.3",
                  bgcolor: "error.3",
                },
              },
              noButton: {
                p: 2,
                width: "102px",
                backgroundColor: "transparent",
                color: "primary.main",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "primary.main",
                "&:hover": {
                  color: "white",
                  borderColor: "primary.main",
                  bgcolor: "primary.main",
                },
              },
            },
          }}
          onClose={() => {
            setIsShowingDistrictAccessNoticeModal(false);
          }}
          onConfirm={() => {
            setIsShowingDistrictAccessNoticeModal(false);
            onSaveDistrictAccessTabInfo();
          }}
          onReject={() => {
            setIsShowingDistrictAccessNoticeModal(false);
          }}
        />
      </>
    </Box>
  );
};

export default DistrictAccessTabContent;
