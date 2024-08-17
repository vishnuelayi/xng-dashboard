import { useState } from "react";
import { STUDENTS_SIDEBAR } from "./_";
import { Breadcrumbs, Button, CircularProgress, Typography } from "@mui/material";
import SidebarLayout from "../../layouts/SidebarLayout";
import { getSizing } from "../../design/sizing";
import XNGTransparentTabs from "../../design/low-level/tabs_transparent";
import Demographics from "./profile_tabs/demographics";
import PlanOfCareInfo from "./profile_tabs/plan_of_care_info";
import Medicaid from "./profile_tabs/medicaid";
import IEPServices from "./profile_tabs/iep_services";
import ProgressReports from "./profile_tabs/progress_reports";
import CurrentProviders from "./profile_tabs/current_providers";
import usePalette from "../../hooks/usePalette";
import Box from "../../design/components-dev/BoxExtended";
import ShowHideBox from "../../design/components-dev/show_hide_box";
import { StudentResponse, StudentXLogsStatus } from "../../profile-sdk";
import { useStudentProfileContext } from "./context/context";
import { GoalObjectiveInfoTab } from "./profile_tabs/goal_obj_info/goal_objective_info_tab";

function StudentResponsePage() {
  const TABS_COOP = [
    {
      id: 0,
      label: "General Information",
      onClick: () => setSelectedTabIndex(0),
    },
    {
      id: 1,
      label: "Plan Of Care Info",
      onClick: () => setSelectedTabIndex(1),
    },
    {
      id: 2,
      label: "Medicaid Info",
      onClick: () => setSelectedTabIndex(2),
    },
    {
      id: 3,
      label: "Goal/Obj Info",
      onClick: () => setSelectedTabIndex(3),
    },
    // {
    //   id: 4,
    //   label: "IEP Services",
    //   onClick: () => setSelectedTabIndex(4),
    // },
    // {
    //   id: 5,
    //   label: "Progress Reports",
    //   onClick: () => setSelectedTabIndex(5),
    // },
    // {
    //   id: 6,
    //   label: "Current Providers",
    //   onClick: () => setSelectedTabIndex(6),
    // },
  ];

  const [selectedTab, setSelectedTabIndex] = useState<number>(0);

  const {
    editStudent,
    editedStudent,
    student,
    handleSave,
    sortedDistricts,
    setEditedStudent,
    selectedStudentDistrict,
    setSelectedStudentDistrictHandler,
    selectedStudentCampus,
    setSelectedStudentCampusHandler,
    state,
  } = useStudentProfileContext();

  return (
    <SidebarLayout
      sidebarContent={STUDENTS_SIDEBAR.tabs}
      content={
        <Box sx={{ paddingLeft: getSizing(5) }}>
          {student && (
            <>
              <Breadcrumbs />
              <StudentResponserHeader
                saveDisabled={student === editedStudent}
                student={student}
                selectedTab={selectedTab}
              />
              <XNGTransparentTabs
                useDropdownBreakpoint={{
                  breakpoint: 1200,
                  selectedValue: TABS_COOP[selectedTab]?.id!,
                }}
                value={selectedTab}
                tabs={TABS_COOP}
              />

              <ShowHideBox
                key={"a"}
                if={selectedTab === 0}
                show={
                  <Demographics
                    editStudent={editStudent}
                    editedStudent={editedStudent}
                    selectedDistrict={selectedStudentDistrict}
                    setSelectedDistrict={setSelectedStudentDistrictHandler}
                    selectedCampus={selectedStudentCampus}
                    setSelectedCampus={setSelectedStudentCampusHandler}
                    districts={sortedDistricts}
                    state={state}
                  />
                }
              />
              <ShowHideBox
                key={"b"}
                if={selectedTab === 1}
                show={<PlanOfCareInfo editStudent={editStudent} editedStudent={editedStudent} />}
              />
              <ShowHideBox
                key={"c"}
                if={selectedTab === 2}
                show={<Medicaid editStudent={editStudent} editedStudent={editedStudent} />}
              />
                <ShowHideBox
                key={"k"}
                if={selectedTab === 3}
                show={
                  editedStudent ? <GoalObjectiveInfoTab
                  state={state}
                    set_edited_student={setEditedStudent}
                    edited_student={editedStudent}
                  /> : <p>Loading data...</p>
                }
              />
            

              {/* <ShowHideBox key={"e"} if={selectedTab === 4} show={<IEPServices />} />
              <ShowHideBox key={"f"} if={selectedTab === 5} show={<ProgressReports />} />
              <ShowHideBox key={"g"} if={selectedTab === 6} show={<CurrentProviders />} /> */}
            </>
          )}
        </Box>
      }
    />
  );
}

function StudentResponserHeader(props: {
  student: StudentResponse;
  saveDisabled: boolean;
  selectedTab: number;
}) {
  const { handleSave, isSaving } = useStudentProfileContext();

  const palette = usePalette();
  const {
    student: { xLogsStatus },
  } = props;

  const STUDENT_XLOGS_STATUS_MAP = {
    [StudentXLogsStatus.NUMBER_0]: {
      color: palette.warning[2],
      text: "Pending Student",
    },
    [StudentXLogsStatus.NUMBER_1]: {
      color: palette.success[2],
      text: "Active in X Logs",
    },
    [StudentXLogsStatus.NUMBER_2]: {
      color: palette.danger[2],
      text: "Inactive in X Logs",
    },
    [StudentXLogsStatus.NUMBER_3]: {
      color: palette.warning[2],
      text: "Referral Student",
    },
    [StudentXLogsStatus.NUMBER_4]: {
      color: palette.warning[2],
      text: "Transfer Student",
    },
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingY: getSizing(3),
        }}
        mr={"2rem"}
        maxWidth={"lg"}
      >
        <Box name="left">
          <Typography className="noselect" variant="h5">
            Student Profile
          </Typography>
          <Typography variant="h6">
            {props.student.firstName + " " + props.student.lastName}
          </Typography>
          <Box
            className="noselect"
            sx={{ display: "flex", alignItems: "center", gap: getSizing(1) }}
          >
            <Box
              sx={{
                width: "12px",
                height: "12px",
                borderRadius: 999,
                bgcolor: xLogsStatus && STUDENT_XLOGS_STATUS_MAP[xLogsStatus].color,
              }}
            />
            <Typography variant="body1">
              {xLogsStatus && STUDENT_XLOGS_STATUS_MAP[xLogsStatus].text}
            </Typography>
          </Box>
        </Box>
        <Box name="right">
          {props.selectedTab === 3 ? null : (
            <Box sx={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
              {isSaving && <CircularProgress {...{ value: 0.5 }} size="1rem" color="primary" />}
              <Button onClick={() => handleSave()} disabled={props.saveDisabled}>
                Save
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default StudentResponsePage;
