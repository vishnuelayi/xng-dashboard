import { Box } from "@mui/material";
import SessionLogsForm from "./session_logs_form";
import useApiQueryServiceProviders from "../../../../api/hooks/service_provider/use_api_query_service_providers";
import React from "react";
import useApiQueryStateSnapshotsByDateByServiceProviderType from "../../../../api/hooks/state_snapshots/use_api_query_state_snapshots_bydate_by_service_provider_type";
import { useNavigate } from "react-router";
import { ROUTES_XLOGS } from "../../../../constants/URLs";
import useApiQuerySchoolCampusesDropdownDisplaysGet from "../../../../api/hooks/districts/use_api_query_school_campuses_drop_down_displays_get";
import { DistrictRef, ServiceProviderRef } from "../../../../profile-sdk";
import GridSectionLayoutSkeleton from "../../../../design/high-level/common/grid_section_layout_skeleton";
import useFeedbackModal from "../../../../hooks/use_feedback_modal";
import { FiltersFormType } from "./session_logs_form_filter_data";
import {
  GetSessionLogsSummaryReportPostRequest,
  QueueSessionLogsReportResponse,
  SessionLogsReportFilterParameters,
  SessionLogsSortableColumn,
  SessionLogsSortableColumnSortColumn,
} from "@xng/reporting";
import { GetSessionReportStatusEnumFromString } from "../../../../utils/xlogs_session_report_status_mapper";
import FullPageLoadingScreen from "../../../../design/high-level/common/full_page_loading_screen";
import produce from "immer";
import SessionLogsSummary from "./session_logs_summary";
import { quickSortInPlace } from "../../../../utils/quick_sort_in_place";
import ReportsLayout from "../../reports_layout";
import REPORTS_VIEWS_HEADER_TITLE from "../../constants/reports_views_header_title";
import useApiGetMutateSessionLogsSummary from "../../../../api/hooks/session_reports/use_api_mutate_get_session_logs_summary";
import useApiMutateQueSessionLogsReport from "../../../../api/hooks/session_reports/use_api_mutate_que_session_logs_report";
import useUserRoles from "../../../../hooks/use_user_roles";
import { useXNGSelector } from "../../../../context/store";
import {
  selectLoggedInClientAssignment,
  selectUser,
} from "../../../../context/slices/userProfileSlice";
import { useCreateMyselfAsServiceProvider } from "./hooks/use_create_myself_as_service_provider";
import useSessionLogsContext from "./context/use_session_logs_context";

