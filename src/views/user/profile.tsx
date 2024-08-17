import { Container, Typography, useTheme, useMediaQuery, FormHelperText, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { API_SERVICEPROVIDERS, API_USERS } from "../../api/api";
import { selectClientID } from "../../context/slices/loggedInClientSlice";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectUser } from "../../context/slices/userProfileSlice";
import { useXNGDispatch, useXNGSelector } from "../../context/store";
import Box from "../../design/components-dev/BoxExtended";
import XNGButton from "../../design/low-level/button";
import XNGInput from "../../design/low-level/input";
import { getSizing } from "../../design/sizing";
import usePalette from "../../hooks/usePalette";
import {
  ElectronicSignature,
  MedicaidCredential,
  PatchServiceProviderRequest,
  ServiceProviderResponse,
  StatementType,
  UserResponse,
  SchoolCampusRef,
} from "../../profile-sdk";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import dayjs from "dayjs";
import { XNGIconRenderer, XNGICONS } from "../../design/icons";
import XNGSelect from "../../design/low-level/dropdown";
import XNGCheckbox from "../../design/low-level/checkbox";
import FERPAModal from "./menus/ferpa";
import TrueAndAccurateModal from "./menus/true_accurate";
import ElectronicSignatureModal from "./menus/electronic_signature";
import { styled } from "@mui/system";
import { providerNotFoundErrorActions } from "../../context/slices/providerNotFoundErrorSlice";
import { ACTION_setForceAccountRegistration } from "../../context/slices/forceAccountRegistrationSlice";
import { selectLoggedInClientAssignment } from "../../context/slices/userProfileSlice";
import useApiQueryCampusDropDownDisplays from "../../api/hooks/districts/use_api_query_campus_drop_down_displays";
import { MSBICONS, MSBSearchMultiselect } from "../../fortitude";
import msbMUIAutoCompleteFilterOptions from "../../utils/msb_mui_auto_complete_filter_options";

/**
 * This file probably needs a refactor, lots of logic and components
 * that could be put in their own files / hooks
 */
