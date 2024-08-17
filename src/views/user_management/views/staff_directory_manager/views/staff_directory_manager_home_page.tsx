import { Box, Button, Divider, Typography } from "@mui/material";
import StaffDirectoryHeader from "../components/containers/header/staff_directory_header";
import { MaxWidthWrapper } from "../../../components/max_width_wrapper";

import StaffDirectoryCreateProviderForm from "../components/containers/interactive/staff_directory_create_provider_form";
import ExportStaffDirectoryForm from "../components/containers/interactive/export_staff_directory_form";
import { ROUTES_XLOGS } from "../../../../../constants/URLs";
import { useNavigate } from "react-router";
import XNGSmartTable from "../../../../../design/high-level/common/xng_smart_table";
import STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS from "../constants/staff_directory_home_page_table_columns_details";
import {
  DocumentationType,
  OrderByDirection,
  StaffDirectoryProfile,
  UserResponse,
} from "../../../../../profile-sdk";
import useStaffDirectoryHomePageContext from "../hooks/context/use_staff_directory_home_page_context";
import useUserManagementContext from "../../../hooks/context/use_user_management_context";
import React from "react";
import STAFF_DIRECTORY_LOCAL_STORAGE_KEYS from "../constants/staff_directory_local_storage_keys";
import usePalette from "../../../../../hooks/usePalette";
import GridSectionLayout from "../../../../../design/high-level/common/grid_section_layout";
import useSelectedDistricts from "../hooks/helper/use_selected_districts";
import XNGCheckboxLabel from "../../../../../design/low-level/checkbox_label";
import { DualActionModal } from "../../../../../design/modal_templates/dual_action";
import { API_SERVICEPROVIDERS, API_USERS, API_CLIENTS } from "../../../../../api/api";
import useFeedbackModal from "../../../../../hooks/use_feedback_modal";
import useApiMutatePostAddUserToDistricts from "../../../../../api/hooks/user/use_api_mutate_post_add_user_to_districts";
import FullPageLoadingScreen from "../../../../../design/high-level/common/full_page_loading_screen";
import produce from "immer";
import { useXNGDispatch, useXNGSelector } from "../../../../../context/store";
import { useAppInsightsContext, useTrackEvent } from "@microsoft/applicationinsights-react-js";
import { cookieExists, setLoggedInUserCookie } from "../../../../../utils/cookies";
import { setLoggedInClient } from "../../../../../context/slices/loggedInClientSlice";
import {
  selectLoggedInClientAssignment,
  setUserResponse,
} from "../../../../../context/slices/userProfileSlice";
import { placeholderForFutureLogErrorText } from "../../../../../temp/errorText";

