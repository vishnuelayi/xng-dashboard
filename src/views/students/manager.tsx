import {
  Avatar,
  ButtonBase,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { XNGICONS, XNGIconRenderer } from "../../design/icons";
import SidebarLayout from "../../layouts/SidebarLayout";
import XNGInput from "../../design/low-level/input";
import XNGToggleGroup from "../../design/low-level/button_togglegroup";
import XNGProgress from "../../design/low-level/progress";
import MediaQueryBox from "../../design/components-dev/MediaQueryBox";
import { getSizing } from "../../design/sizing";
import XNGCard from "../../design/low-level/card";
import XNGAvatar from "../../design/low-level/avatar";
import dayjs from "dayjs";
import usePalette from "../../hooks/usePalette";
import { addStudentGradeSuffix } from "../../utils/add_student_grade_suffix";
import React, { useEffect, useState } from "react";
import XNGButton from "../../design/low-level/button";
import { STUDENTS_SIDEBAR, DAYJS_FORMATTER_DONTUSE } from "./_";
import XNGModal from "../../design/low-level/modal";
import TableAccordion_StudentProfile from "../../design/high-level/table_accordions/student_profile";
import XNGSelect from "../../design/low-level/dropdown";
import Box from "../../design/components-dev/BoxExtended";
import FadeIn from "../../design/components-dev/FadeIn";
import { API_DISTRICTS, API_SERVICEPROVIDERS, API_STUDENTS } from "../../api/api";
import { useXNGDispatch, useXNGSelector } from "../../context/store";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment, selectUser } from "../../context/slices/userProfileSlice";
import { selectClientID } from "../../context/slices/loggedInClientSlice";
import { placeholderForFutureLogErrorText } from "../../temp/errorText";
import {
  CaseloadStudentDisplay,
  ClientRef,
  CreateStudentRequest,
  GetCaseloadStudentsResponse,
  PlanOfCare,
  PrescribedCareProvisionsLedger,
  SchoolCampusAssignment,
  SchoolCampusRef,
  SpedDossier,
  StudentRef,
} from "../../profile-sdk";
import XNGSpinner from "../../design/low-level/spinner";
import { useNavigate } from "react-router-dom";
import { selectActingServiceProvider } from "../../context/slices/dataEntryProvider";
import genderOptions from "../../data/genderOptionsData";
import { LIGHT } from "../../design/colors/themes/light";
import XNGClose from "../../design/low-level/button_close";
import CreateStudentForm from "./components/studentManager/createStudentForm";
import { XNGCheckbox } from "../../design";
import useApiQueryServiceProviderById from "../../api/hooks/service_provider/use_api_query_service_provider_by_id";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 458,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
// sorting utility functino for students in caseload
const sortStudentCallback = (a: CaseloadStudentDisplay, b: CaseloadStudentDisplay) => {
  const nameA = (a.lastName?.toLocaleLowerCase() || "") + (a.firstName?.toLocaleLowerCase() || "");
  const nameB = (b.lastName?.toLocaleLowerCase() || "") + (b.firstName?.toLocaleLowerCase() || "");

  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

const getProgressPercentage = (s: CaseloadStudentDisplay) => {
  const today = new Date().getTime();
  let start = s.activePlanOfCare?.startDate;
  let end = s.activePlanOfCare?.endDate;

  if (!start || !end) return 0;
  start = new Date(start);
  end = new Date(end);

  return ((today - start.getTime()) / (end.getTime() - start.getTime())) * 100;
};

function StudentManager() {
  // SX PROPS
  const SX_CARD_GRID: SxProps = {
    maxWidth: "100%",
    display: "flex",
    flexWrap: "wrap",
    columnGap: getSizing(5),
    rowGap: getSizing(3),
    marginTop: getSizing(1),
    marginX: getSizing(4),
  };

  // HOOKS
  const thm = useTheme();
  const isMd = useMediaQuery(thm.breakpoints.only("md"));
  const palette = usePalette();

  // DISPLAY MODEL

  // STATES
  const [layoutBool, setLayoutBool] = useState(true);
  const [studentCaseLoad, setStudentCaseLoad] = useState<GetCaseloadStudentsResponse>();
  const [filteredStudents, setFilteredStudents] = useState<CaseloadStudentDisplay[]>(
    [] as CaseloadStudentDisplay[],
  );
  const [searchedStudents, setSearchedStudents] = useState<CaseloadStudentDisplay[]>(
    [] as CaseloadStudentDisplay[],
  );
  const [failedStudentFetches, setFailedStudentFetches] = useState<StudentRef[]>(
    [] as StudentRef[],
  );
  const [campusList, setCampusList] = useState<SchoolCampusRef[] | undefined>();
  //SELECTORS
  const user = useXNGSelector(selectUser);
  const state = useXNGSelector(selectStateInUS);
  const loggedInClientId = useXNGSelector(selectClientID);
  const userClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const actingServiceProvider = useXNGSelector(selectActingServiceProvider);
  const usesCampusRestrictions = !!useXNGSelector(
    (state) => state.loggedInClient?.usesCampusRestrictions
  );

  const { data: serviceProviderProfile } = useApiQueryServiceProviderById({
    queryParams: {
      clientId: loggedInClientId,
      providerId: actingServiceProvider?.id,
      state: state,
    },
    options: {
      staleTime: 60 * 60 * 1000,
    }
  });
  //Filter

  async function fetchAndSetCaseLoad() {
    const providerID = actingServiceProvider?.id;
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (providerID === undefined) throw Error(placeholderForFutureLogErrorText);

    const caseLoadResponse = await API_STUDENTS.v1StudentsCaseloadGet(
      providerID,

      loggedInClientId,

      state,
    );
    // console.log( "RESPONSE: ",caseLoadResponse);
    setStudentCaseLoad(caseLoadResponse);
    const tempFailedStudentFetches = caseLoadResponse.failedStudentFetches ?? [];
    setFailedStudentFetches(tempFailedStudentFetches);

    const arr = [...caseLoadResponse.caseloadStudentDisplays!];
    // console.log(arr, "ORIGINAL");

    arr.sort(sortStudentCallback);

    setFilteredStudents(arr);
    // console.log(arr, "SORTED");
  }

  async function fetchAndSetCampusList() {
    const providerID = actingServiceProvider?.id;
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (providerID === undefined) throw Error(placeholderForFutureLogErrorText);
    let authorizedSchool = userClientAssignment.authorizedDistricts![0].id;
    if (!authorizedSchool) {
      return;
    }
    const campusResponse = await API_DISTRICTS.v1DistrictsIdSchoolCampusesDropdownDisplaysGet(
      authorizedSchool,
      state,
    );
    setCampusList(campusResponse.schoolCampuses);
  }

  async function createAndAddStudent(body: CreateStudentRequest, caseload: boolean) {
    const providerID = actingServiceProvider?.id;
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (providerID === undefined) throw Error(placeholderForFutureLogErrorText);
    body.client = {} as ClientRef;
    body.client.id = loggedInClientId;
    body.client!.name = userClientAssignment.client?.name;

    const createResponse = await API_STUDENTS.v1StudentsPost(state, body);
    const studentID = createResponse.id;
    if (studentID === undefined) throw Error(placeholderForFutureLogErrorText);
    if (caseload) {
      const addStudentResponse =
        await API_SERVICEPROVIDERS.v1ServiceProvidersIdStudentCaseloadAddStudentPatch(
          providerID,
          loggedInClientId,
          studentID,
          state,
        );
      fetchAndSetCaseLoad();
    }
  }

  async function deleteStudent(studentID: CreateStudentRequest[]) {
    const providerID = actingServiceProvider?.id;
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (providerID === undefined) throw Error(placeholderForFutureLogErrorText);

    const studentIds = studentID.map((student: any) => {
      return student.id;
    });
    await API_SERVICEPROVIDERS.v1ServiceProvidersIdStudentCaseloadRemoveStudentsPatch(
      studentIds,
      providerID,
      loggedInClientId,
      state,
    );

    fetchAndSetCaseLoad();

    // const deleteResponse = await API_SERVICEPROVIDERS.v1ServiceProvidersIdStudentCaseloadRemoveStudentPatch(providerID, loggedInClientId, studentID, state)
    // console.log("delete response",deleteResponse)
  }

  async function searchForStudent(search: string) {
    const providerID = actingServiceProvider?.id;
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (providerID === undefined) throw Error(placeholderForFutureLogErrorText);
    let authorizedSchool = userClientAssignment.authorizedDistricts![0].id!;

    const searchResponse = await API_STUDENTS.v1StudentsSearchGet(
      loggedInClientId,
      search,
      state,
      usesCampusRestrictions
        ? serviceProviderProfile?.activeSchoolCampuses?.map((campus) => campus.id).join(",")
        : undefined,
    );
    setSearchedStudents(searchResponse.caseloadStudentDisplays!.sort(sortStudentCallback));
  }

  async function addFromSearch(studentID: string) {
    const providerID = actingServiceProvider?.id;
    if (loggedInClientId === undefined) throw Error(placeholderForFutureLogErrorText);
    if (providerID === undefined) throw Error(placeholderForFutureLogErrorText);

    if (studentID === undefined) throw Error(placeholderForFutureLogErrorText);
    const addStudentResponse =
      await API_SERVICEPROVIDERS.v1ServiceProvidersIdStudentCaseloadAddStudentPatch(
        providerID,
        loggedInClientId,
        studentID,
        state,
      );
    fetchAndSetCaseLoad();
  }

  useEffect(() => {
    fetchAndSetCaseLoad();
  }, [actingServiceProvider]);
  useEffect(() => {
    fetchAndSetCampusList();
  }, [userClientAssignment]);

  // DOM HIERARCHY
  return (
    <>
      {studentCaseLoad === undefined ? (
        <XNGSpinner fullPage />
      ) : (
        <SidebarLayout
          sidebarContent={STUDENTS_SIDEBAR.tabs}
          content={
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <HeaderController
                layoutBool={layoutBool}
                setLayoutBool={setLayoutBool}
                filteredStudents={filteredStudents}
                setFilteredStudents={setFilteredStudents}
                studentCaseLoad={studentCaseLoad.caseloadStudentDisplays!}
                createAndAddStudent={createAndAddStudent}
                deleteStudent={deleteStudent}
                searchForStudent={searchForStudent}
                campusList={campusList}
                usesCampusRestrictions={usesCampusRestrictions}
              />

              {layoutBool ? (
                <Box
                  sx={{
                    display: "flex",
                    paddingX: getSizing(5),
                    marginTop: getSizing(3),
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">My Caseload</Typography>
                  <Box sx={{ display: "flex", gap: getSizing(2) }}>
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="subtitle1" className="noselect">
                        Filter Results:{" "}
                        <Typography
                          display={"inline"}
                          variant="subtitle1"
                          color={palette.primary[2]}
                        >
                          {filteredStudents.length}
                        </Typography>
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <Typography variant="subtitle1" className="noselect">
                        Student Results:{" "}
                        <Typography
                          display={"inline"}
                          variant="subtitle1"
                          color={palette.primary[2]}
                        >
                          {studentCaseLoad.caseloadStudentDisplays!.length}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : null}
              <Box sx={SX_CARD_GRID}>
                {layoutBool &&
                  filteredStudents.map((s: CaseloadStudentDisplay, i) => {
                    return <StudentCard s={s} animIndex={i} key={s.id} />;
                  })}
              </Box>
              <Box
                marginX={getSizing(4)}
                mt={"1rem"}
                display={"flex"}
                gap={getSizing(2)}
                flexWrap={"wrap"}
              >
                {failedStudentFetches.map((student) => (
                  <StudentCard
                    key={student.id}
                    animIndex={1}
                    errorStudent={student}
                    errorMessage="This student's information could not be found. 
                If this student is not currently active on your caseload, 
                you can remove them. Otherwise, please 
                contact client care."
                  />
                ))}
              </Box>
              {layoutBool && searchedStudents.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    paddingTop: getSizing(5),
                    paddingLeft: getSizing(2),
                  }}
                >
                  <Typography variant="h5">Search Results:</Typography>
                </Box>
              ) : null}
              {searchedStudents.length > 0 ? (
                <Box sx={SX_CARD_GRID}>
                  {layoutBool &&
                    searchedStudents.map((s: StudentRef, i) => {
                      return (
                        <SearchCard
                          addFromSearch={addFromSearch}
                          s={s}
                          animIndex={i}
                          key={i}
                          filteredStudents={filteredStudents}
                        />
                      );
                    })}
                </Box>
              ) : null}

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: getSizing(2),
                  paddingX: getSizing(5),
                }}
              >
                {!layoutBool ? <StudentTable s={studentCaseLoad.caseloadStudentDisplays!} /> : null}
              </Box>
            </Box>
          }
        />
      )}
    </>
  );
}