export default function UserProfile() {
  //hooks
  const palette = usePalette();
  const thm = useTheme();
  const dispatch = useXNGDispatch();

  // BREAKPOINTS
  const isGreaterThanMd = useMediaQuery(thm.breakpoints.up("md"));
  //states
  const [userProfile, setUserProfile] = useState<UserResponse>({});
  const [providerProfile, setProviderProfile] = useState<ServiceProviderResponse>({});
  const [FERPAModalCheck, setFERPAModal] = useState<boolean>(false);
  const [trueAndAccurateModalCheck, setTrueAndAccurateModal] = useState<boolean>(false);
  const [electronicSignatureModalCheck, setElectronicSignatureModal] = useState<boolean>(false);

  const [allSignatures, setAllSignatures] = useState<ElectronicSignature[] | undefined>();
  const [FERPA, setFERPA] = useState<ElectronicSignature>();
  const [TrueAndAccurate, setTrueAndAccurate] = useState<ElectronicSignature>();
  const [electronicSignaturesDoc, setElectronicSignatureDoc] = useState<ElectronicSignature>();

  //SELECTORS
  const user = useXNGSelector(selectUser);
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);

  async function fetchAndSetUser() {
    if (user === undefined) throw Error(placeholderForFutureLogErrorText);
    const userResponse = await API_USERS.v1UsersIdGet(user?.id!, state);
    setUserProfile(userResponse);
    let providerID = userResponse.clientAssignments!.find(
      (assignment) => assignment.client?.id === loggedInClientId,
    )?.serviceProviderProfile?.id;
    fetchAndSetProfile(providerID);
  }

  async function fetchAndSetProfile(providerID: string | undefined) {
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (providerID === undefined) throw Error(placeholderForFutureLogErrorText);
    try {
      const providerResponse = await API_SERVICEPROVIDERS.v1ServiceProvidersIdGet(
        providerID,
        loggedInClientId,
        state,
      );
      setProviderProfile(providerResponse);
      setSelectedCampuses(
        providerResponse.activeSchoolCampuses?.map((c) => ({ id: c.id, name: c.name })) || [],
      );
    } catch (err) {
      dispatch(
        providerNotFoundErrorActions.ACTION_ShowProviderNotFound({
          show: true,
          errorMsg: (err as Error).message,
        }),
      );
    }
  }

  async function handleSave() {
    if (user === undefined) throw Error(placeholderForFutureLogErrorText);
    const providerID = userProfile.clientAssignments!.find(
      (assignment) => assignment.client?.id === loggedInClientId,
    )?.serviceProviderProfile?.id;
    if (providerID === undefined) throw Error(placeholderForFutureLogErrorText);
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);
    let fullName = providerProfile.firstName?.trim() + " " + providerProfile.lastName?.trim();

    const patchServiceProviderRequest: PatchServiceProviderRequest = {
      firstName: providerProfile.firstName,
      lastName: providerProfile.lastName,
      dateOfBirth: providerProfile.dateOfBirth,
      jobTitle: providerProfile.jobTitle,
      npi: providerProfile.npi,
      stateMedicaidNumber: providerProfile.stateMedicaidNumber,
      medicaidCredentials: providerProfile.medicaidCredentials,
      schoolCampuses: selectedCampuses,
    };

    await API_SERVICEPROVIDERS.v1ServiceProvidersIdPatch(
      providerID,
      loggedInClientId,
      state,
      patchServiceProviderRequest,
    );

    try {
      await API_USERS.v1UsersIdPatch(user?.id!, state, {
        firstName: providerProfile.firstName,
        lastName: providerProfile.lastName,
      });
      await API_USERS.v1UsersIdElectronicSignaturesStatementTypePatch(
        user?.id!,
        StatementType.NUMBER_0,
        state,
        {
          ...user?.electronicSignatures?.find(
            (signature) => signature.statementType === StatementType.NUMBER_0,
          ),
          signedByFullName: fullName.trim(),
        },
      );
      await API_USERS.v1UsersIdElectronicSignaturesStatementTypePatch(
        user?.id!,
        StatementType.NUMBER_1,
        state,
        {
          ...user?.electronicSignatures?.find(
            (signature) => signature.statementType === StatementType.NUMBER_1,
          ),
          signedByFullName: fullName.trim(),
        },
      );
      await API_USERS.v1UsersIdElectronicSignaturesStatementTypePatch(
        user?.id!,
        StatementType.NUMBER_2,
        state,
        {
          ...user?.electronicSignatures?.find(
            (signature) => signature.statementType === StatementType.NUMBER_2,
          ),
          signedByFullName: fullName.trim(),
        },
      );
    } catch (err) {
      console.log("UNABLE TO SAVE UPDATE ELECTRONIC SIGNATURE");
    }

    window.location.reload();
  }

  // Hack to use endpoint is to pass the first district id in the list of authorized districts, since every district within a client contains all school campuses
  /* 
    According to Paul
    NOTE: Ideally the list of school campuses would be from a list of Client-level dropdown options, 
    since school campus options could vary by district, 
    but as of right now no such endpoint exists and a hack is in place where every district within a co-op has every school campus listed under it.
    Thus, using the endpoint above 'v1/Districts/{id}/SchoolCampuses/DropdownDisplays' should work for now.
  */
  const selectedDistrictId =
    userClientAssignment.authorizedDistricts && 
    userClientAssignment.authorizedDistricts.length >= 1
      ? userClientAssignment.authorizedDistricts[0].id
      : "Client has no districts.";

  const {
    data: campusOptionsResponse,
    isError: campusDropDownDisplaysIsError,
    isPending: campusDropDownDisplaysIsPending,
    refetch: refetchCampusOptions,
  } = useApiQueryCampusDropDownDisplays({
    queryParams: {
      districtId: selectedDistrictId,
      state: state,
    },
  });

  const [selectedCampuses, setSelectedCampuses] = useState<SchoolCampusRef[]>(
    providerProfile.activeSchoolCampuses?.map((c) => ({
      id: c.id,
      name: c.name,
    })) || [],
  );

  if (providerProfile.medicaidCredentials === null) {
    let temp = providerProfile;
    temp.medicaidCredentials = [] as MedicaidCredential[];
    setProviderProfile({ ...temp });
  }

  useEffect(() => {
    allSignatures?.map((doc) => {
      if (doc.statementType === 1) {
        setFERPA(doc);
      }
      if (doc.statementType === 0) {
        setTrueAndAccurate(doc);
      }
      if (doc.statementType === 2) {
        setElectronicSignatureDoc(doc);
      }
    });
  }, [allSignatures]);

  useEffect(() => {
    setAllSignatures(userProfile.electronicSignatures);
  }, [userProfile]);

  useEffect(() => {
    fetchAndSetUser();
    setAllSignatures(userProfile.electronicSignatures);
  }, []);

  // LOCAL STYLED COMPONENTS
  const Divider = styled(Box)(() => ({
    width: "100%",
    bgcolor: palette.contrasts[3],
    height: "1px",
    marginY: getSizing(2),
  }));

  // STYLE CONSTANTS
  const BOX_HEIGHTS = {
    location: "287px",
    licensingInfo: "495px",
    about: "564px",
    contactInfo: "227px",
  };
  const GRIDBOXGAP = "2rem";
  const HEADER_HEIGHT = getSizing(20);

  function GridboxAbout() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(3),
          padding: getSizing(3),
          border: `solid ${palette.contrasts[3]} 1px`,
          borderRadius: "2",
          flex: 2,
          height: BOX_HEIGHTS.about,
        }}
      >
        <Typography variant="h5">About</Typography>
        <XNGInput
          placeholder="First Name"
          onBlur={(e) => {
            let temp = providerProfile;
            let tempUser = userProfile;
            temp.firstName = e.target.value;
            tempUser.firstName = e.target.value;
            setProviderProfile({ ...temp });
            setUserProfile({ ...tempUser });
          }}
          defaultValue={providerProfile?.firstName}
        />
        <XNGInput
          placeholder="Last Name"
          onBlur={(e) => {
            let temp = providerProfile;
            let tempUser = userProfile;
            temp.lastName = e.target.value;
            tempUser.lastName = e.target.value;
            setProviderProfile({ ...temp });
            setUserProfile({ ...tempUser });
          }}
          defaultValue={providerProfile?.lastName}
        />
        <XNGInput
          placeholder="Date of Birth"
          onBlur={(e) => {
            let temp = providerProfile;
            temp.dateOfBirth = dayjs(e.target.value).toDate();
            setProviderProfile({ ...temp });
          }}
          defaultValue={dayjs(providerProfile?.dateOfBirth).format("MM/DD/YYYY")}
        />
        <XNGInput
          placeholder="Job Title"
          onBlur={(e) => {
            let temp = providerProfile;
            temp.jobTitle = e.target.value;
            setProviderProfile({ ...temp });
          }}
          defaultValue={providerProfile?.jobTitle}
        />
        <XNGInput
          placeholder="NPI"
          onBlur={(e) => {
            let temp = providerProfile;
            temp.npi = e.target.value;
            setProviderProfile({ ...temp });
          }}
          defaultValue={providerProfile?.npi}
        />
        <XNGInput
          placeholder="State Medicaid Number"
          onBlur={(e) => {
            let temp = providerProfile;
            temp.stateMedicaidNumber = e.target.value;
            setProviderProfile({ ...temp });
          }}
          defaultValue={providerProfile?.stateMedicaidNumber}
        />
        <XNGSelect
          options={[]}
          value={""}
          title={userProfile.serviceProviderType?.name}
          handle={() => {}}
          sx={{ pointerEvents: "none" }}
        />
      </Box>
    );
  }

  function GridboxContactInfo() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(3),
          padding: getSizing(3),
          border: `solid ${palette.contrasts[3]} 1px`,
          borderRadius: "2",
          flex: 1,
          height: BOX_HEIGHTS.contactInfo,
        }}
      >
        <Typography variant="h5">Contact Information</Typography>
        <XNGInput
          placeholder="Email Address"
          onBlur={(e) => {
            let temp = providerProfile;
            temp.email = e.target.value;
            setProviderProfile({ ...temp });
          }}
          defaultValue={providerProfile?.email}
        />
        <XNGInput
          placeholder="Phone Number"
          onBlur={(e) => {
            let temp = providerProfile;
            setProviderProfile({ ...temp });
          }}
        />
      </Box>
    );
  }

  function GridboxLocation() {
    const campusSelectLabel = campusDropDownDisplaysIsPending
      ? "Loading Campus Options..."
      : campusDropDownDisplaysIsError
      ? "Failed to load Campus Options"
      : "Campuses";

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(3),
          padding: getSizing(3),
          border: `solid ${palette.contrasts[3]} 1px`,
          borderRadius: "2",
          flex: 1,
          height: BOX_HEIGHTS.location,
        }}
      >
        <Typography variant="h5">Location</Typography>
        <Box>
          <Box display={"flex"} alignItems={"center"}>
            <MSBSearchMultiselect
              selectedOptions={selectedCampuses}
              options={campusOptionsResponse?.schoolCampuses || []}
              getOptionLabel={(option) => `${option?.name}` ?? ""}
              onChange={(newSelectedCampuses) => {
                setSelectedCampuses(newSelectedCampuses);
              }}
              renderOptionVariant="checkbox"
              variant="no overflow after 1"
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label={campusSelectLabel}
              disabled={campusDropDownDisplaysIsPending || campusDropDownDisplaysIsError}
              autocompleteProps={{
                disableCloseOnSelect: true,
                filterOptions: msbMUIAutoCompleteFilterOptions(),
              }}
              sx={{
                flex: 1,
              }}
            />
            <IconButton
              sx={{ display: campusDropDownDisplaysIsError ? "block" : "none" }}
              onClick={() => refetchCampusOptions()}
            >
              <XNGIconRenderer size={"xs"} i={<MSBICONS.Refresh />} />
            </IconButton>
          </Box>
          {campusDropDownDisplaysIsError && (
            <FormHelperText error={campusDropDownDisplaysIsError}>
              Failed to retrieve list of campuses, please click refresh icon to try again.
            </FormHelperText>
          )}
        </Box>
      </Box>
    );
  }

  function GridboxLicensingInfo() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(3),
          padding: getSizing(3),
          border: `solid ${palette.contrasts[3]} 1px`,
          borderRadius: "2",
          flex: 2,
          height: BOX_HEIGHTS.licensingInfo,
        }}
      >
        <Typography variant="h5">Licensing Information</Typography>
        <XNGInput
          placeholder="Name on License"
          onBlur={(e) => {
            let temp = providerProfile;
            if (temp.medicaidCredentials![0] === undefined) {
              temp.medicaidCredentials!.push({} as MedicaidCredential);
            }
            temp.medicaidCredentials![0].nameOnLicense = e.target.value;
            setProviderProfile({ ...temp });
          }}
          defaultValue={
            providerProfile?.medicaidCredentials === undefined
              ? ""
              : providerProfile.medicaidCredentials[0] === undefined
              ? ""
              : providerProfile.medicaidCredentials[0].nameOnLicense
          }
        />
        <XNGInput
          placeholder="Profession"
          onBlur={(e) => {
            let temp = providerProfile;
            if (temp.medicaidCredentials![0] === undefined) {
              temp.medicaidCredentials!.push({} as MedicaidCredential);
            }
            temp.medicaidCredentials![0].profession = e.target.value;
            setProviderProfile({ ...temp });
          }}
          defaultValue={
            providerProfile?.medicaidCredentials === undefined
              ? ""
              : providerProfile.medicaidCredentials[0] === undefined
              ? ""
              : providerProfile.medicaidCredentials[0].profession
          }
        />
        <XNGInput
          placeholder="License Number"
          onBlur={(e) => {
            let temp = providerProfile;
            if (temp.medicaidCredentials![0] === undefined) {
              temp.medicaidCredentials!.push({} as MedicaidCredential);
            }
            temp.medicaidCredentials![0].licenseNumber = e.target.value;
            setProviderProfile({ ...temp });
          }}
          defaultValue={
            providerProfile?.medicaidCredentials === undefined
              ? ""
              : providerProfile.medicaidCredentials[0] === undefined
              ? ""
              : providerProfile.medicaidCredentials[0].licenseNumber
          }
        />
        <XNGInput
          placeholder="License Expiration Date"
          onBlur={(e) => {
            let temp = providerProfile;
            if (temp.medicaidCredentials![0] === undefined) {
              temp.medicaidCredentials!.push({} as MedicaidCredential);
            }
            temp.medicaidCredentials![0].endDate = dayjs(e.target.value).toDate();
            setProviderProfile({ ...temp });
          }}
          defaultValue={
            providerProfile?.medicaidCredentials === undefined
              ? ""
              : providerProfile.medicaidCredentials[0] === undefined
              ? ""
              : dayjs(providerProfile.medicaidCredentials[0].endDate).format("MM/DD/YYYY")
          }
        />
      </Box>
    );
  }

  function SignaturesSection() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: getSizing(2),
          border: `solid ${palette.contrasts[3]} 1px`,
          borderRadius: "2",
          flex: 1,
          mt: GRIDBOXGAP,
          mb: getSizing(8),
          "& .MuiCheckbox-root.Mui-checked": {
            svg: {
              color: palette.disabled,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", paddingBottom: getSizing(2) }}>
          <Typography variant="h5">Signatures</Typography>
        </Box>

        <Box sx={{ display: "flex", paddingBottom: getSizing(1) }}>
          <Box
            sx={{
              display: "flex",
              marginLeft: getSizing(1),
              maxWidth: getSizing(43),
              flex: 1,
            }}
          >
            <Typography variant="h6">Completed:</Typography>
          </Box>
          <Box sx={{ display: "flex", maxWidth: getSizing(43), flex: 1 }}>
            <Typography variant="h6">Signature Date:</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              marginLeft: getSizing(1),
              maxWidth: getSizing(43),
              flex: 1,
              alignItems: "center",
            }}
          >
            <XNGCheckbox
              checked={FERPA === undefined ? false : FERPA.isSigned ? true : false}
              onToggle={() => {
                setFERPAModal(true);
              }}
            />
            <Typography variant="body1">FERPA Authorization Statement</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              maxWidth: getSizing(43),
              flex: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="body1">
              {FERPA === undefined
                ? "----"
                : dayjs(FERPA.signedOnDateLocal).format("MM/DD/YYYY") === "01/01/1901"
                ? "----"
                : dayjs(FERPA.signedOnDateLocal).format("MM/DD/YYYY - hh:mm A")}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              marginLeft: getSizing(1),
              maxWidth: getSizing(43),
              flex: 1,
              alignItems: "center",
            }}
          >
            <XNGCheckbox
              checked={TrueAndAccurate === undefined ? false : TrueAndAccurate.isSigned!}
              onToggle={() => {
                setTrueAndAccurateModal(true);
              }}
            />
            <Typography variant="body1">True & Accurate Data Authorization</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              maxWidth: getSizing(43),
              flex: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="body1">
              {TrueAndAccurate === undefined
                ? "----"
                : dayjs(TrueAndAccurate.signedOnDateLocal).format("MM/DD/YYYY") === "01/01/1901"
                ? "----"
                : dayjs(TrueAndAccurate.signedOnDateLocal).format("MM/DD/YYYY - hh:mm A")}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              display: "flex",
              marginLeft: getSizing(1),
              maxWidth: getSizing(43),
              flex: 1,
              alignItems: "center",
            }}
          >
            <XNGCheckbox
              checked={
                electronicSignaturesDoc === undefined ? false : electronicSignaturesDoc.isSigned!
              }
              onToggle={() => {
                setElectronicSignatureModal(true);
              }}
            />
            <Typography variant="body1">Electronic Signature Consent</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              maxWidth: getSizing(43),
              flex: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="body1">
              {electronicSignaturesDoc === undefined
                ? "----"
                : dayjs(electronicSignaturesDoc.signedOnDateLocal).format("MM/DD/YYYY") ===
                  "01/01/1901"
                ? "----"
                : dayjs(electronicSignaturesDoc.signedOnDateLocal).format("MM/DD/YYYY - hh:mm A")}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <>
      {/* Modals */}
      <FERPAModal FERPAModalCheck={FERPAModalCheck} setFERPAModal={setFERPAModal} />
      <TrueAndAccurateModal
        trueAndAccurateModalCheck={trueAndAccurateModalCheck}
        setTrueAndAccurateModal={setTrueAndAccurateModal}
      />
      <ElectronicSignatureModal
        electronicSignatureModalCheck={electronicSignatureModalCheck}
        setElectronicSignatureModal={setElectronicSignatureModal}
        fullName={userProfile.firstName + " " + userProfile.lastName}
      />
      {/* DOM Hierarchy */}
      {providerProfile.firstName === undefined || providerProfile.lastName === undefined ? null : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            paddingBottom: getSizing(20),
          }}
        >
          <Box
            sx={{
              minHeight: HEADER_HEIGHT,
              background: "linear-gradient(45deg, #053E4E 10%, #206A7E 40%, #96B7C0 90%)",
            }}
          >
            <Container maxWidth="md">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  minHeight: HEADER_HEIGHT,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: getSizing(2),
                    marginBottom: isGreaterThanMd ? getSizing(-3) : getSizing(-1),
                  }}
                >
                  <XNGIconRenderer
                    color={palette.contrasts[3]}
                    size={isGreaterThanMd ? "150px" : "75px"}
                    i={<XNGICONS.Avatar />}
                  />

                  <Typography
                    className="noselect"
                    variant="h4"
                    color={palette.contrasts[4]}
                    sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    {providerProfile.firstName} {providerProfile.lastName}
                  </Typography>
                </Box>
              </Box>
            </Container>
          </Box>

          <Container maxWidth="md">
            <Box
              sx={{
                display: "flex",
                paddingY: getSizing(3),
                marginRight: 0,
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <XNGButton
                variant="outline"
                onClick={() => dispatch(ACTION_setForceAccountRegistration(true))}
              >
                Change Access Request
              </XNGButton>
              <XNGButton variant="filled" onClick={handleSave}>
                Save
              </XNGButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: isGreaterThanMd ? "row" : "column",
                width: "100%",
                gap: GRIDBOXGAP,
              }}
            >
              <Box
                name="left"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: GRIDBOXGAP,
                }}
              >
                <GridboxAbout />
                <GridboxContactInfo />
              </Box>

              <Box
                name="right"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: GRIDBOXGAP,
                }}
              >
                <GridboxLocation />
                <GridboxLicensingInfo />
              </Box>
            </Box>

            {/* SIGNATURES */}
            <SignaturesSection />
          </Container>
        </Box>
      )}
    </>
  );
}
