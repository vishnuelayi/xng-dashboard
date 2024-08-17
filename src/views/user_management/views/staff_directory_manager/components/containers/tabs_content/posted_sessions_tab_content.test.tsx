import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  ApiResponse,
  GetSessionCountReportResponse,
  QueueSessionCountReportResponse,
  V1StudentReportsSessionCountQueueReportPostRequest,
} from "@xng/reporting";
import { API_SESSIONS_COUNT } from "../../../../../../../api/api";
import { TestProviders } from "../../../../../../../setupTests";
import * as useApiMutatePollSessionCountDownloadCSV from "../../../hooks/api/use_api_mutate_poll_session_count_download_csv";
import * as useApiMutatePollSessionCountGetReport from "../../../hooks/api/use_api_mutate_poll_session_count_get_report";
import * as useApiMutateSessionCountQueueReport from "../../../hooks/api/use_api_mutate_session_count_que_report";
import PostedSessionsTabContent from "./posted_sessions_tab_content";
import downloadFile from "../../../../../../../utils/downloadFile";

jest.mock("../../../../../../../api/api", () => ({
  API_SESSIONS_COUNT: {
    v1StudentReportsSessionCountQueueReportPost: jest.fn(),
    v1StudentReportsSessionCountDownloadCSVPostRaw: jest.fn(),
    v1StudentReportsSessionCountGetReportPostRaw: jest.fn(),
  },
}));

jest.mock("../../../../../../../utils/downloadFile");

afterEach(() => {
  jest.restoreAllMocks();
  cleanup();
});