const SessionLogsView = () => {
  //#region REACT ROUTER DOM
  const navigate = useNavigate();
  const createMyselfAsServiceProvider = useCreateMyselfAsServiceProvider();

  //#endregion

  //#region CONTEXT
  const {
    clientId: client_id,
    stateInUs: state_in_us,
    authorizedDistricts: authorized_districts,
    session_logs_request_body_handler,
    session_logs_summary_request_body_handler,
    selected_students,
    setSelectedStudents,
  } = useSessionLogsContext();
  //#endregion
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);

  //#region STATES HOOKS
  const [selected_authorized_districts_ids, set_selected_authorized_districts_ids] = React.useState<
    string | undefined
  >(authorized_districts?.map((d: any) => d.id).join(","));
  //#endregion

  //#region REF HOOKS
  const table_container_ref = React.useRef<HTMLDivElement>(null);
  //#endregion

  //#region API QUERIES
  const {
    mutateAsync: mutateGetSessionLogsSummary,
    data: session_logs_summary_data,
    status: session_logs_summary_mutation_status,
  } = useApiGetMutateSessionLogsSummary({
    options: {
      onError: () => {
        onFailedSave(
          "Unable to load the report. This could be due to a timeout error. If this is your first time loading a report in a while," +
            " please wait a minute or so and try again. If the problem continues, contact customer support.",
        );
      },
      onSuccess: () => {
        onSuccessfulSave("Session logs summary loaded successfully. View table below");
      },
      retry: 3,
      retryDelay: 1000,
    },
  });

  const {
    mutateAsync: mutateQueSessionLogsReport,
    status: que_session_logs_report_status,
    // clearData: clearQueSessionLogsReportData,
  } = useApiMutateQueSessionLogsReport({
    options: {
      onSuccess: (queSessionLogsResponseData) => {
        generateReportHandler(queSessionLogsResponseData);
      },
      onError: () => {
        onFailedSave("Problem queuing session logs report, please try again.");
      },
    },
  });

  const { data: serviceProvidersResponse, status: service_providers_response_status } =
    useApiQueryServiceProviders({
      queryParams: {
        clientId: client_id || "",
        state: state_in_us,
      },
    });

  const { data: service_types_response, status: service_types_response_status } =
    useApiQueryStateSnapshotsByDateByServiceProviderType({
      queryParams: {
        stateInUs: state_in_us,
      },
    });

  const { data: campuses_response } = useApiQuerySchoolCampusesDropdownDisplaysGet({
    queryParams: {
      districtIds: selected_authorized_districts_ids,
      state: state_in_us,
    },
    options: {
      enabled: selected_authorized_districts_ids ? true : false,
      staleTime: 60 * 60 * 1000,
    },
  });
  //#endregion

  //#region FEEDBACK
  const { onFailedSave, onSuccessfulSave } = useFeedbackModal();
  //#endregion

  //#region API STATUSES
  const session_logs_filters_loading =
    service_providers_response_status === "pending" || service_types_response_status === "pending";

  const session_logs_filters_error =
    service_providers_response_status === "error" || service_types_response_status === "error";

  const session_logs_filters_success =
    service_providers_response_status === "success" && service_types_response_status === "success";

  const session_logs_mutation_summary_loading = session_logs_summary_mutation_status === "pending";

  const session_logs_que_report_loading = que_session_logs_report_status === "pending";

  //#endregion
  const userRoles = useUserRoles();

  //#region MEMOS
  const defaultServiceProviderOptions = React.useMemo(() => {
    const res = getDefaultServiceProviderOptionsSorted();
    return res;
  }, [serviceProvidersResponse?.serviceProviders, userRoles]);

  /**
   * This function gets default service provider options for the dropdown and
   * sorts by last name then first name.
   */
  function getDefaultServiceProviderOptionsSorted(): ServiceProviderRef[] {
    const options = getDefaultServiceProviderOptionsBasedOnRole();
    if (options.length === 0) return [];

    return quickSortInPlace(
      options,
      0,
      (serviceProvidersResponse?.serviceProviders?.length ?? 1) - 1,
      (a, b) => {
        return `${a?.firstName} ${a?.lastName}`.localeCompare(`${b?.firstName} ${b?.lastName}`);
      },
    ).filter((v) => v !== undefined);
  }

  function getDefaultServiceProviderOptionsBasedOnRole(): ServiceProviderRef[] {
    const allServiceProviders = [...(serviceProvidersResponse?.serviceProviders ?? [])];

    // Admin: Same as existing functionality
    if (userRoles.includes("Executive Admin") || userRoles.includes("Delegated Admin")) {
      return allServiceProviders;
    }

    // Approver: Your sessions + People in your caseload
    // DEC: Your sessions + People in your caseload
    if (userRoles.includes("Approver") || userRoles.includes("Proxy Data Entry")) {
      const serviceProvidersWhereSupervisedOrAppointing = allServiceProviders.filter((provider) => {
        // If is supervised, include. (Applies to Approvers. FYI: Users may have both roles)
        if (userRoles.includes("Approver")) {
          if (
            loggedInClientAssignment?.supervisedServiceProviders?.some(
              (sp) => sp.id === provider.id,
            )
          )
            return true;
        }

        // If is appointing, include. (Applies to DEC. FYI: Users may have both roles)
        if (userRoles.includes("Proxy Data Entry")) {
          if (
            loggedInClientAssignment?.appointingServiceProviders?.some(
              (sp) => sp.id === provider.id,
            )
          )
            return true;
        }
      });

      const res: ServiceProviderRef[] = [
        ...serviceProvidersWhereSupervisedOrAppointing,
        createMyselfAsServiceProvider(),
      ];
      return res;
    }

    // Autonomous SP: Only see your sessions
    // Assistant SP: Only see your sessions
    if (
      userRoles.includes("Service Provider - Autonomous") ||
      userRoles.includes("Service Provider - Assistant")
    ) {
      const res = [createMyselfAsServiceProvider()];
      return res;
    }

    throw new Error(
      "Error in Session Logs: Could not determine appropriate permission based on user role. Has a new role been introduced?",
    );
  }

  const sorted_district_of_liability_options = React.useMemo(() => {
    const arrCopy = [...(authorized_districts || [])];
    return (
      quickSortInPlace(arrCopy, 0, (authorized_districts?.length || 1) - 1, (a, b) => {
        return `${a?.name}`.localeCompare(`${b?.name}`);
      }) || []
    );
  }, [authorized_districts]);

  const sorted_school_campus_options = React.useMemo(() => {
    const arrCopy = [...(campuses_response?.schoolCampuses || [])];
    return (
      quickSortInPlace(arrCopy, 0, (campuses_response?.schoolCampuses?.length || 1) - 1, (a, b) => {
        return `${a?.name}`.localeCompare(`${b?.name}`);
      }) || []
    );
  }, [campuses_response]);

  //#endregion

  //#region METHODS
  /**
   * Sets the selected district IDs and updates the state. The state here is used to
   * update the request body for an api request.
   *
   * @param districts - An array of DistrictRef objects representing the selected districts.
   */
  const setSelectedDistrictIdsHandler = (districts: DistrictRef[]) => {
    const selected_district_ids =
      districts && districts?.length > 0
        ? districts.map((d) => d.id).join(",")
        : authorized_districts?.map((d: any) => d.id).join(",");
    set_selected_authorized_districts_ids(selected_district_ids);
  };

  /**
   * Generates a report summary based on the provided form filters.
   * @param form_filters The filters to apply to the report.
   */
  const generateReportSummaryHandler = async (form_filters: FiltersFormType) => {
    const date_filters =
      form_filters.session_date_filter === "Date Range"
        ? {
            startDate: form_filters.date_filter_options.start_date,
            endDate: form_filters.date_filter_options.end_date,
          }
        : form_filters.session_date_filter === "Week of School Year"
        ? {
            startDate: form_filters.date_filter_options.week.start,
            endDate: form_filters.date_filter_options.week.end,
          }
        : {
            startDate: undefined,
            endDate: undefined,
          };

    const request_body: GetSessionLogsSummaryReportPostRequest = {
      filterParameters: {
        clientId: client_id || "",
        districtOfLiabilityIds: new Set(form_filters.dols?.map((d) => d.id || "") || []),
        schoolCampusIds: new Set(form_filters.schools?.map((s) => s.id || "") || []),
        serviceProviderIds: new Set(form_filters.service_providers?.map((s) => s.id || "") || []),
        serviceIds: new Set(form_filters.service_types?.map((s) => s.id || "") || []),
        sessionStatuses: new Set(
          form_filters.session_filter?.map((status) =>
            GetSessionReportStatusEnumFromString(status || ""),
          ) || [],
        ),
        makeupSessions:
          form_filters.make_up_session === "Both"
            ? undefined
            : form_filters.make_up_session === "Yes",
        providerAbsent:
          form_filters.provider_absent === "Both"
            ? undefined
            : form_filters.provider_absent === "Yes",
        startDate: date_filters.startDate,
        endDate: date_filters.endDate,
      },
    };
    const new_session_logs_summary_request_body = produce(
      session_logs_summary_request_body_handler?.().get_session_logs_summary_request_body || {},
      (draft: any) => {
        if (draft && draft.getSessionLogsSummaryReportPostRequest)
          draft.getSessionLogsSummaryReportPostRequest.filterParameters =
            request_body.filterParameters;
      },
    );

    session_logs_summary_request_body_handler?.().set(new_session_logs_summary_request_body);
    setSelectedStudents([]); //clear selected students
    await mutateGetSessionLogsSummary({
      getSessionLogsSummaryReportPostRequest: request_body,
    });
  };

  /**
   * Handles the queuing of a session logs report.
   *
   * @returns {Promise<void>} A promise that resolves when the report is queued.
   */
  const queSessionLogsReportHandler = async () => {
    const new_filter_params = produce(
      session_logs_summary_request_body_handler?.().get_session_logs_summary_request_body
        .getSessionLogsSummaryReportPostRequest?.filterParameters || {},
      (draft: any) => {
        const student_ids =
          selected_students.length === session_logs_summary_data?.records?.length
            ? []
            : selected_students.map((s: any) => s.id as string);
        if (draft) draft.studentIds = new Set(student_ids);
      },
    );

    await mutateQueSessionLogsReport({
      queueSessionLogsReportPostRequest: {
        filterParameters: new_filter_params as SessionLogsReportFilterParameters,
      },
    });
  };

  /**
   * Generates a report based on the provided queue session logs response.
   * @param que_session_logs_response The queue session logs response.
   */
  const generateReportHandler = async (
    que_session_logs_response: QueueSessionLogsReportResponse,
  ) => {
    const new_session_logs_request_body = produce(
      session_logs_request_body_handler?.().get_session_logs_request_body || {
        getSessionLogsReportPostRequest: {},
      },
      (draft: any) => {
        draft.getSessionLogsReportPostRequest!.reportRunId = que_session_logs_response.reportRunId;
        draft.getSessionLogsReportPostRequest!.dateRun = que_session_logs_response.reportRunDate;

        draft.getSessionLogsReportPostRequest!.pageParameters = {
          pageNumber: 1,
          pageSize: 10,
        };

        draft.getSessionLogsReportPostRequest!.sortColumns = new Set([
          {
            column: SessionLogsSortableColumn.NUMBER_0,
            sortDirection: 0,
          },
        ]) as Set<SessionLogsSortableColumnSortColumn>;
      },
    );
    session_logs_request_body_handler?.().set(new_session_logs_request_body);
    navigate(ROUTES_XLOGS.reports.service_report + REPORTS_VIEWS_HEADER_TITLE.serviceReport, {
      state: { status: "loading" },
    });
  };
  //#endregion

  //#region SIDE EFFECTS

  React.useEffect(() => {
    if (session_logs_summary_mutation_status === "success") {
      table_container_ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [session_logs_summary_mutation_status]);

  React.useEffect(() => {
    if (session_logs_filters_error)
      onFailedSave("Problem loading session logs filters, please refresh window.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session_logs_filters_error]);
  //#endregion

  //#region CUSTOM COMPONENTS
  const SessionLogsFullScreenLoadingScreen = () => {
    if (session_logs_mutation_summary_loading) {
      return <FullPageLoadingScreen text="Please wait, Loading Session Logs Summary" pulse />;
    }
    if (session_logs_que_report_loading) {
      return <FullPageLoadingScreen text="Please wait, Queing Session Logs Report" pulse />;
    }

    return null;
  };
  //#endregion

  return (
    <ReportsLayout title="Session Logs" gutterTop>
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        {session_logs_filters_loading && (
          <GridSectionLayoutSkeleton
            header_props={{
              width: "200px",
            }}
            sections={[
              {
                num_cells: 3,
                num_rows: 1,
                divider: true,

                cell_sizes: {
                  xs: 12,
                  sm: 4,
                  lg: 4,
                },
              },
              {
                num_cells: 3,
                num_rows: 2,
                cell_sizes: {
                  xs: 12,
                  sm: 4,
                  lg: 4,
                },
              },
            ]}
          />
        )}

        {session_logs_filters_success && (
          <SessionLogsForm
            defaultOptions={{
              serviceProviders: defaultServiceProviderOptions,
              districtsOfLiability: sorted_district_of_liability_options,
              service_types: service_types_response?.services || [],
              campuses: sorted_school_campus_options,
            }}
            onSubmitFormFilters={generateReportSummaryHandler}
            update_selected_authorized_district_ids={setSelectedDistrictIdsHandler}
          />
        )}
        <SessionLogsFullScreenLoadingScreen />
        {(session_logs_mutation_summary_loading || session_logs_summary_data) && (
          <SessionLogsSummary
            ref={table_container_ref}
            layout={{
              onGenerateReportBtnClick: queSessionLogsReportHandler,
              generateReportBtnDisabled: selected_students.length <= 0,
            }}
            table={{
              rows: session_logs_summary_data?.records || [],
              default_selected_rows: selected_students,
              onRowsSelected: (selectedRows) => {
                setSelectedStudents(selectedRows);
              },
              data_loading: session_logs_mutation_summary_loading,
            }}
          />
        )}
      </Box>
    </ReportsLayout>
  );
};

export default SessionLogsView;