function StudentCard(props: {
  s?: CaseloadStudentDisplay;
  animIndex: number;
  errorStudent?: StudentRef;
  errorMessage?: string;
}) {
  const s = props.s;
  const palette = usePalette();
  if (s && s.activeSchoolCampuses === null) {
    s.activeSchoolCampuses = [] as SchoolCampusAssignment[];
  }
  if (s && s.activePlanOfCare === null) {
    s.activePlanOfCare = {} as PlanOfCare;
    s.activePlanOfCare.type = 0;
  }
  if (s && s.activePlanOfCare?.startDate === null) {
    s.activePlanOfCare.startDate = undefined;
    s.activePlanOfCare.endDate = undefined;
  }

  const planType = ["IEP", "Referal", "504", "RtiMtss", "Ell", "Other"];
  const navigate = useNavigate();
  const path = `/xlogs/students/manager/${s?.id}`;
  const fInitial = s?.firstName
    ? s.firstName[0]
    : props.errorStudent?.firstName
    ? props.errorStudent.firstName[0]
    : "S";
  const lInitial = s?.lastName
    ? s.lastName[0]
    : props.errorStudent?.lastName
    ? props.errorStudent.lastName[0]
    : "N";

  return (
    <FadeIn i={props.animIndex}>
      <ButtonBase>
        <XNGCard
          sx={{
            display: "flex",
            maxWidth: getSizing(34),
            paddingX: getSizing(2),
            paddingTop: getSizing(3),
            paddingBottom: getSizing(4),
            width: "269px",
            height: "345px",
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column" }}
            onClick={() => {
              if (s) navigate(path);
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: getSizing(1.5),
                alignItems: "center",
              }}
            >
              {s ? (
                <XNGAvatar size="lg" text={fInitial + lInitial} />
              ) : (
                <Avatar
                  alt="Broken student date Icon"
                  sx={{
                    width: "75px",
                    height: "75px",
                    bgcolor: LIGHT.danger[1],
                  }}
                >
                  <XNGIconRenderer size={"65%"} i={<XNGICONS.Alert />} color="white" />
                </Avatar>
              )}
              <Typography variant="h6" color={s ? palette.primary[2] : palette.danger[1]}>
                {s?.firstName || props.errorStudent?.firstName}{" "}
                {s?.lastName || props.errorStudent?.lastName}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: getSizing(4),
                paddingTop: getSizing(2),
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <Typography variant="body2" color={s ? palette.primary[2] : palette.danger[1]}>
                  DOB
                </Typography>
                <Typography variant="body2">
                  {dayjs(s?.dateOfBirth).format(DAYJS_FORMATTER_DONTUSE)}
                </Typography>
              </Box>
              {s && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <Typography variant="body2" color={palette.primary[2]}>
                    Grade
                  </Typography>
                  <Typography variant="body2">
                    {addStudentGradeSuffix(s?.grade!.valueOf())}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <Typography variant="body2" color={s ? palette.primary[2] : palette.danger[1]}>
                  {s ? "Student ID" : "Medicaid ID"}
                </Typography>
                <Typography variant="body2">
                  {s?.studentIdGivenBySchoolDistrict || props.errorStudent?.medicaidId}
                </Typography>
              </Box>
            </Box>
            {s && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: getSizing(2),
                  alignItems: "start",
                }}
              >
                <Typography variant="body2" color={palette.primary[2]}>
                  Campus
                </Typography>
                <Typography variant="body2">
                  {s.activeSchoolCampuses ? s.activeSchoolCampuses[0]?.name : "School campus"}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", paddingY: getSizing(2), width: "100%" }}>
              <Box
                sx={{
                  width: "100%",
                  bgcolor: palette.contrasts[3],
                  height: "1px",
                  marginY: getSizing(s ? 1 : 0.5),
                }}
              />
            </Box>
            {s && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <Typography variant="body2" color={palette.primary[2]}>
                    {planType[s?.activePlanOfCare?.type!]} Duration
                  </Typography>
                  <Typography variant="body2">
                    {dayjs(s?.activePlanOfCare?.startDate).format(DAYJS_FORMATTER_DONTUSE)}-
                    {dayjs(s?.activePlanOfCare?.endDate).format(DAYJS_FORMATTER_DONTUSE)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    paddingTop: getSizing(2),
                    flexDirection: "column",
                  }}
                >
                  <XNGProgress progress={getProgressPercentage(s)} />
                </Box>
              </>
            )}
            {!s && (
              <Box textAlign={"left"}>
                <Typography fontWeight={"600"} color={palette.danger[1]}>
                  Error Message
                </Typography>
                <Typography variant="body2" fontSize={"13px"}>
                  {props.errorMessage}
                </Typography>
              </Box>
            )}
          </Box>
        </XNGCard>
      </ButtonBase>
    </FadeIn>
  );
}

