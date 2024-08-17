import { screen, render, waitFor } from "@testing-library/react";
import GeneralInfoTabContent from "./general_info_tab_content";
import {
  ClientAssignment,
  DistrictRef,
  ParticipationListStatusType,
  ServiceProviderResponse,
  TrainingType,
  PatchServiceProviderRequest,
  PatchUserRequest,
  UserResponse,
} from "../../../../../../../profile-sdk";
import { TestProviders } from "../../../../../../../setupTests";
import { API_SERVICEPROVIDERS, API_STATESNAPSHOTS, API_USERS } from "../../../../../../../api/api";
import * as useApiQueryGetServiceProviderTypesByDate from "../../../../../../../api/hooks/state_snapshots/use_api_query_get_service_provider_types_by_date";
import userEvent from "@testing-library/user-event";

jest.mock("../../../../../../../api/api", () => ({
  API_STATESNAPSHOTS: {
    v1StateSnapshotsByDateServiceProviderTypesGet: jest.fn(),
  },
  API_SERVICEPROVIDERS: {
    v1ServiceProvidersIdPatch: jest.fn(),
  },
  API_USERS: {
    v1UsersIdPatch: jest.fn(),
  },
}));

describe("GeneralInfoTabContent", () => {
  const setupTests = () => {
    const user = userEvent.setup();
    const mockedServiceProviderProfile: ServiceProviderResponse = {
      id: "service-provider-id",
      firstName: "Marla",
      lastName: "Jennifer",
      middleName: "null",
      dateOfBirth: new Date("1970-01-01"),
      email: "mJennifer@msbconnect.com",
      rtmsEmail: "mJennifer@msbconnect.com",
      notificationEmail: "mJennifer@msbconnect.com",
      employeeId: "1233456",
      documentationType: 0,
      classType: 0,
      phoneNumber: "+1 (234) 244-2555",
      client: {
        id: "tx-demo-client-id",
        name: "TXDEMO",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2022-12-31"),
      },
      districtsOfOperation: [{}],
      assignedSchoolCampuses: [
        {
          id: "19012",
          name: "A.E. Butler Intermediate",
          attendanceStartDate: new Date("2023-07-21"),
          attendanceEndDate: new Date("2023-08-21"),
        },
      ],
      jobTitle: "X-Logs Consultant",
      employeeType: 0,
      isOnParticipationList: false,
      participationListStatus: ParticipationListStatusType.NUMBER_0,
      medicaidCredentials: [{}],
      rateRecords: [{}],
      studentCaseload: [
        {
          id: "51046086-baa5-4f92-81f5-27682240084b",
          firstName: "Lovelace",
          lastName: "Hannah",
          dateOfBirth: new Date("2009-01-29"),
          medicaidId: "529387669",
        },
        {
          id: "3ca55882-e366-4958-b52d-2375699ae12f",
          firstName: "Jessa",
          lastName: "Smith",
          dateOfBirth: new Date("2007-09-08"),
          medicaidId: "528096361",
        },
        {
          id: "78226c92-d211-4925-9def-6f84d646fa7f",
          firstName: "Ream",
          lastName: "Katy ",
          dateOfBirth: new Date("2015-07-09"),
          medicaidId: "null",
        },
        {
          id: "83f97fdd-8fa5-4f86-bf57-f1ac30539a7f",
          firstName: "Bart",
          lastName: "Simpson",
          dateOfBirth: new Date("2010-05-16"),
          medicaidId: "null",
        },
      ],
      serviceProviderType: {
        id: "1",
        legacyId: "null",
        name: "Advanced Practice Nurse (APRN)",
        serviceArea: {
          id: "3",
          name: "Nursing Services",
        },
      },
      federalFundingRecordsS: [{}],
      npi: "null",
      stateMedicaidNumber: "Texas",
      blockBillingForProvider: false,
      blockBillingStartDate: new Date("2023-07-21"),
      blockBillingHistory: [{}],
      trainingInformationLog: [
        {
          trainingType: TrainingType.NUMBER_0,
          trainingDate: new Date("2023-07-21"),
          certificateSent: false,
          visibleOnProfile: true,
        },
        {
          trainingType: TrainingType.NUMBER_1,
          trainingDate: new Date("2023-08-21"),
          certificateSent: false,
          visibleOnProfile: true,
        },
        {
          trainingType: TrainingType.NUMBER_2,
          trainingDate: new Date("2023-09-21"),
          certificateSent: false,
          visibleOnProfile: true,
        },
      ],
    };

    const mockedUserProfile: UserResponse = {
      id: "user-profile-id",
      firstName: "Marla",
      lastName: "Jennifer",
      emailAddress: "mJennifer@msbconnect.com",
      dateOfBirth: new Date("1970-01-01"),
      isSuperAdmin: false,
      isMsbAdmin: true,
      serviceProviderType: {
        id: "1",
        legacyId: "null",
        name: "Advanced Practice Nurse (APRN)",
        serviceArea: {
          id: "3",
          name: "Nursing Services",
        },
      },
      loggedInClientId: "logged-in-client-id",
      clientAssignments: [
        {
          client: {
            id: "tx-demo-cliend-id",
            name: "TXDEMO",
            startDate: new Date("2022-01-01"),
            endDate: new Date("2022-12-31"),
          },
          authorizedDistricts: [
            {
              id: "texas",
              name: "Texas ISD",
            },
          ],
          isExecutiveAdmin: true,
          isDelegatedAdmin: true,
          selectedCalendarFilters: {},
          isApprover: true,
          supervisedServiceProviders: [],
          isProxyDataEntry: true,
          appointingServiceProviders: [],
          isAutonomous: true,
          serviceProviderProfile: {
            id: "service-provider-id",
            firstName: "Marla",
            lastName: "Jennifer",
            email: "mJennifer@msbconnect.com",
          },
          approvingServiceProvider: {},
        },
      ],
      electronicSignatures: [
        {
          statementType: 1,
          isSigned: true,
          signedOnDateLocal: new Date("2023-07-21"),
          signedOnDateUtc: new Date("2023-07-21"),
          signedByFullName: "Marla Jennifer",
          objectId: "user-profile-id",
          documentText:
            "Family Educational Rights and Privacy Act (FERPA) (20 U.S.C § 1232g; 34 CFR Part 99) requires that “an educational agency or institution shall maintain a record of each request for access to and each disclose of personally identifiable information from the education records of each student.”  By selecting the statement below, you authorize that you will only review student records in which you have an educational right to access.",
          requestIpAddress: "ip-address",
        },
        {
          statementType: 2,
          isSigned: true,
          signedOnDateLocal: new Date("2023-07-21"),
          signedOnDateUtc: new Date("2023-07-21"),
          signedByFullName: "Marla Jennifer",
          objectId: "user-profile-id",
          documentText:
            "I agree and understand that by signing this Electronic Signature Acknowledgment and Consent Form, that all electronic signatures are the legal equivalent of my manual/handwritten signature and I consent to be legally bound to this agreement.",
          requestIpAddress: "ip-address",
        },
        {
          statementType: 0,
          isSigned: true,
          signedOnDateLocal: new Date("2023-07-21"),
          signedOnDateUtc: new Date("2023-07-21"),
          signedByFullName: "Marla Jennifer",
          objectId: "user-profile-id",
          documentText:
            "I confirm that my electronic signature for all service delivery is based on correct, accurate, and complete information.  I also confirm that either myself or a designated person (if applicable) is authorized to submit service delivery documentation through X Logs.",
          requestIpAddress: "ip-address",
        },
      ],
    };

    const mockedDistrictOption: DistrictRef[] = [
      {
        id: "district-id",
        name: "Texas ISD",
      },
    ];

    const mockedClientAssignment: ClientAssignment = {
      client: {
        id: "tx-demo-cliend-id",
        name: "TXDEMO",
        startDate: new Date("2022-01-01"),
        endDate: new Date("2022-12-31"),
      },
      authorizedDistricts: [
        {
          id: "texas",
          name: "Texas ISD",
        },
      ],
      isExecutiveAdmin: true,
      isDelegatedAdmin: true,
      selectedCalendarFilters: {},
      isApprover: true,
      supervisedServiceProviders: [],
      isProxyDataEntry: true,
      appointingServiceProviders: [],
      isAutonomous: true,
      serviceProviderProfile: {
        id: "service-provider-id",
        firstName: "Marla",
        lastName: "Jennifer",
        email: "mJennifer@msbconnect.com",
      },
      approvingServiceProvider: {},
    };
    const mockedStateInUs = "TX";

    const jestSpyOnGetServiceProviderTypesApi = jest.spyOn(
      useApiQueryGetServiceProviderTypesByDate,
      "default",
    );

    const mockedStateSnapshotsGetServiceProviderTypesByDateApiClient = jest.mocked(
      API_STATESNAPSHOTS.v1StateSnapshotsByDateServiceProviderTypesGet,
    );

    const mockedPatchServiceProviderApiClient = jest.mocked(
      API_SERVICEPROVIDERS.v1ServiceProvidersIdPatch,
    );

    const mockedPatchUserProfileApiClient = jest.mocked(API_USERS.v1UsersIdPatch);

    const getInputFieldsAndSaveButton = () => {
      return {
        firstNameInput: screen.getByLabelText(/first name/i),
        lastNameInput: screen.getByLabelText(/last name/i),
        middleNameInput: screen.getByLabelText(/middle name/i),
        emailAdressInput: screen.getByLabelText(/login email address/i),
        rmtsEmailAddressInput: screen.getByLabelText(/rmts email/i),
        notificationEmailAddressInput: screen.getByLabelText(/notification email/i),
        employeeIdInput: screen.getByLabelText(/employee id/i),
        phoneNumberInput: screen.getByLabelText(/phone number/i),
        serviceProviderTypeInput: screen.getByLabelText(/service provider type/i),
        xlogsRoleTypeInput: screen.getByLabelText(/x logs role/i),
        requiresOversightInput: screen.getByLabelText(/requires professional oversight/i),
        documentationTypeInput: screen.getByLabelText(/documentation type/i),
        classTypeInput: screen.getByLabelText(/class type/i),
        jobTitleInput: screen.getByLabelText(/job title/i),
        employeeTypeInput: screen.getByLabelText(/employee type/i),
        saveButton: screen.getByRole("button", { name: /save/i }),
      };
    };

    const refetchUserProfileMockFn = jest.fn();
    const refetchServiceProviderMockFn = jest.fn();

    const renderTab = () =>
      render(
        <GeneralInfoTabContent
          serviceProvider={mockedServiceProviderProfile}
          serivceProviderUserProfile={mockedUserProfile}
          districtOptions={mockedDistrictOption}
          stateInUs={mockedStateInUs}
          clientAssignment={mockedClientAssignment}
          refetchUserProfile={refetchUserProfileMockFn}
          refetchServiceProvider={refetchServiceProviderMockFn}
          client_id={mockedClientAssignment.client?.id!}
        />,
        {
          wrapper: TestProviders,
        },
      );

    return {
      user,
      mockedServiceProviderProfile,
      mockedUserProfile,
      mockedDistrictOption,
      mockedClientAssignment,
      mockedStateInUs,
      jestSpyOnGetServiceProviderTypesApi,
      mockedStateSnapshotsGetServiceProviderTypesByDateApiClient,
      mockedPatchServiceProviderApiClient,
      mockedPatchUserProfileApiClient,
      refetchUserProfileMockFn,
      refetchServiceProviderMockFn,
      getInputFieldsAndSaveButton,
      renderTab,
    };
  };

  it("Should populate input fields with service provider profile and user profile information for service provider", async () => {
    const {
      renderTab,
      jestSpyOnGetServiceProviderTypesApi,
      mockedStateSnapshotsGetServiceProviderTypesByDateApiClient,
      mockedPatchUserProfileApiClient,
      mockedPatchServiceProviderApiClient,
      mockedServiceProviderProfile,
      getInputFieldsAndSaveButton,
    } = setupTests();

    jestSpyOnGetServiceProviderTypesApi.mockReturnValue({
      data: {
        serviceProviderTypes: [
          {
            id: "1",
            legacyId: "null",
            name: "Advanced Practice Nurse (APRN)",
            serviceArea: {
              id: "3",
              name: "Nursing Services",
            },
          },
        ],
      },
    } as any);

    mockedStateSnapshotsGetServiceProviderTypesByDateApiClient.mockImplementation(
      (state: string, date?: Date | undefined) => {
        return Promise.resolve({
          serviceProviderTypes: [
            {
              id: "1",
              legacyId: "null",
              name: "Advanced Practice Nurse (APRN)",
              serviceArea: {
                id: "3",
                name: "Nursing Services",
              },
            },
          ],
        });
      },
    );

    mockedPatchServiceProviderApiClient.mockImplementation(
      (id: string, clientId:string, state: string, body?: PatchServiceProviderRequest | undefined) => {
        return new Promise(() => {});
      },
    );

    mockedPatchUserProfileApiClient.mockImplementation(
      (id: string, state: string, body?: PatchUserRequest | undefined) => {
        return new Promise(() => {});
      },
    );

    renderTab();

    const {
      firstNameInput,
      lastNameInput,
      middleNameInput,
      emailAdressInput,
      rmtsEmailAddressInput,
      notificationEmailAddressInput,
      employeeIdInput,
      phoneNumberInput,
      serviceProviderTypeInput,
      requiresOversightInput,
      xlogsRoleTypeInput,
      documentationTypeInput,
      classTypeInput,
      jobTitleInput,
      employeeTypeInput,
    } = getInputFieldsAndSaveButton();

    expect(firstNameInput).toHaveValue(mockedServiceProviderProfile.firstName);
    expect(lastNameInput).toHaveValue(mockedServiceProviderProfile.lastName);
    expect(middleNameInput).toHaveValue(mockedServiceProviderProfile.middleName);
    expect(emailAdressInput).toHaveValue(mockedServiceProviderProfile.email);
    expect(rmtsEmailAddressInput).toHaveValue(mockedServiceProviderProfile.rtmsEmail);
    expect(notificationEmailAddressInput).toHaveValue(
      mockedServiceProviderProfile.notificationEmail,
    );
    expect(employeeIdInput).toHaveValue(mockedServiceProviderProfile.employeeId);
    expect(phoneNumberInput).toHaveValue(mockedServiceProviderProfile.phoneNumber);
    expect(serviceProviderTypeInput).toHaveTextContent(
      mockedServiceProviderProfile.serviceProviderType?.name!,
    );
    expect(requiresOversightInput).toHaveTextContent(/no/i);
    expect(xlogsRoleTypeInput).toHaveTextContent(/executive admin/i);
    expect(documentationTypeInput).toHaveTextContent(/paper/i);
    expect(classTypeInput).toHaveTextContent(/life skills/i);
    expect(jobTitleInput).toHaveValue(mockedServiceProviderProfile.jobTitle);
    expect(employeeTypeInput).toHaveTextContent(/full time/i);
  });

  it("Should begin mutation process for service provider profile and user profile upon save button cick and show modal message for mutation pending state", async () => {
    const {
      renderTab,
      user,
      jestSpyOnGetServiceProviderTypesApi,
      mockedStateSnapshotsGetServiceProviderTypesByDateApiClient,
      mockedPatchServiceProviderApiClient,
      mockedPatchUserProfileApiClient,
      getInputFieldsAndSaveButton,
    } = setupTests();

    jestSpyOnGetServiceProviderTypesApi.mockReturnValue({
      data: {
        serviceProviderTypes: [
          {
            id: "1",
            legacyId: "null",
            name: "Advanced Practice Nurse (APRN)",
            serviceArea: {
              id: "3",
              name: "Nursing Services",
            },
          },
        ],
      },
    } as any);

    mockedStateSnapshotsGetServiceProviderTypesByDateApiClient.mockImplementation(
      (state: string, date?: Date | undefined) => {
        return Promise.resolve({
          serviceProviderTypes: [
            {
              id: "1",
              legacyId: "null",
              name: "Advanced Practice Nurse (APRN)",
              serviceArea: {
                id: "3",
                name: "Nursing Services",
              },
            },
          ],
        });
      },
    );

    mockedPatchServiceProviderApiClient.mockImplementation(
      (id: string, clientId:string, state: string, body?: PatchServiceProviderRequest | undefined) => {
        return new Promise(() => {});
      },
    );

    mockedPatchUserProfileApiClient.mockImplementation(
      (id: string, state: string, body?: PatchUserRequest | undefined) => {
        return new Promise(() => {});
      },
    );

    renderTab();

    const saveButton = getInputFieldsAndSaveButton().saveButton;

    await user.click(saveButton);

    await waitFor(() => {
      expect(mockedPatchServiceProviderApiClient).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockedPatchUserProfileApiClient).toHaveBeenCalled();
    });
  });

  it("should show success modal when profile information has been saved successfully", async () => {
    const {
      renderTab,
      user,
      jestSpyOnGetServiceProviderTypesApi,
      mockedPatchServiceProviderApiClient,
      mockedPatchUserProfileApiClient,
      refetchServiceProviderMockFn,
      getInputFieldsAndSaveButton,
    } = setupTests();

    jestSpyOnGetServiceProviderTypesApi.mockReturnValue({
      data: {
        serviceProviderTypes: [
          {
            id: "1",
            legacyId: "null",
            name: "Advanced Practice Nurse (APRN)",
            serviceArea: {
              id: "3",
              name: "Nursing Services",
            },
          },
        ],
      },
    } as any);

    mockedPatchServiceProviderApiClient.mockImplementation(
      (id: string, clientId:string, state: string, body?: PatchServiceProviderRequest | undefined) => {
        return Promise.resolve<ServiceProviderResponse>({} as any);
      },
    );

    mockedPatchUserProfileApiClient.mockImplementation(
      (id: string, state: string, body?: PatchUserRequest | undefined) => {
        return Promise.resolve<UserResponse>({} as any);
      },
    );

    renderTab();

    const saveButton = getInputFieldsAndSaveButton().saveButton;

    await user.click(saveButton);

    await waitFor(() => {
      expect(mockedPatchUserProfileApiClient).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockedPatchServiceProviderApiClient).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(refetchServiceProviderMockFn).toHaveBeenCalled();
    });

    const modalMessage = screen.getByText(/general information saved successfully/i);

    expect(modalMessage).toBeInTheDocument();
  });

  it("should show error modal when profile information fails to save", async () => {
    const {
      renderTab,
      user,
      jestSpyOnGetServiceProviderTypesApi,
      mockedStateSnapshotsGetServiceProviderTypesByDateApiClient,
      mockedPatchServiceProviderApiClient,
      mockedPatchUserProfileApiClient,
      getInputFieldsAndSaveButton,
    } = setupTests();


    jestSpyOnGetServiceProviderTypesApi.mockReturnValue({
      data: {
        serviceProviderTypes: [
          {
            id: "1",
            legacyId: "null",
            name: "Advanced Practice Nurse (APRN)",
            serviceArea: {
              id: "3",
              name: "Nursing Services",
            },
          },
        ],
      },
    } as any);

    mockedStateSnapshotsGetServiceProviderTypesByDateApiClient
      .mockImplementation((state: string, date?: Date | undefined) => {
        return Promise.resolve({
          serviceProviderTypes: [
            {
              id: "1",
              legacyId: "null",
              name: "Advanced Practice Nurse (APRN)",
              serviceArea: {
                id: "3",
                name: "Nursing Services",
              },
            },
          ],
        });
      });

    mockedPatchServiceProviderApiClient.mockImplementation(
      (id: string, clientId:string, state: string, body?: PatchServiceProviderRequest | undefined) => {
        return Promise.reject<ServiceProviderResponse>({} as any);
      },
    );

    mockedPatchUserProfileApiClient.mockImplementation(
      (id: string, state: string, body?: PatchUserRequest | undefined) => {
        return Promise.reject<UserResponse>({} as any);
      },
    );

    renderTab();

    const saveButton = getInputFieldsAndSaveButton().saveButton;

    await user.click(saveButton);

    await waitFor(() => {
      expect(mockedPatchUserProfileApiClient).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockedPatchServiceProviderApiClient).toHaveBeenCalled();
    });

    const modalMessage = screen.getByText(/failed to save general information/i);

    expect(modalMessage).toBeInTheDocument();
  });
});
