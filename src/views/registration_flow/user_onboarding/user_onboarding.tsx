import { useEffect, useState } from "react";
import { selectAuthorizedDistricts, selectUser } from "../../../context/slices/userProfileSlice";
import { useXNGDispatch, useXNGSelector } from "../../../context/store";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import {
  ClientTermRef,
  CreateServiceProviderRequest,
  GetSchoolCampusDropdownsResponse,
  PatchElectronicSignatureRequest,
  PatchServiceProviderRequest,
  SchoolCampusAssignmentRequest,
  SchoolCampusRef,
  ServiceProviderResponse,
  ServiceProviderType,
  ServiceProviderTypesResponse,
  StatementType,
} from "../../../profile-sdk";
import {
  API_DISTRICTS,
  API_SERVICEPROVIDERS,
  API_STATESNAPSHOTS,
  API_USERS,
} from "../../../api/api";
import dayjs from "dayjs";
import { AccountInfo } from "@azure/msal-browser";
import { FormFourValues, FormOneValues, FormThreeValues } from "./types";
import { FifthView, FirstView, FourthView, ThirdView, ZerothView } from "./views";
import { XNGSlideshow } from "../../../design/components-dev/slideshow";
import {
  STATEMENT_ELECTRONIC_SIGNATURE_CONSENT,
  STATEMENT_FERPA_AUTHORIZATION,
  STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION,
} from "./statements";
import { selectClient, selectClientID } from "../../../context/slices/loggedInClientSlice";
import { useNavigate } from "react-router";
import { setDataEntryProvider } from "../../../context/slices/dataEntryProvider";