function StudentTable(props: { s: CaseloadStudentDisplay[] }) {
  return (
    <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
      <TableAccordion_StudentProfile rows={props.s} accordionBreakpoint="md" />
    </Box>
  );
}

function HeaderController(props: {
  layoutBool: boolean;
  setLayoutBool: any;
  filteredStudents: CaseloadStudentDisplay[];
  setFilteredStudents: React.Dispatch<React.SetStateAction<CaseloadStudentDisplay[]>>;
  studentCaseLoad: CaseloadStudentDisplay[];
  createAndAddStudent: Function;
  deleteStudent: Function;
  searchForStudent: Function;
  campusList: SchoolCampusRef[] | undefined;
  usesCampusRestrictions: boolean;
}) {
  const thm = useTheme();
  const palette = usePalette();
  const [medicaidBool, setMedicaidBool] = useState(false);
  const [createNew, setCreateNew] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(false);
  const [planOptionValues] = useState(["All", "IEP", "504", "ELL"]);
  const [selectPlan, setSelectPlan] = useState<string>("");
  const [selectCampus, setSelectCampus] = useState<string[]>([]);
  const [gradeOptionValues] = useState([
    "All",
    "PreK",
    "K",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ]);
  const [selectGrade, setSelectGrade] = useState<string[]>([]);
  const dispatch = useXNGDispatch();
  const handleSearch = (e: any) => {
    if (e.target.value.length >= 1) props.searchForStudent(e.target.value);
  };

  function filterIt() {
    let test = props.studentCaseLoad;

    if (medicaidBool) {
      test = test.filter((it) => it.medicaidId);
    }
    if (selectGrade[0]) {
      if (!selectGrade.includes("All")) {
        test = test.filter((it) =>
          selectGrade.includes(gradeOptionValues[it.grade?.valueOf()! + 1]),
        );
      }
    }
    if (selectCampus[0]) {
      test = test.filter((it) => {
        return selectCampus.some((campus) => campus === it.activeSchoolCampuses![0]?.name);
      });
    }

    props.setFilteredStudents(test.sort(sortStudentCallback));
  }

  useEffect(() => {
    filterIt();
  }, [selectCampus, selectGrade, medicaidBool]);

  const handleSelectPlan = (e: any) => {
    setSelectPlan(e.target.value);
  };

  return (
    <>
      <MediaQueryBox
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
        showIf={thm.breakpoints.down("md")}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h5">Student Manager</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <XNGToggleGroup
            options={[{ label: "Create" }, { label: "Remove" }, { label: "Upload" }]}
          />
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", paddingRight: getSizing(7) }}>
            <XNGIconRenderer i={<XNGICONS.Filter />} size="sm" />
            <Typography variant="body1">Filter Results: {props.filteredStudents.length}</Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography variant="body1">Student Results: {props.studentCaseLoad.length}</Typography>
            <XNGIconRenderer i={<XNGICONS.Grid4X4 />} size="sm" />
          </Box>
        </Box>
      </MediaQueryBox>

      <MediaQueryBox
        sx={{
          display: "block",
          width: "100%",
          paddingX: getSizing(5),
          paddingTop: getSizing(3),
          paddingBottom: getSizing(3),
          backgroundColor: palette.primary[1],
        }}
        showIf={thm.breakpoints.up("md")}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingY: getSizing(2),
              alignItems: "center",
            }}
          >
            <Typography color={palette.contrasts[5]} variant="h5">
              Student Manager
            </Typography>
            <Box sx={{ display: "flex", gap: getSizing(2) }}>
              <XNGButton
                sx={{
                  backgroundColor: palette.contrasts[5],
                  color: palette.primary[1],
                  ":hover": {
                    backgroundColor: palette.primary[3],
                    color: palette.contrasts[5],
                  },
                }}
                onClick={() => {
                  setCreateNew(!createNew);
                }}
              >
                Create{" "}
              </XNGButton>
              <XNGButton
                sx={{
                  backgroundColor: palette.contrasts[5],
                  color: palette.primary[1],
                  ":hover": {
                    backgroundColor: palette.primary[3],
                    color: palette.contrasts[5],
                  },
                }}
                onClick={() => {
                  setDeleteStudent(!deleteStudent);
                }}
              >
                Remove
              </XNGButton>
              <XNGButton
                sx={{
                  backgroundColor: palette.contrasts[5],
                  color: palette.primary[1],
                  ":hover": {
                    backgroundColor: palette.primary[3],
                    color: palette.contrasts[5],
                  },
                }}
                onClick={() => {}}
              >
                Upload
              </XNGButton>
            </Box>
            {/* {createNew ? <CreateModal setShowModal={setCreateNew} createAndAddStudent={props.createAndAddStudent}/> : null} */}
            {createNew ? (
              <CreateStudentForm
                open={createNew}
                handleClose={() => setCreateNew(false)}
                createStudent={props.createAndAddStudent}
              />
            ) : null}
            {deleteStudent ? (
              <DeleteModal
                setShowModal={setDeleteStudent}
                studentCaseLoad={props.studentCaseLoad}
                deleteStudent={props.deleteStudent}
              />
            ) : null}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {props.layoutBool ? (
              <Box
                sx={{
                  display: "flex",
                  paddingRight: getSizing(7),
                  alignItems: "center",
                  gap: getSizing(2),
                }}
              >
                <XNGIconRenderer i={<XNGICONS.Filter />} size="sm" color={palette.contrasts[5]} />
                <FormControl sx={{ width: getSizing(7) }}>
                  <Select
                    labelId="campusSelector"
                    id="campusSelect"
                    multiple
                    displayEmpty
                    size="medium"
                    sx={{
                      height: "32px",
                      width: "176px",
                      backgroundColor: palette.contrasts[5],
                    }}
                    value={selectCampus}
                    title="Campus"
                    onChange={(e) => {
                      setSelectCampus(e.target.value as string[]);
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return "Campus";
                      }
                      if (selected.includes("All")) {
                        return "Campus (All)";
                      } else {
                        return `Campus \(${selected.length} selected\)`;
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: { maxHeight: "20rem" },
                      },
                    }}
                  >
                    {props.campusList?.map((campus, i) => (
                      <MenuItem key={i} value={campus.name}>
                        <Checkbox
                          checked={!!selectCampus?.find((dCampus) => dCampus === campus.name)}
                        />

                        <ListItemText primary={campus.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ paddingLeft: getSizing(15), width: getSizing(7) }}>
                  <Select
                    labelId="gradeSelector"
                    id="gradezz"
                    multiple
                    displayEmpty
                    size="medium"
                    sx={{
                      height: "32px",
                      width: "176px",
                      backgroundColor: palette.contrasts[5],
                    }}
                    value={selectGrade}
                    title="Grades"
                    onChange={(e) => {
                      setSelectGrade(e.target.value as string[]);
                    }}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return "Grade";
                      }
                      if (selected.includes("All")) {
                        return "Grade (All)";
                      } else {
                        return `Grade \(${selected.length} selected\)`;
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: { maxHeight: "20rem" },
                      },
                    }}
                  >
                    {gradeOptionValues?.map((grade, i) => (
                      <MenuItem key={i} value={grade}>
                        <Checkbox checked={!!selectGrade?.find((dGrade) => dGrade === grade)} />

                        <ListItemText primary={grade} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/*            <XNGSelect
                  options={gradeOptionValues}
                  value={selectGrade}
                  handle={handleSelectGrade}
                  title="Grade"
                  size="large"
                  sx={{ backgroundColor: palette.contrasts[5] }}
                />
                */}
                <StudentManagerToggle
                  value={medicaidBool}
                  label={"Medicaid Only"}
                  onChange={() => setMedicaidBool(!medicaidBool)}
                  isFirstComponent
                />
              </Box>
            ) : (
              <Box></Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: getSizing(2) }}>
              <XNGIconRenderer disableRenderer i={<XNGICONS.Search />} size="md" color="white" />
              <XNGInput
                placeholder="Search Student"
                sx={{ backgroundColor: palette.contrasts[5] }}
                onChange={(e) => {
                  handleSearch(e);
                }}
              />
              {props.layoutBool ? (
                <XNGIconRenderer
                  onClick={() => props.setLayoutBool(!props.layoutBool)}
                  i={<XNGICONS.Grid4X4 />}
                  size="sm"
                  color={palette.contrasts[5]}
                />
              ) : (
                <XNGIconRenderer
                  onClick={() => {
                    props.setLayoutBool(!props.layoutBool);
                  }}
                  i={<XNGICONS.ThreeHorizontalLines />}
                  size="sm"
                  color={palette.contrasts[5]}
                />
              )}
            </Box>
          </Box>
        </Box>
      </MediaQueryBox>
    </>
  );
}

