import { render, screen } from "@testing-library/react";
import { API_DISTRICTS, API_SERVICEPROVIDERS, API_USERS } from "../../../../../../../api/api";
import { DistrictRef } from "../../../../../../../profile-sdk";
import { TestProviders } from "../../../../../../../setupTests";
import * as useUserManagementCampusDropDownsOptions from "../../../../../hooks/helper/use_user_management_campus_drop_downs_options";
import * as useSelectedDistricts from "../../../hooks/helper/use_selected_districts";
import DistrictAccessTabContent from "./district_access_tab_content";
import userEvent from "@testing-library/user-event";

jest.mock("../../../../../../../api/api", () => ({
  API_DISTRICTS: {
    v1DistrictsIdSchoolCampusesDropdownDisplaysGet: jest.fn(),
  },
  API_SERVICEPROVIDERS: {
    v1ServiceProvidersIdPatch: jest.fn(),
  },
  API_USERS: {
    v1UsersIdClientAssignmentsClientIdAuthorizedDistrictsPatch: jest.fn(),
  },
}));

jest.mock("../../../../../hooks/helper/use_user_management_campus_drop_downs_options");

describe("DistrictAccessTabContent", () => {
  const setupTest = () => {
    const user = userEvent.setup();
    const jestSpyOnSelectedDistrictsHook = jest.spyOn(useSelectedDistricts, "default");
    const jestSpyOnUserManagementCampusDropDownsOptions = jest.spyOn(
      useUserManagementCampusDropDownsOptions,
      "default",
    );

    const mockedGetApiClientCampusDropdownDisplays = jest.mocked(
      API_DISTRICTS.v1DistrictsIdSchoolCampusesDropdownDisplaysGet,
    );
    const mockedPatchApiClientServiceProviderById = jest.mocked(
      API_SERVICEPROVIDERS.v1ServiceProvidersIdPatch,
    );
    const mockedPatchApiClientassignmentsAudthorizedDistrictsById = jest.mocked(
      API_USERS.v1UsersIdClientAssignmentsClientIdAuthorizedDistrictsPatch,
    );

    const mockedDistrictOptions = [
      {
        id: "1",
        name: "District 1",
      },
      {
        id: "2",
        name: "District 2",
      },
    ];

    const mockedServiceProviderProps = {
      id: "2345",
      districtsOfOperation: [
        {
          id: "1",
          name: "District 1",
        },
      ],
      activeSchoolCampuses: [
        {
          id: "19012",
          name: "A.E. Butler Intermediate",
          attendanceStartDate: new Date("2023-07-21"),
          attendanceEndDate: new Date("2023-08-21"),
        },
      ],
      firstName: "Jeniffer",
      lastName: "Whitika",
    };

    const mockedRefetchServiceProvider = jest.fn();
    const mockedRefetchUserProfile = jest.fn();
    const mockedRefetchStaffDirectory = jest.fn();

    const getDistricrtAccessTabInputs = () => {
      const saveButton = screen.getByRole("button", { name: /save/i });
      const selectAllDistrictsCheckboxInputWrapper = screen.getByLabelText("select-all-districts");
      const allDistrictsCheckboxInput = new Map();

      allDistrictsCheckboxInput.set(
        "select-all",
        selectAllDistrictsCheckboxInputWrapper.childNodes[0],
      );

      mockedDistrictOptions.forEach((d) => {
        allDistrictsCheckboxInput.set(
          d.id,
          screen.getByLabelText(`district-${d.id}`).childNodes[0],
        );
      });

      return {
        allDistrictsCheckboxInput,
        saveButton,
      };
    };

    const resolveAllMockedAndSpiedOnApiClientResponses = ({
      mockedSelectedDistricts = mockedServiceProviderProps.districtsOfOperation as DistrictRef[],
    }: {
      mockedSelectedDistricts?: DistrictRef[];
    }) => {
      const mockedSchoolCampusOptions = [
        {
          id: "19012",
          name: "A.E. Butler Intermediate",
        },
        {
          id: "19013",
          name: "Bush High School",
        },
        {
          id: "19014",
          name: "Crockett Elementary School",
        },
      ];
      jestSpyOnSelectedDistrictsHook.mockReturnValue({
        districtOptions: mockedDistrictOptions,
        selectedDistricts: mockedSelectedDistricts,
        setSelectedDistricts: jest.fn(),
        deselectedDistricts: { current: undefined },
        selectedAllAuthorizedDistricts: false,
      });

      jestSpyOnUserManagementCampusDropDownsOptions.mockReturnValue({
        campusDropdownOptions: [
          {
            schoolCampuses: mockedSchoolCampusOptions,
          },
        ],
        status: "success",
        refetch: jest.fn(),
      } as any);

      mockedGetApiClientCampusDropdownDisplays.mockImplementation(() => {
        return Promise.resolve({});
      });

      mockedPatchApiClientServiceProviderById.mockImplementation(() => {
        return Promise.resolve({});
      });

      mockedPatchApiClientassignmentsAudthorizedDistrictsById.mockImplementation(() => {
        return Promise.resolve({});
      });

      return { mockedSchoolCampusOptions };
    };

    const renderTab = () =>
      render(
        <DistrictAccessTabContent
          serviceProviderProps={mockedServiceProviderProps}
          serivceProviderUserProfileId={"333"}
          clientId={"client_id"}
          userIdPerformingUpdate={"uId"}
          stateInUs={"TX"}
          adminClientAssignment={[]}
          refetchServiceProvider={mockedRefetchServiceProvider}
          refetchUserProfile={mockedRefetchUserProfile}
          refetchStaffDirectory={mockedRefetchStaffDirectory}
        />,
        { wrapper: TestProviders },
      );

    return {
      user,
      jestSpyOnSelectedDistrictsHook,
      jestSpyOnUserManagementCampusDropDownsOptions,
      mockedServiceProviderProps,
      mockedDistrictOptions,
       mockedGetApiClientCampusDropdownDisplays,
      mockedPatchApiClientServiceProviderById,
      mockedPatchApiClientassignmentsAudthorizedDistrictsById,
      mockedRefetchServiceProvider,
      mockedRefetchUserProfile,
      mockedRefetchStaffDirectory,
      getDistricrtAccessTabInputs,
      resolveAllMockedAndSpiedOnApiClientResponses,
      renderTab,
    };
  };

  it("should render default components and other components based on injected dependencies", () => {
    const {
      mockedServiceProviderProps,
      resolveAllMockedAndSpiedOnApiClientResponses,
      getDistricrtAccessTabInputs,
      renderTab,
    } = setupTest();

    resolveAllMockedAndSpiedOnApiClientResponses({});

    renderTab();

    const { allDistrictsCheckboxInput } = getDistricrtAccessTabInputs();

    //expect district 1 to be checked
    const districtSelectAllCheckboxInput = allDistrictsCheckboxInput.get("select-all");
    const district1CheckboxInput = allDistrictsCheckboxInput.get("1");
    const district2CheckboxInput = allDistrictsCheckboxInput.get("2");

    expect(districtSelectAllCheckboxInput).toHaveAttribute("value", "false");
    expect(district1CheckboxInput).toHaveAttribute("value", "true");
    expect(district2CheckboxInput).toHaveAttribute("value", "false");

    mockedServiceProviderProps.activeSchoolCampuses.forEach((campus) => {
      expect(screen.getByText(campus.name)).toBeInTheDocument();
    });
  });

  it("should show modal on save when service provider partially has district selection checkboxes checked and clicking yes should initiate mutation", async () => {
    const {
      getDistricrtAccessTabInputs,
      resolveAllMockedAndSpiedOnApiClientResponses,
      renderTab,
      mockedServiceProviderProps,
      mockedPatchApiClientServiceProviderById,
      mockedPatchApiClientassignmentsAudthorizedDistrictsById,
      user,
    } = setupTest();

    resolveAllMockedAndSpiedOnApiClientResponses({});

    renderTab();

    const { saveButton } = getDistricrtAccessTabInputs();
    // const {saveButton } = getDistricrtAccessTabInputs();
    await user.click(saveButton);

    const selectedDistrictsSpan = screen.getByTestId("selected-districts-list");
    expect(selectedDistrictsSpan).toHaveTextContent(mockedServiceProviderProps.districtsOfOperation.map((d) => d.name)?.join(", "));

    const yesButton = screen.getByRole("button", { name: /yes/i });
    await user.click(yesButton);

    expect(screen.getByText(/District Access Information Saved successfully/i)).toBeInTheDocument();
    expect(mockedPatchApiClientServiceProviderById).toHaveBeenCalledTimes(1);
    expect(mockedPatchApiClientassignmentsAudthorizedDistrictsById).toHaveBeenCalledTimes(1);

  });

  it("should show modal on save when service provider has all district selection checkboxes checked and clicking yes should initiate mutation", async () => {
    
    const {
      getDistricrtAccessTabInputs,
      resolveAllMockedAndSpiedOnApiClientResponses,
      renderTab,
      mockedServiceProviderProps,
      mockedPatchApiClientServiceProviderById,
      mockedPatchApiClientassignmentsAudthorizedDistrictsById,
      user,
    } = setupTest();

    resolveAllMockedAndSpiedOnApiClientResponses({
      mockedSelectedDistricts: mockedServiceProviderProps.districtsOfOperation,
    });

    renderTab();

    const { saveButton } = getDistricrtAccessTabInputs();
    await user.click(saveButton);

    const selectedDistrictsSpan = screen.getByTestId("selected-districts-list");
    expect(selectedDistrictsSpan).toHaveTextContent(mockedServiceProviderProps.districtsOfOperation.map((d) => d.name)?.join(", "));

    const yesButton = screen.getByRole("button", { name: /yes/i });
    await user.click(yesButton);

    expect(screen.getByText(/District Access Information Saved successfully/i)).toBeInTheDocument();
    expect(mockedPatchApiClientServiceProviderById).toHaveBeenCalledTimes(1);
    expect(mockedPatchApiClientassignmentsAudthorizedDistrictsById).toHaveBeenCalledTimes(1);

  });
});