interface IUserOnboarding {
  account: AccountInfo;
}
function UserOnboarding(props: IUserOnboarding) {
  if (props.account.idTokenClaims === undefined) throw new Error(placeholderForFutureLogErrorText);
  if (props.account.idTokenClaims.oid === undefined)
    throw new Error(placeholderForFutureLogErrorText);

  // ---------------------- ACCESSOR CONSTANTS ----------------------
  const _state: string = props.account.idTokenClaims.state as string;
  const _oid: string = props.account.idTokenClaims.oid;
  const _fullName =
    props.account.idTokenClaims.given_name + " " + props.account.idTokenClaims.family_name;

  // ---------------------- HOOKS ----------------------
  const navigate = useNavigate();

  // ---------------------- API ----------------------
  // --- SELECTORS
  const authorizedDistricts = useXNGSelector(selectAuthorizedDistricts);
  const client = useXNGSelector(selectClient);
  const user = useXNGSelector(selectUser);
  const dispatch = useXNGDispatch();
  if (client === null) throw new Error(placeholderForFutureLogErrorText);

  // --- API
  async function fetchAndSetState() {
    // Get school campuses
    if (authorizedDistricts === null) throw new Error(placeholderForFutureLogErrorText);
    let dropdownRes: SchoolCampusRef[] = [];
    authorizedDistricts?.forEach(async (district) => {
      if (district.id === undefined) throw new Error(placeholderForFutureLogErrorText);
      const campusesToAdd = await API_DISTRICTS.v1DistrictsIdSchoolCampusesDropdownDisplaysGet(
        district.id,
        _state,
      );
      if (campusesToAdd.schoolCampuses === undefined)
        throw new Error(placeholderForFutureLogErrorText);
      dropdownRes.push(...campusesToAdd.schoolCampuses);
    });

    setSchoolCampuses(dropdownRes);
    // if therapist, but can skip step
    const serviceProviderTypeDropdown: ServiceProviderTypesResponse =
      await API_STATESNAPSHOTS.v1StateSnapshotsByDateServiceProviderTypesGet(_state, undefined);

    const dropdownOptions: ServiceProviderType[] | undefined =
      serviceProviderTypeDropdown.serviceProviderTypes;

    if (dropdownOptions === undefined) throw new Error(placeholderForFutureLogErrorText);

    setServiceProviderTypes(dropdownOptions);
  }
  useEffect(() => {
    fetchAndSetState();
  }, []);

  // ---------------------- STATES ----------------------
  // const [ipAddress, setIpAddress] = useState<string>("");
  const [schoolCampuses, setSchoolCampuses] = useState<SchoolCampusRef[]>([]);
  const [serviceProviderTypes, setServiceProviderTypes] = useState<ServiceProviderType[]>([]);
  const [slideView, setSlideView] = useState<number>(0);

  const [cachedFormOneValues, setCachedFormOneValues] = useState<FormOneValues | null>(null);
  const [cachedFormThreeValues, setCachedFormThreeValues] = useState<FormThreeValues | null>(null);
  // ---------------------- SIGNED STATEMENT HANDLERS ----------------------

  async function onElectronicSignature(documentText: string, statementType: StatementType) {
    const patchElectronicSignatureRequest: PatchElectronicSignatureRequest = {
      isSigned: true,
      objectId: _oid,
      requestIpAddress: "",
      signedOnDateLocal: dayjs().toDate(),
      signedByFullName: _fullName,
      documentText: documentText,
    };
    await API_USERS.v1UsersIdElectronicSignaturesStatementTypePatch(
      _oid,
      statementType,
      _state,
      patchElectronicSignatureRequest,
    );
  }
  async function onTrueAndAccurateDataAuthorization() {
    onElectronicSignature(STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION, StatementType.NUMBER_0);
  }
  async function onFerpaAuthorizationStatement() {
    onElectronicSignature(STATEMENT_FERPA_AUTHORIZATION, StatementType.NUMBER_1);
  }
  async function onElectronicSignatureConsent() {
    onElectronicSignature(STATEMENT_ELECTRONIC_SIGNATURE_CONSENT, StatementType.NUMBER_2);
  }

  // ---------------------- SUBMIT ----------------------
  async function handleFullSubmission() {
    // Create SP creation request
    if (cachedFormOneValues === null) throw new Error(placeholderForFutureLogErrorText);
    const serviceProvider: CreateServiceProviderRequest = {
      client: client as ClientTermRef,
      firstName: cachedFormOneValues.firstName,
      lastName: cachedFormOneValues.lastName,
      email: cachedFormOneValues.email,
      jobTitle: cachedFormOneValues.jobTitle,
      npi: cachedFormOneValues.npi,
      stateMedicaidNumber: cachedFormOneValues.stateMedicaidNumber,
      serviceProviderType: user?.serviceProviderType,
      assignedSchoolCampuses: [cachedFormOneValues.primaryCampus], // fix later
      // @ts-ignore
      clientAssignmentStatus: 0, // there are issues with the patch below so this gets added here to make sure the user can actually login
    };
    const spResponse: ServiceProviderResponse = await API_SERVICEPROVIDERS.v1ServiceProvidersPost(
      _state,
      serviceProvider,
      _oid,
    );
    dispatch(setDataEntryProvider(spResponse));
    if (cachedFormThreeValues !== null) {
      // Patch Therapist data if populated

      if (spResponse.client?.id === undefined) throw new Error(placeholderForFutureLogErrorText);
      if (spResponse.id === undefined) throw new Error(placeholderForFutureLogErrorText);
      const spPatch: PatchServiceProviderRequest = {
        medicaidCredentials: [
          {
            nameOnLicense: cachedFormThreeValues.nameOnLicense,
            profession: cachedFormThreeValues.licenseType,
            licenseNumber: cachedFormThreeValues.licenseNumber,
            endDate: cachedFormThreeValues.licenseExpirationDate,
          },
        ],
      };

      API_SERVICEPROVIDERS.v1ServiceProvidersIdPatch(
        spResponse.id,
        spResponse.client.id,
        _state,
        spPatch,
      );
    }

    // Submit electronic signatures
    await onFerpaAuthorizationStatement();
    await onTrueAndAccurateDataAuthorization();
    await onElectronicSignatureConsent();
  }

  // ---------------------- DOM ----------------------
  return (
    <XNGSlideshow
      view={slideView}
      slides={[
        {
          id: 0,
          content: <ZerothView onNext={() => setSlideView(1)} />,
        },
        {
          id: 1,
          content: (
            <FirstView
              onValidNext={(values: FormOneValues) => {
                // Handle values...
                setCachedFormOneValues(values);
                setSlideView(3);
              }}
              apiDependentValues={{ campusDropdownOptions: schoolCampuses }}
            />
          ),
        },
        {
          id: 3,
          content: (
            <ThirdView
              apiDependentValues={{ licenseTypeDropdownOptions: serviceProviderTypes }}
              onSkip={() => setSlideView(4)}
              onValidNext={(values: FormThreeValues) => {
                // Handle values...
                setCachedFormThreeValues(values);
                setSlideView(4);
              }}
            />
          ),
        },
        {
          id: 4,
          content: (
            <FourthView
              onValidNext={async (values: FormFourValues) => {
                // Handle values...
                await handleFullSubmission();
                setSlideView(5);
              }}
              apiDependentValues={{
                ferpaAuthorizationStatement: STATEMENT_FERPA_AUTHORIZATION,
                electronicSignatureConsent: STATEMENT_ELECTRONIC_SIGNATURE_CONSENT,
                trueAndAccurateDataAuthorization: STATEMENT_TRUE_AND_ACCURATE_DATA_AUTHORIZATION,
              }}
            />
          ),
        },
        {
          id: 5,
          content: <FifthView onNext={() => navigate(0)} />,
        },
      ]}
    />
  );
}

export default UserOnboarding;