function CreateModal(props: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  createAndAddStudent: Function;
}) {
  const palette = usePalette();

  const [gender, setGender] = useState<string[]>(genderOptions);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [newStudent, setNewStudent] = useState<CreateStudentRequest>({} as CreateStudentRequest);

  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleSelectGender = (e: any) => {
    setSelectedGender(e.target.value);
    let temp = newStudent;
    switch (e.target.value) {
      case "Male":
        temp.gender = 0;
        break;
      case "Female":
        temp.gender = 1;
        break;
      case "Unkown":
        temp.gender = 0;
        break;
    }
    setNewStudent({ ...temp });
  };

  useEffect(() => {
    let temp = newStudent;
    temp.spedDossier = {} as SpedDossier;
    temp.spedDossier.prescribedCareProvisionsLedger = {
      goals: [],
    } as PrescribedCareProvisionsLedger;
    temp.spedDossier.plansOfCare = [] as PlanOfCare[];
    temp.spedDossier.plansOfCare.push({} as PlanOfCare);
    temp.spedDossier.plansOfCare[0].type = 0;
    setNewStudent({ ...temp });

    return () => {
      setNewStudent({} as CreateStudentRequest);
    };
  }, []);

  return (
    <XNGModal setShowModal={props.setShowModal}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Create New Student
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Please fill out the information below to quickly add a new student.
        </Typography>
        <form onSubmit={onSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2) }}>
            <XNGInput
              placeholder="First name"
              onBlur={(e) => {
                let temp = newStudent;
                temp.firstName = e.target.value;
                setNewStudent({ ...temp });
              }}
            />
            <XNGInput
              placeholder="Last name"
              onBlur={(e) => {
                let temp = newStudent;
                temp.lastName = e.target.value;
                setNewStudent({ ...temp });
              }}
            />
            <XNGInput
              placeholder="DOB"
              onBlur={(e) => {
                let temp = newStudent;
                temp.dateOfBirth = dayjs(e.target.value).toDate();
                setNewStudent({ ...temp });
              }}
            />
            <XNGInput
              placeholder="Student ID"
              onBlur={(e) => {
                let temp = newStudent;
                temp.studentIdGivenBySchoolDistrict = e.target.value;
                setNewStudent({ ...temp });
              }}
            />
            <XNGSelect
              options={gender}
              value={selectedGender}
              handle={handleSelectGender}
              title="Gender"
              size="large"
              sx={{ backgroundColor: palette.contrasts[5] }}
            />
            <Box sx={{ display: "flex", paddingTop: getSizing(3) }}>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  paddingRight: getSizing(2),
                  paddingBottom: getSizing(1),
                }}
              >
                <XNGButton
                  onClick={() => {
                    props.createAndAddStudent(newStudent, false);
                    props.setShowModal(false);
                  }}
                >
                  Create Student
                </XNGButton>
                <Box
                  sx={{
                    position: "relative",
                    paddingRight: getSizing(2),
                    paddingTop: getSizing(1),
                  }}
                >
                  <XNGButton
                    onClick={() => {
                      props.createAndAddStudent(newStudent, true);
                      props.setShowModal(false);
                    }}
                  >
                    Create & Add to Caseload
                  </XNGButton>
                </Box>
              </Box>
              <Box sx={{ position: "relative", paddingRight: getSizing(2) }}>
                <XNGButton
                  onClick={() => {
                    props.setShowModal(false);
                  }}
                >
                  Back to Search
                </XNGButton>
              </Box>
            </Box>
          </Box>
        </form>
      </Box>
    </XNGModal>
  );
}

