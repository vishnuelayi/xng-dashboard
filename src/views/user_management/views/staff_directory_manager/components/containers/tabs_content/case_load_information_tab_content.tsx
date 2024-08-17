import { Box, Stack, Typography } from "@mui/material";
import GridSectionLayout from "../../../../../../../design/high-level/common/grid_section_layout";
import XNGSmartTable from "../../../../../../../design/high-level/common/xng_smart_table";
import { ServiceProviderResponse } from "../../../../../../../profile-sdk";
import useApiQueryServiceProviderCaseload from "../../../../../../../api/hooks/service_provider/use_api_query_service_provider_caseload";

type Props = {
  service_provider: ServiceProviderResponse;
  state_in_us: string;
  client_id: string;
};

// IF THERE ARE NO TABLE INFORMATION SHOW A GENERIC MESSAGE INSTAED OF THE TABLE, LOOK AT FRAMES FOR MORE INFO
const CaseLoadInformationTabContent = (props: Props) => {
  //#region REACT HOOKS

  const emptyCaseloadComponent = (
    <Typography>
      <strong>Note:</strong> Please be advised that this caseload currently does not include any
      providers.
    </Typography>
  );
  //#endregion

  //#region API QUERIES
  const { data: servicve_provider_caseload, status: service_provider_caseload_api_status } =
    useApiQueryServiceProviderCaseload({
      queryParams: {
        serviceProviderId: props.service_provider.id || "",
        state: props.state_in_us,
        clientId: props.client_id,
      },
    });

  // console.log("servicve_provider_caseload", servicve_provider_caseload);
  //#endregion

  //#region DEBUG DATA
  // const studentCaseloadTableItems = [
  //   {
  //     studentName: "John Doe",
  //     campus: "Campus 1",
  //     grade: 10,
  //   },
  //   {
  //     studentName: "John Doe",
  //     campus: "Campus 1",
  //     grade: 10,
  //   },
  //   {
  //     studentName: "John Doe",
  //     campus: "Campus 1",
  //     grade: 10,
  //   },
  //   {
  //     studentName: "John Doe",
  //     campus: "Campus 1",
  //     grade: 10,
  //   },
  //   {
  //     studentName: "John Doe",
  //     campus: "Campus 1",
  //     grade: 10,
  //   },
  //   {
  //     studentName: "John Doe",
  //     campus: "Campus 1",
  //     grade: 10,
  //   },
  // ];

  // const dataEntryClerkCaseloadTableItems = [
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     hasGrantedAccessToPost: true,
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     hasGrantedAccessToPost: true,
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     hasGrantedAccessToPost: false,
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     hasGrantedAccessToPost: true,
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     hasGrantedAccessToPost: false,
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     hasGrantedAccessToPost: true,
  //   },
  // ];

  // const approverCaseloadTableItems = [
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //   },
  // ];

  // const otherProviderCaseloadTableItems = [
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     providerRole: "Provider Role 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     providerRole: "Provider Role 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     providerRole: "Provider Role 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     providerRole: "Provider Role 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     providerRole: "Provider Role 1",
  //   },
  //   {
  //     providerName: "John Doe",
  //     campus: "Campus 1",
  //     serviceProviderType: "Service Provider Type 1",
  //     providerRole: "Provider Role 1",
  //   },
  // ];
  //#endregion

  //#region SECTIONS
  const studentCaseLoad = (
    <GridSectionLayout
      headerConfig={{
        title: "Student Caseload",
      }}
      bottomMargin={5}
      divider
      rows={[
        {
          fullwidth: true,
          cells: [
            <Stack>
              {servicve_provider_caseload?.studentCaseloadProfiles?.length === 0 ? (
                emptyCaseloadComponent
              ) : (
                <XNGSmartTable
                  headerConfig={{
                    bgColor: "white",
                  }}
                  columnsConfig={{
                    columns: [
                      {
                        key: "studentName",
                        headerName: "Student Name",
                        width: "25%",
                      },
                      {
                        key: "campus",
                        headerName: "Campus",
                        width: "25%",
                      },
                      {
                        key: "grade",
                        headerName: "Grade",
                      },
                    ],
                  }}
                  rowsConfig={{
                    rowHoverColor: "contrasts.1",
                    rows:
                      servicve_provider_caseload?.studentCaseloadProfiles?.map((studentIfno) => ({
                        studentName: `${studentIfno.firstName} ${studentIfno.lastName}`,
                        campus: studentIfno.campus,
                        grade: studentIfno.grade,
                      })) || [],
                  }}
                  maxheight={"200px"}
                  minWidth={"700px"}
                  emptyTableText={
                    service_provider_caseload_api_status === "error"
                      ? "Encountered Problem loading Student caseload"
                      : "No students assigned to this Provider."
                  }
                  useTableLoading={{
                    isloading:
                      !servicve_provider_caseload?.studentCaseloadProfiles &&
                      service_provider_caseload_api_status === "pending",
                    showSkeleton: true,
                  }}
                />
              )}
            </Stack>,
          ],
        },
      ]}
    />
  );

  const dataEntryClerkCaseLoad = (
    <GridSectionLayout
      headerConfig={{
        title: "Data Entry Clerk Caseload",
      }}
      bottomMargin={5}
      divider
      rows={[
        {
          fullwidth: true,
          cells: [
            <Stack>
              {servicve_provider_caseload?.decCaseloads?.length === 0 ? (
                emptyCaseloadComponent
              ) : (
                <XNGSmartTable
                  headerConfig={{
                    bgColor: "white",
                  }}
                  columnsConfig={{
                    columns: [
                      {
                        key: "providerName",
                        headerName: "Provider Name",
                        width: "20%",
                      },
                      {
                        key: "campus",
                        headerName: "Campus",
                        width: "20%",
                      },
                      {
                        key: "serviceProviderType",
                        headerName: "Service Provider Type",
                        width: "20%",
                      },
                      {
                        key: "hasGrantedAccessToPost",
                        headerName: "Consent to Post",
                        useOverride: {
                          overrideCell(row) {
                            return row.hasGrantedAccessToPost ? "Approved" : "Denied";
                          },
                          overrideColumnIndex: 3,
                        },
                      },
                    ],
                  }}
                  rowsConfig={{
                    rowHoverColor: "contrasts.1",
                    rows: servicve_provider_caseload?.decCaseloads || [],
                  }}
                  maxheight={"200px"}
                  minWidth={"700px"}
                  emptyTableText={
                    service_provider_caseload_api_status === "error"
                      ? "Encountered Problem loading Data Entry Cleark caseload"
                      : "No students assigned to this Provider."
                  }
                  useTableLoading={{
                    isloading:
                      !servicve_provider_caseload?.decCaseloads &&
                      service_provider_caseload_api_status === "pending",
                    showSkeleton: true,
                  }}
                />
              )}
            </Stack>,
          ],
        },
      ]}
    />
  );

  const approverCaseload = (
    <GridSectionLayout
      headerConfig={{
        title: "Approver Caseload",
      }}
      divider
      bottomMargin={5}
      rows={[
        {
          fullwidth: true,
          cells: [
            <Stack>
              {servicve_provider_caseload?.approverCaseloads?.length === 0 ? (
                emptyCaseloadComponent
              ) : (
                <XNGSmartTable
                  headerConfig={{
                    bgColor: "white",
                  }}
                  columnsConfig={{
                    columns: [
                      {
                        key: "providerName",
                        headerName: "Provider Name",
                        width: "25%",
                      },
                      {
                        key: "campus",
                        headerName: "Campus",
                        width: "25%",
                      },
                      {
                        key: "serviceProviderType",
                        headerName: "Service Provider Type",
                      },
                    ],
                  }}
                  rowsConfig={{
                    rowHoverColor: "contrasts.1",
                    rows: servicve_provider_caseload?.approverCaseloads || [],
                  }}
                  maxheight={"200px"}
                  minWidth={"700px"}
                  emptyTableText={
                    service_provider_caseload_api_status === "error"
                      ? "Encountered Problem loading Approver's caseload"
                      : "No students assigned to this Provider."
                  }
                  useTableLoading={{
                    isloading:
                      !servicve_provider_caseload?.decCaseloads &&
                      service_provider_caseload_api_status === "pending",
                    showSkeleton: true,
                  }}
                />
              )}
            </Stack>,
          ],
        },
      ]}
    />
  );

  const otherProviderCaseload = (
    <GridSectionLayout
      headerConfig={{
        title: "Other Provider Caseload",
      }}
      bottomMargin={30}
      rows={[
        {
          fullwidth: true,
          cells: [
            <Stack>
              {servicve_provider_caseload?.otherCaseloads?.length === 0 ? (
                emptyCaseloadComponent
              ) : (
                <XNGSmartTable
                  headerConfig={{
                    bgColor: "white",
                  }}
                  columnsConfig={{
                    columns: [
                      {
                        key: "providerName",
                        headerName: "Provider Name",
                        width: "20%",
                      },
                      {
                        key: "campus",
                        headerName: "Campus",
                        width: "20%",
                      },
                      {
                        key: "serviceProviderType",
                        headerName: "Service Provider Type",
                        width: "20%",
                      },
                      {
                        key: "providerRole",
                        headerName: "Provider Role",
                      },
                    ],
                  }}
                  rowsConfig={{
                    rowHoverColor: "contrasts.1",
                    rows: servicve_provider_caseload?.otherCaseloads || [],
                  }}
                  maxheight={"200px"}
                  minWidth={"700px"}
                  emptyTableText={
                    service_provider_caseload_api_status === "error"
                      ? "Encountered Problem loading Other Provider's Caseload"
                      : "No students assigned to this Provider."
                  }
                  useTableLoading={{
                    isloading:
                      !servicve_provider_caseload?.otherCaseloads &&
                      service_provider_caseload_api_status === "pending",
                    showSkeleton: true,
                  }}
                />
              )}
            </Stack>,
          ],
        },
      ]}
    />
  );
  //#endregion

  return (
    <Box>
      {studentCaseLoad} {dataEntryClerkCaseLoad} {approverCaseload} {otherProviderCaseload}
    </Box>
  );
};

export default CaseLoadInformationTabContent;