const StaffDirectoryManagerHomePage = () => {
  const appInsights = useAppInsightsContext();
  const admin_user_id = useUserManagementContext().store.userManagementData.user?.id;
  const admin_user_email = useUserManagementContext().store.userManagementData.user?.emailAddress;
  const client_id = useUserManagementContext().store.userManagementData.client?.id;
  const clientAssignments =
    useUserManagementContext().store.userManagementData.user?.clientAssignments;
  const pagination = useStaffDirectoryHomePageContext().store.tableData.pagination;
  const selected_column_sort = useStaffDirectoryHomePageContext().store.tableData.sort;
  const { onSuccessfulSave, onFailedSave } = useFeedbackModal();

  const {
    selectedDistricts,
    setSelectedDistricts,
    selectedAllAuthorizedDistricts,
    deselectedDistricts,
    districtOptions,
  } = useSelectedDistricts(client_id || "", clientAssignments);
  const [open_activate_provider_modal, set_open_activate_provider_modal] = React.useState(false);

  const isMsbAdmin = useUserManagementContext().store.userManagementData.user?.isMsbAdmin;
  const isExecutiveAdmin = useUserManagementContext().store.userManagementData.user?.isSuperAdmin;
  const stateInUs = useUserManagementContext().store.userManagementData.stateInUs;
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const adminUser =
    loggedInClientAssignment.isDelegatedAdmin || loggedInClientAssignment.isExecutiveAdmin;

  const navigate = useNavigate();

  if (!isMsbAdmin && !isExecutiveAdmin && !adminUser) {
    navigate(ROUTES_XLOGS.calendar);
  }

  const {
    data: directory_api,
    isLoading: directory_loading,
    error: directory_error,
    refetch: directory_refetch,
  } = useStaffDirectoryHomePageContext().apiQueryStaffDirectory;

  const {
    mutateAsync: add_user_to_districts_mutate,
    error: add_user_to_districts_error,
    isPending: add_user_to_districts_loading,
  } = useApiMutatePostAddUserToDistricts({
    queryParams: {
      state: stateInUs,
    },
    options: {
      onSuccess() {
        onSuccessfulSave("Successfully activated user");
        directory_refetch();
      },
    },
  });

  const [loading_service_provider_user_profile, set_loading_service_provider_user_profile] =
    React.useState(false);

  const page_data_loading = loading_service_provider_user_profile || add_user_to_districts_loading;

  React.useMemo(() => {
    localStorage.setItem(STAFF_DIRECTORY_LOCAL_STORAGE_KEYS.client_id, client_id || ""); // initialize persistant storage for client id
  }, [client_id]);

  // mock data
  // const isMsbAdmin = true;
  // const stateInUs: string = "NH";

  const open_create_provider_form =
    useUserManagementContext().store.staffDirectoryData.modals.createProvider.isOpen;

  const userManagementDispatch = useUserManagementContext().dispatch;
  const staffDirectoryDispatch = useStaffDirectoryHomePageContext().dispatch;
  const palette = usePalette();
  const dispatch = useXNGDispatch();

  const homepage_saving_text = React.useRef("saving homePage Info");
  const selected_provider_id_to_activate = React.useRef<string | undefined>(undefined);

  const onActivateUser = async () => {
    if (selectedDistricts.length === 0) return;
    homepage_saving_text.current = "Activating User";

    try {
      set_loading_service_provider_user_profile(true);
      const user = await API_USERS.v1UsersByServiceProviderGet(
        selected_provider_id_to_activate.current || "",
        client_id || "",
        stateInUs || "",
      );

      const service_provider = await API_SERVICEPROVIDERS.v1ServiceProvidersIdGet(
        selected_provider_id_to_activate.current || "",
        client_id || "",
        stateInUs,
      );

      const service_provider_request_body = produce(service_provider, (draft) => {
        draft.districtsOfOperation = selectedDistricts;
        draft.clientAssignmentStatus = 0
      });

      await API_SERVICEPROVIDERS.v1ServiceProvidersIdPatch(
        selected_provider_id_to_activate.current || "",
        client_id!,
        stateInUs,
        service_provider_request_body,
      );

      set_loading_service_provider_user_profile(false);
      add_user_to_districts_mutate({
        clientId: client_id || "",
        userId: user.id || "",
        districts: selectedDistricts,
      });
    } catch (e) {
      onFailedSave("Failed to activate user");
      set_loading_service_provider_user_profile(false);
      // console.log(e);
    }
  };

  if (add_user_to_districts_error) {
    onFailedSave("Failed to activate user");
  }

  const onActivateButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: StaffDirectoryProfile,
  ) => {
    e.stopPropagation();
    selected_provider_id_to_activate.current = row?.id;
    deselectedDistricts.current = [];
    setSelectedDistricts([...districtOptions]);
    set_open_activate_provider_modal(true);
  };

  const trackLoginEvent = useTrackEvent(appInsights, `StaffDirectoryLogin`, {
    actingUser: {
      userId: "",
      email: "",
    },
    targetUser: {
      firstName: "",
      lastName: "",
      userId: "",
    },
    localTime: "",
  });

  async function handleLoginEvent(user: UserResponse, providerID: string, clientID: string) {
    trackLoginEvent({
      actingUser: {
        userId: admin_user_id!,
        email: admin_user_email!,
      },
      targetUser: {
        firstName: user.firstName!,
        lastName: user.lastName!,
        userId: user.id!,
      },
      localTime: "",
    });
    setLoggedInUserCookie(user.id!, admin_user_id!, providerID, clientID);
    dispatch(setUserResponse(user));

    function refreshScreen() {
      navigate(ROUTES_XLOGS.calendar);
    }

    if (user.clientAssignments !== null) {
      if (user.clientAssignments!.length > 0) {
        // set to last logged in or zeroth by default
        const authorizedClientIDs =
          user.clientAssignments
            ?.filter((ca) => (ca.authorizedDistricts?.length ?? 0) > 0)
            .map((ca) => ca.client!.id) ?? [];
        const fallbackClientID = authorizedClientIDs[0] ?? user.clientAssignments![0].client!.id;
        const loggedInClientID = user.loggedInClientId ?? fallbackClientID;
        if (!loggedInClientID) throw new Error(placeholderForFutureLogErrorText);
        if (loggedInClientID === undefined) throw new Error(placeholderForFutureLogErrorText);

        try {
          const loggedInClient = await API_CLIENTS.v1ClientsIdGet(loggedInClientID, stateInUs);
          dispatch(setLoggedInClient(loggedInClient));
          onSuccessfulSave(
            `Successfully logged in as ${user.firstName} ${user.lastName}`,
            refreshScreen,
          );
        } catch (err) {
          onFailedSave(`Failed to login as ${user.firstName} ${user.lastName}`);
        }
      }
    }
  }

  const onLoginButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: StaffDirectoryProfile,
  ) => {
    e.stopPropagation();
    try {
      const user = await API_USERS.v1UsersByServiceProviderGet(row.id!, client_id!, stateInUs);
      handleLoginEvent(user, row.id!, client_id!);
    } catch (err) {
      onFailedSave(`Failed to login as ${row.firstName} ${row.lastName}`);
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        pt: 3,
      }}
      // bgcolor={"wheat"}
    >
      <StaffDirectoryHeader />
      <MaxWidthWrapper>
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <XNGSmartTable
            columnsConfig={{
              columns: [
                // executive admin in TX or MSB admin in NH can see the activate user button
                ...(isMsbAdmin || isExecutiveAdmin || cookieExists("originalUserID")
                  ? [
                      {
                        key: "login",
                        headerName: "Activate / Login as User",
                        disableSort: true,
                        useOverride: {
                          overrideColumnIndex: 0,
                          overrideCell: (row: StaffDirectoryProfile) =>
                            row.hasAccess || row.clientAssignmentStatus === 0 ? (
                              <Button
                                sx={{ whiteSpace: "nowrap" }}
                                // disabled={row.districtStatus}
                                onClick={(e) => onLoginButtonClick(e, row)}
                              >
                                Login
                              </Button>
                            ) : (
                              <Button
                                sx={{ whiteSpace: "nowrap" }}
                                // disabled={row.districtStatus}
                                onClick={(e) => onActivateButtonClick(e, row)}
                              >
                                Activate
                              </Button>
                            ),
                        },
                      },
                    ]
                  : []),
                {
                  key: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.FirstName.key,
                  headerName: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.FirstName.label,
                },
                {
                  key: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.LastName.key,
                  headerName: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.LastName.label,
                },
                {
                  key: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.Email.key,
                  headerName: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.Email.label,
                },
                {
                  key: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.EmployeeId.key,
                  headerName: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.EmployeeId.label,
                },
                {
                  key: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.XlogsStatus.key,
                  headerName: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.XlogsStatus.label,
                  disableSort: true,
                  useOverride: {
                    overrideColumnIndex: 5,
                    overrideCell: (row) => (row.hasAccess || row.clientAssignmentStatus === 0 ? "Active" : "Inactive"),
                  },
                },
                {
                  key: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.DocumentationType.key,
                  headerName:
                    STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.DocumentationType.label,
                  useOverride: {
                    overrideColumnIndex: 6,
                    overrideCell(row) {
                      switch (row.docType) {
                        case DocumentationType.NUMBER_0:
                          return "Paper";
                        case DocumentationType.NUMBER_1:
                          return "Import";
                        case DocumentationType.NUMBER_2:
                          return "X Logs";
                        default:
                          return "X Logs";
                      }
                    },
                  },
                },
                // executive admin in TX and NH or MSB admin in NH can see the service provider type and assigned school campuses
                ...(isExecutiveAdmin || (isMsbAdmin && stateInUs === "NH")
                  ? []
                  : [
                      {
                        key: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.ServiceProviderType
                          .key,
                        headerName:
                          STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.ServiceProviderType.label,
                        // disableSort:true,
                      },
                      {
                        key: STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.AssignedSchoolCampuses
                          .key,
                        headerName:
                          STAFF_DIRECTORY_HOME_PAGE_TABLE_COLUMNS_DETAILS.AssignedSchoolCampuses
                            .label,
                        // disableSort:true,
                      },
                    ]),
              ],
            }}
            useSort={{
              useControlled: {
                keyValue: selected_column_sort.column,
                onChange: function (columnKey: string, direction: "asc" | "desc"): void {
                  // console.log("columnKey", columnKey);
                  staffDirectoryDispatch({
                    type: "set_table_column_sort",
                    payload: {
                      sortValue: {
                        column: columnKey as keyof StaffDirectoryProfile,
                        direction:
                          direction === "asc"
                            ? OrderByDirection.NUMBER_0
                            : OrderByDirection.NUMBER_1,
                      },
                    },
                  });
                },
              },
            }}
            rowsConfig={{
              rows: directory_api?.dataList,
              onClickRow: (row) => {
                navigate(
                  `${ROUTES_XLOGS._admin.staffDirectoryManager}/${row.id}?active=${!Boolean(row.clientAssignmentStatus)}`,
                );
              },
            }}
            usePagination={{
              useControl: {
                totalItems: directory_api?.totalRecords || 0,
                itemsPerPage: pagination.rowsPerPage,
                onSetItemsPerPage: (itemsPerPage: number) => {
                  staffDirectoryDispatch({
                    type: "set_pagination_rows_per_page",
                    payload: {
                      rowsPerPage: itemsPerPage,
                    },
                  });
                },
                currentPage: directory_api?.pageNumber || 1,
                onSetCurrentPage: (currentPage: number) => {
                  staffDirectoryDispatch({
                    type: "set_pagination_current_page",
                    payload: {
                      currentPage: currentPage,
                    },
                  });
                },
                totalPages: directory_api?.totalPages || 0,
              },
            }}
            disableInteractivity={!!directory_error}
            useTableLoading={{
              isloading: !!directory_loading,
              disableInteractivity: true,
              showSkeleton: false,
            }}
          />
        </Box>
      </MaxWidthWrapper>
      <StaffDirectoryCreateProviderForm
        creating_user_id={admin_user_id || ""}
        state_in_us={stateInUs}
        isOpen={open_create_provider_form}
        refetch_staff_directory={directory_refetch}
        onClose={() => {
          userManagementDispatch({
            type: "set_open_modal_staff_directory_create_provider",
            payload: {
              isOpen: false,
            },
          });
        }}
      />
      <ExportStaffDirectoryForm />
      <DualActionModal
        open={open_activate_provider_modal}
        injectContent={{
          // icon: getConfirmationModalIcon(),
          header: "Select Districts to Add Provider To",
          body: (() => (
            <>
            <GridSectionLayout
              headerConfig={{
                titleOverride: <></>,
                headerContent: (
                  <Box display={"flex"}>
                    {districtOptions?.length > 0 && (
                      <XNGCheckboxLabel
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
                    )}
                    <Divider light />
                  </Box>
                ),
              }}
              maxHeight={"150px"}
              fullWidth={true}
              rows={[
                {
                  fullwidth: true,
                  useCellStyling: {
                    sx: {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    },
                  },
                  cells: districtOptions.map((district) => (
                    <XNGCheckboxLabel
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
                            prev.filter(
                              (selected_district) => selected_district.id !== district.id,
                            ),
                          );
                        }
                      }} // checked={false}
                    />
                  )),
                },
              ]}
            />
            <Typography>
              By clicking Save, you will activate this service provider in these districts.
            </Typography>
            </>
          ))(),
          noText: "Cancel",
          yesText: "Save",
          buttonStyles: {
            yesButton: {
              p: 2,
              width: "102px",
              borderColor: palette.primary[2],
              bgcolor: palette.primary[2],
              "&:hover": {
                color: "white",
                borderColor: palette.primary[1],
                bgcolor: palette.primary[1],
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
                color: palette.danger[1],
                borderColor: "transparent",
                backgroundColor: "transparent",
                outline: "solid 2px",
                outlineColor: palette.danger[1],
                // bgcolor: "primary.main",
                // borderWidth: "3px",
              },
            },
          },
        }}
        onClose={() => set_open_activate_provider_modal(false)}
        onConfirm={() => {
          onActivateUser();
          set_open_activate_provider_modal(false);
        }}
        onReject={() => set_open_activate_provider_modal(false)}
      />
      {page_data_loading ? <FullPageLoadingScreen text={homepage_saving_text.current} /> : null}
    </Box>
  );
};

export default StaffDirectoryManagerHomePage;