function DeleteModal(props: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteStudent: Function;
  studentCaseLoad: CreateStudentRequest[];
}) {
  const [deleteStudentList, setDeleteStudentList] = useState<CreateStudentRequest[]>(
    [] as CreateStudentRequest[],
  );

  const handleRemove = () => {
    props.deleteStudent(deleteStudentList);
    props.setShowModal(false);
  };

  const handleSelectAll = () => {
    if (deleteStudentList.length === props.studentCaseLoad.length) {
      setDeleteStudentList([]);
    } else {
      setDeleteStudentList([...props.studentCaseLoad]);
    }
  };

  return (
    <XNGModal setShowModal={props.setShowModal}>
      <Box sx={style}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Remove Student from Caseload
          </Typography>
          <XNGClose onClick={() => props.setShowModal(false)} />
        </Box>
        <Typography id="modal-modal-description" sx={{ mt: 2, paddingBottom: getSizing(2) }}>
          Select the student(s) you would like to remove from your caseload. This action will not
          delete any student data.
        </Typography>
        {props.studentCaseLoad.length > 1 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: getSizing(1) }}>
            <XNGCheckbox
              checked={deleteStudentList.length === props.studentCaseLoad.length}
              onToggle={() => {
                handleSelectAll();
              }}
            />
            <Typography variant="body1">Select All</Typography>
          </Box>
        )}
        <XNGCard
          sx={{
            maxHeight: getSizing(36),
            overflowY: "scroll",
            paddingBottom: 1,
          }}
        >
          {props.studentCaseLoad.map((s: any) => {
            const handleCheck = () => {
              let temp = deleteStudentList;
              if (temp.includes(s)) {
                temp.splice(temp.indexOf(s), 1);
                setDeleteStudentList([...temp]);
              } else {
                temp.push(s);
                setDeleteStudentList([...temp]);
              }
            };

            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: getSizing(1),
                  paddingTop: getSizing(1),
                }}
              >
                <XNGCheckbox
                  onToggle={() => {
                    handleCheck();
                  }}
                  checked={deleteStudentList.indexOf(s) !== -1}
                />
                <Typography variant="body1">
                  {s.firstName} {s.lastName}
                </Typography>
              </Box>
            );
          })}
        </XNGCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: getSizing(2.5),
            paddingTop: getSizing(5),
          }}
        >
          <Box sx={{ paddingBottom: getSizing(1) }}>
            <XNGButton
              onClick={() => {
                props.setShowModal(false);
              }}
            >
              Back to Caseload
            </XNGButton>
          </Box>
          <Box sx={{ paddingBottom: getSizing(1) }}>
            <XNGButton
              onClick={() => {
                handleRemove();
              }}
            >
              Remove
            </XNGButton>
          </Box>
        </Box>
      </Box>
    </XNGModal>
  );
}
const StudentManagerToggle = (props: {
  value: boolean;
  label: string;
  isFirstComponent?: boolean; //added due to original implementation which added margin to the left of the first component
  onChange: FormControlLabelProps["onChange"];
}) => {
  const palette = useTheme().palette;
  return (
    <FormControlLabel
      onChange={props.onChange}
      control={
        <Switch
          sx={{
            marginLeft: props.isFirstComponent ? getSizing(23) : 0,
            "& .MuiSwitch-switchBase": {
              "&.Mui-checked": { color: palette?.contrasts?.[1] },
              "&.Mui-checked+.MuiSwitch-track": {
                backgroundColor: palette?.contrasts?.[1],
              },
            },
          }}
          size={"small"}
          value={props.value}
        />
      }
      label={
        <Typography variant="body2" color={palette?.contrasts?.[1]}>
          {props.label}
        </Typography>
      }
    />
  );
};