describe("PostedSessionsTabContent", () => {
  const setupTests = () => {
    const clientId = "client";
    const stateInUs = "TX";
    const serviceProviderId = "sp";
    const startDate = "01-01-2022";
    const endDate = "01-15-2022";
    const mockedSuccessfullRawResponse = new Response("", {
      status: 200,
      headers: new Headers(),
      statusText: "OK",
    });

    const mockedQueueReportResponse: QueueSessionCountReportResponse = {
      reportRunId: "1234",
      reportRunDate: new Date("01-02-2023"),
    };
    const mockedPageParameterConstant = {
      pageParameters: {
        pageNumber: 1,
        pageSize: 100,
      },
    };
    const mockedDownloadFileFn = jest.mocked(downloadFile);
    const mockedQueueReportApiClient = jest.mocked(
      API_SESSIONS_COUNT.v1StudentReportsSessionCountQueueReportPost,
    );
    const mockedGenerateRawReportApiClient = jest.mocked(
      API_SESSIONS_COUNT.v1StudentReportsSessionCountGetReportPostRaw,
    );

    const mockedDownloadCSVRawApiClient = jest.mocked(
      API_SESSIONS_COUNT.v1StudentReportsSessionCountDownloadCSVPostRaw,
    );
    const jestSpyOnQueReportApiHook = jest.spyOn(useApiMutateSessionCountQueueReport, "default");
    const jestSpyOnDownloadCSVApiHook = jest.spyOn(
      useApiMutatePollSessionCountDownloadCSV,
      "default",
    );
    const user = userEvent.setup();
    const getTabComponent = () => (
      <PostedSessionsTabContent
        clientId={clientId}
        stateInUs={stateInUs}
        serviceProviderId={serviceProviderId}
      />
    );
    const renderTab = () =>
      render(getTabComponent(), {
        wrapper: TestProviders,
      });

    const getToolBarComponents = () => {
      const applyFiltersButton = screen.getByRole("button", { name: /apply filters/i });
      const startDatePicker = screen.getByLabelText(/start date/i);
      const endDatePicker = screen.getByLabelText(/end date/i);
      const downloadCSVButton = screen.getByRole("button", { name: /export excel/i });
      return { applyFiltersButton, startDatePicker, endDatePicker, downloadCSVButton };
    };

    const populateDatePickers = async (props: {
      startDatePicker: HTMLElement;
      endDatePicker: HTMLElement;
    }) => {
      const { startDatePicker, endDatePicker } = props;
      await user.clear(startDatePicker);
      await user.type(startDatePicker, startDate);
      await user.clear(endDatePicker);
      await user.type(endDatePicker, endDate);
    };

    return {
      renderTab,
      user,
      getTabComponent,
      clientId,
      stateInUs,
      serviceProviderId,
      startDate,
      endDate,
      mockedPageParameterConstant,
      mockedQueueReportResponse,
      mockedQueueReportApiClient,
      mockedGenerateRawReportApiClient,
      mockedDownloadCSVRawApiClient,
      mockedDownloadFileFn,
      jestSpyOnQueReportApiHook,
      jestSpyOnDownloadCSVApiHook,
      getToolBarComponents,
      populateDatePickers,
      mockedSuccessfullRawResponse,
    };
  };

  it("should render apply filter prompt if there are no report records to display", async () => {
    setupTests().renderTab();

    await screen.findByText(/To see Posted Session data, please apply filters first/i);
  });

  it("should render table if there are report records to display", async () => {
    const getSessionCountReportHookSpy = jest.spyOn(
      useApiMutatePollSessionCountGetReport,
      "default",
    );
    getSessionCountReportHookSpy.mockReturnValue({
      data: { pageRecords: [] },
    } as any);

    setupTests().renderTab();
    const emptyTable = await screen.findByLabelText(/posted-sessions-tab-table/i);
    expect(emptyTable).toBeInTheDocument();
  });

  it("should que report and show query modal after filter is applied", async () => {
    const {
      renderTab,
      mockedQueueReportApiClient,
      user,
      getToolBarComponents,
      populateDatePickers,
    } = setupTests();

    mockedQueueReportApiClient.mockImplementation(
      (_?: V1StudentReportsSessionCountQueueReportPostRequest) => {
        return new Promise(() => {});
      },
    );

    renderTab();

    const { applyFiltersButton, endDatePicker, startDatePicker } = getToolBarComponents();

    await populateDatePickers({ startDatePicker, endDatePicker });
    expect(applyFiltersButton).toBeEnabled();

    await user.click(applyFiltersButton);

    const queryModalInQueueingState = await screen.findByText(
      /Queueing Session Count, Please wait.../i,
    );

    expect(queryModalInQueueingState).toBeInTheDocument();

    expect(mockedQueueReportApiClient).toHaveBeenCalled(); //TODO: TECH DEBT(Minor): check if the request parameters are correct in the call, currenlty having issues assserting agains't dates
  });

  it("should show query Modal after report queue failure", async () => {
    const {
      mockedGenerateRawReportApiClient,
      mockedQueueReportApiClient,
      user,
      renderTab,
      getToolBarComponents,
      populateDatePickers,
    } = setupTests();

    mockedGenerateRawReportApiClient.mockImplementation(() => {
      return new Promise(() => {});
    });

    mockedQueueReportApiClient.mockImplementation(() => {
      return Promise.reject("Error");
    });

    renderTab();

    const { applyFiltersButton, endDatePicker, startDatePicker } = getToolBarComponents();
    await populateDatePickers({ startDatePicker, endDatePicker });

    expect(applyFiltersButton).toBeEnabled();

    await user.click(applyFiltersButton);

    const queryStatusModal = await screen.findByText(
      /There was an error submitting your request. Please try again later./i,
    );

    expect(queryStatusModal).toBeInTheDocument();
  });

  it("should show query Modal after report has been queued successfully and start the report generation process", async () => {
    const {
      mockedQueueReportResponse,
      mockedQueueReportApiClient,
      mockedGenerateRawReportApiClient,
      user,
      renderTab,
      getToolBarComponents,
      populateDatePickers,
      mockedPageParameterConstant,
    } = setupTests();

    mockedGenerateRawReportApiClient.mockImplementation(() => {
      return new Promise(() => {});
    });

    mockedQueueReportApiClient.mockImplementation(() => {
      return Promise.resolve(mockedQueueReportResponse);
    });

    renderTab();

    const { applyFiltersButton, endDatePicker, startDatePicker } = getToolBarComponents();

    await populateDatePickers({ startDatePicker, endDatePicker });

    expect(applyFiltersButton).toBeEnabled();

    await user.click(applyFiltersButton);

    const queryModalInGetReportState = await screen.findByText(
      /Generating Report, Please wait.../i,
    );

    expect(queryModalInGetReportState).toBeInTheDocument();
    expect(mockedGenerateRawReportApiClient).toHaveBeenCalledWith({
      getSessionCountReportPostRequest: {
        ...mockedPageParameterConstant,
        ...mockedQueueReportResponse,
      },
    });
  });

  it("should show query Modal after report has been generated and render data in table", async () => {
    const {
      mockedQueueReportResponse,
      mockedQueueReportApiClient,
      mockedGenerateRawReportApiClient,
      user,
      renderTab,
      getToolBarComponents,
      populateDatePickers,
      mockedSuccessfullRawResponse,
    } = setupTests();

    mockedGenerateRawReportApiClient.mockImplementation(() => {
      return Promise.resolve<ApiResponse<GetSessionCountReportResponse>>({
        raw: mockedSuccessfullRawResponse,
        value() {
          return Promise.resolve<GetSessionCountReportResponse>({
            pageRecords: [
              {
                id: "1",
                studentFirstName: "John",
                studentLastName: "Doe",
                postedCount: 10,
                serviceId: "2",
              },
            ],
          });
        },
      });
    });

    mockedQueueReportApiClient.mockImplementation(() => {
      return Promise.resolve(mockedQueueReportResponse);
    });

    renderTab();

    const { applyFiltersButton, startDatePicker, endDatePicker } = getToolBarComponents();

    await populateDatePickers({ startDatePicker, endDatePicker });

    expect(applyFiltersButton).toBeEnabled();

    await user.click(applyFiltersButton);

    const queryStatusModal = await screen.findByText(/Report has been successfully generated/i);

    expect(queryStatusModal).toBeInTheDocument();
    expect(mockedGenerateRawReportApiClient).toHaveBeenCalledWith({
      getSessionCountReportPostRequest: {
        pageParameters: {
          pageNumber: 1,
          pageSize: 100,
        },
        ...mockedQueueReportResponse,
      },
    });
  });

  // NEGATIVE TEST CASE
  it("should be unable to initiate CSV download process if que report response is undefined", async () => {
    const { jestSpyOnQueReportApiHook, renderTab, getToolBarComponents } = setupTests();

    jestSpyOnQueReportApiHook.mockReturnValue({
      data: undefined,
    } as any);

    renderTab();

    const { downloadCSVButton } = getToolBarComponents();

    expect(downloadCSVButton).toBeDisabled();
  });

  // POSITIVE TEST CASE
  it("should be able to initiate CSV download process if que report response is defined", async () => {
    const { jestSpyOnQueReportApiHook, renderTab, getToolBarComponents } = setupTests();

    jestSpyOnQueReportApiHook.mockReturnValue({
      data: {},
    } as any);

    renderTab();

    const { downloadCSVButton } = getToolBarComponents();

    expect(downloadCSVButton).toBeEnabled();
  });

  it("should download begin csv polling on download CSV button click", async () => {
    const {
      jestSpyOnDownloadCSVApiHook,
      jestSpyOnQueReportApiHook,
      renderTab,
      getToolBarComponents,
      getTabComponent,
    } = setupTests();

    const mockMutateFn = jest.fn();
    jestSpyOnDownloadCSVApiHook.mockReturnValue({
      mutate: mockMutateFn,
      data: new Blob(),
      isPending: false,
    } as any);

    jestSpyOnQueReportApiHook.mockReturnValue({
      data: {},
    } as any);

    const { rerender } = renderTab();

    const { downloadCSVButton } = getToolBarComponents();
    expect(downloadCSVButton).toBeEnabled();

    await userEvent.click(downloadCSVButton);

    expect(mockMutateFn).toHaveBeenCalled();

    jestSpyOnDownloadCSVApiHook.mockReturnValue({
      mutate: mockMutateFn,
      data: new Blob(),
      isPending: true,
    } as any);

    rerender(getTabComponent());

    const downloadingCSVButton = await screen.findByRole("button", { name: /downloading.../i });

    expect(downloadingCSVButton).toBeInTheDocument();
    expect(mockMutateFn).toHaveBeenCalled();
  });

  it("should download CSV file on successful CSV download and show success modal", async () => {
    const {
      mockedDownloadCSVRawApiClient,
      jestSpyOnQueReportApiHook,
      renderTab,
      getToolBarComponents,
      mockedSuccessfullRawResponse,
    } = setupTests();

    mockedDownloadCSVRawApiClient.mockImplementation(() => {
      return Promise.resolve({
        raw: mockedSuccessfullRawResponse,
        value() {
          return Promise.resolve({});
        },
      } as any);
    });

    jestSpyOnQueReportApiHook.mockReturnValue({
      data: {},
    } as any);

    renderTab();

    const { downloadCSVButton } = getToolBarComponents();
    expect(downloadCSVButton).toBeEnabled();

    await userEvent.click(downloadCSVButton);

    await waitFor(() => {
      expect(mockedDownloadCSVRawApiClient).toHaveBeenCalled();
    });

    const csvFile = await screen.findByText(/successfully downloading csv file/i);

    expect(csvFile).toBeInTheDocument();
  });

  it("should show error message on failed CSV download", async () => {
    const {
      mockedDownloadCSVRawApiClient,
      renderTab,
      getToolBarComponents,
      jestSpyOnQueReportApiHook,
    } = setupTests();

    mockedDownloadCSVRawApiClient.mockImplementation(() => {
      return Promise.reject("Error");
    });

    jestSpyOnQueReportApiHook.mockReturnValue({
      data: {},
    } as any);

    renderTab();

    const { downloadCSVButton } = getToolBarComponents();
    expect(downloadCSVButton).toBeEnabled();

    await userEvent.click(downloadCSVButton);

    await waitFor(() => {
      expect(mockedDownloadCSVRawApiClient).toHaveBeenCalled();
    });

    const errorModal = await screen.findByText(/There was an error downloading the CSV file/i);

    expect(errorModal).toBeInTheDocument();

    // expect(errorModal).toBeInTheDocument();
  });
});