function DeleteModal2(props: any) {
  const onSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <XNGModal setShowModal={props.setShowModal}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Remove Student from Caseload
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, paddingBottom: getSizing(2) }}>
          The following student(s) have unposted sessions in your account. Please specify how you
          would like to proceed.
        </Typography>
        <form onSubmit={onSubmit}>
          <XNGCard sx={{ display: "flex", maxHeight: getSizing(40), overflowY: "scroll" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: getSizing(2),
                rowGap: getSizing(3),
                paddingTop: getSizing(2),
              }}
            >
              {props.studentCaseLoad.map((s: any) => {
                return (
                  <Box sx={{ display: "flex", gap: getSizing(1) }}>
                    <Typography variant="body1">
                      {s.firstName} {s.lastName}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </XNGCard>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: getSizing(2),
              rowGap: getSizing(3),
              paddingTop: getSizing(4),
            }}
          >
            <Box>
              <input type="radio" name="Remove" id="caseload" />
              <label htmlFor="caseload">Remove from Caseload Only</label>
            </Box>
            <Box>
              <input type="radio" name="Remove" id="all" />
              <label htmlFor="all">Remove from All Unposted Sessions on My Calendar</label>
            </Box>
            <Box>
              <input type="radio" name="Remove" id="future" />
              <label htmlFor="future">Remove From Future Unposted Sessions on My Calendar</label>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: getSizing(2),
              paddingTop: getSizing(4),
            }}
          >
            <Box sx={{ paddingBottom: getSizing(1) }}>
              <XNGButton>Cancel</XNGButton>
            </Box>
            <Box sx={{ paddingBottom: getSizing(1) }}>
              <XNGButton>Remove</XNGButton>
            </Box>
          </Box>
        </form>
      </Box>
    </XNGModal>
  );
}

function SearchCard(props: {
  addFromSearch: Function;
  s: CaseloadStudentDisplay;
  animIndex: number;
  filteredStudents: CaseloadStudentDisplay[];
}) {
  const s = props.s;
  const palette = usePalette();

  const planType = ["IEP", "Referal", "504", "RtiMtss", "Ell", "Other"];
  let addable = true;
  props.filteredStudents.map((student) => {
    if (student.id === s.id) {
      addable = false;
    }
  });
  const fInitial = s.firstName ? s.firstName[0] : "S";
  const lInitial = s.lastName ? s.lastName[0] : "N";

  return (
    <FadeIn i={props.animIndex}>
      <ButtonBase>
        <XNGCard
          sx={{
            display: "flex",
            maxWidth: getSizing(34),
            paddingX: getSizing(2),
            paddingTop: getSizing(3),
            paddingBottom: getSizing(4),
            width: "269px",
            height: "345px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", gap: getSizing(1.5), alignItems: "center" }}>
              <XNGAvatar size="lg" text={fInitial + lInitial} />
              <Typography variant="h6" color={palette.primary[2]}>
                {s.firstName} {s.lastName}
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", top: "10px", right: "10px" }}
              onClick={() => {
                props.addFromSearch(s.id);
              }}
            >
              {addable ? <XNGIconRenderer i={<XNGICONS.PlusSign />} size="lg" /> : null}
            </Box>
            <Box sx={{ display: "flex", gap: getSizing(4), paddingTop: getSizing(2) }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                <Typography variant="body2" color={palette.primary[2]}>
                  DOB
                </Typography>
                <Typography variant="body2">
                  {dayjs(s.dateOfBirth).format(DAYJS_FORMATTER_DONTUSE)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                <Typography variant="body2" color={palette.primary[2]}>
                  Grade
                </Typography>
                <Typography variant="body2">{addStudentGradeSuffix(s.grade!.valueOf())}</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                <Typography variant="body2" color={palette.primary[2]}>
                  Student ID
                </Typography>
                <Typography variant="body2">{s.studentIdGivenBySchoolDistrict}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                paddingTop: getSizing(2),
                alignItems: "start",
              }}
            >
              <Typography variant="body2" color={palette.primary[2]}>
                Campus
              </Typography>
              <Typography variant="body2">{s.activeSchoolCampuses?.[0]?.name}</Typography>
            </Box>
            <Box sx={{ display: "flex", paddingY: getSizing(2), width: "100%" }}>
              <Box
                sx={{
                  width: "100%",
                  bgcolor: palette.contrasts[3],
                  height: "1px",
                  marginY: getSizing(2),
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <Typography variant="body2" color={palette.primary[2]}>
                Duration
              </Typography>
              <Typography variant="body2">
                {!s.activePlanOfCare?.startDate
                  ? "No Start Date"
                  : dayjs(s.activePlanOfCare?.startDate).format(DAYJS_FORMATTER_DONTUSE)}
                {" - "}
                {!s.activePlanOfCare?.endDate
                  ? "No End Date"
                  : dayjs(s.activePlanOfCare?.endDate).format(DAYJS_FORMATTER_DONTUSE)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", paddingTop: getSizing(2), flexDirection: "column" }}>
              <XNGProgress progress={getProgressPercentage(s)} />
            </Box>
          </Box>
        </XNGCard>
      </ButtonBase>
    </FadeIn>
  );
}

export default StudentManager;
