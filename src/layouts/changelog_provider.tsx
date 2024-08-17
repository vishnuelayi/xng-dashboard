import { Typography, Box, Dialog, Button } from "@mui/material";
import { useState } from "react";
import { ReactComponent as MSBHardAtWorkSVG } from "../design/svgs/msb_hard_at_work.svg";
import { ReactComponent as SystemUpdatesSVG } from "../design/svgs/system_updates.svg";
import usePalette from "../hooks/usePalette";

const MODAL_WIDTH = "880px";
const DATE_UPDATED = "9/1/23";

export default function ChangelogProvider(props: { children: React.ReactNode; disabled: boolean }) {
  const [open, setOpen] = useState<boolean>(true);
  const [slideOver, setSlideOver] = useState<boolean>(false);

  return props.disabled ? (
    <>{props.children}</>
  ) : (
    <>
      <Dialog open={open} maxWidth="md">
        <Box
          sx={{
            width: MODAL_WIDTH,
            overflowX: "hidden",
          }}
        >
          <Box
            sx={{
              width: MODAL_WIDTH,
              display: "flex",
              transition: "transform .3s ease",
              transform: `translateX(${slideOver ? "-100%" : "0%"})`,
              alignItems: "center",
              py: "3rem",
            }}
          >
            <PatchPage onClose={() => setSlideOver(true)} />
            <KnownIssues onConfirm={() => setOpen(false)} />
          </Box>
        </Box>
      </Dialog>

      {props.children}
    </>
  );
}

function KnownIssues(props: { onConfirm: () => void }) {
  const palette = usePalette();

  const issues = [
    "Campus options missing from User Profile drop-downs",
    "Sessions not Posting/Status color not changing to show Posted Sessions",
    "When creating a session, the session end times are defaulting to AM instead of PM which is causing an error that looks like a white screen",
    "Some appointments do not accurately reflect the session times when viewing the Calendar",
    "Approved sessions say they were posted by the submitter, not the approver",
    "For some users, students are missing newly created IEP goals in X Logs",
    "For some users, delete session functionality is not working properly",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        minWidth: MODAL_WIDTH,
        maxWidth: MODAL_WIDTH,
      }}
    >
      <MSBHardAtWorkSVG />
      <Typography variant="body1" mt=".5rem" sx={{ color: palette.contrasts[2], fontSize: "12px" }}>
        Last modified: {DATE_UPDATED}
      </Typography>
      <Typography className="noselect" variant="h4" m=".5rem" sx={{ textTransform: "capitalize" }}>
        MSB is hard at work for you
      </Typography>
      {/* <Typography sx={{ textAlign: "center" }}>
        We are working hard so you won't have to.
      </Typography> */}
      <Typography mb=".5rem">
        Thanks for your patience as we work quickly to resolve the following known issues:
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box component="ul" sx={{ width: "40%" }}>
          <li>{issues[0]}</li>
          <li>{issues[1]}</li>
          <li>{issues[2]}</li>
        </Box>
        <Box component="ul" sx={{ width: "40%" }}>
          <li>{issues[3]}</li>
          <li>{issues[4]}</li>
          <li>{issues[5]}</li>
          <li>{issues[6]}</li>
        </Box>
      </Box>
      <Button
        sx={{ minWidth: "540px", mt: ".5rem", textTransform: "capitalize" }}
        onClick={() => props.onConfirm()}
      >
        Got it!
      </Button>
    </Box>
  );
}

function PatchPage(props: { onClose: () => void }) {
  const palette = usePalette();

  const patches = [
    <Typography>
      <strong>NEW!</strong> Release of Edit Sessions Series functionality
    </Typography>,
    "Added Consult/Non-Direct Service drop-down option for all Service Types",
    "Added Campus and Medicaid Filter to the Student Caseload screen",
    "Added one “other” option for activity/accommodation/modification documentation",
    "Removed “Clear Filter” button from the Calendar screen",
    "Resolved Goal/Objective notes not saving",
    "Improved Drag n Drop functionality to allow for session series edits",
    "Improved flow when adding/removing Providers to Caseload for Data Entry Clerk/Assistants",
    "Resolved a white screen some users experienced when navigating through X Logs",
    "Resolved an infinite loop some users experienced upon logging in",
    "Updated the Edit Session View and Calendar design/color theme",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        minWidth: MODAL_WIDTH,
        maxWidth: MODAL_WIDTH,
      }}
    >
      <SystemUpdatesSVG />
      <Typography variant="body1" mt=".5rem" sx={{ color: palette.contrasts[2], fontSize: "12px" }}>
        Last modified: {DATE_UPDATED}
      </Typography>
      <Typography className="noselect" variant="h4" m=".5rem">
        System Updates
      </Typography>
      <Typography sx={{ textAlign: "center", maxWidth: "30rem" }}>
        We’ve made significant improvements to our application, below you will find the list of
        enhancements:
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box component="ul" sx={{ width: "40%" }}>
          <li>{patches[0]}</li>
          <li>{patches[1]}</li>
          <li>{patches[2]}</li>
          <li>{patches[3]}</li>
          <li>{patches[4]}</li>
        </Box>
        <Box component="ul" sx={{ width: "40%" }}>
          <li>{patches[5]}</li>
          <li>{patches[6]}</li>
          <li>{patches[7]}</li>
          <li>{patches[8]}</li>
          <li>{patches[9]}</li>
        </Box>
      </Box>
      <Button
        sx={{ minWidth: "540px", mt: ".5rem", textTransform: "capitalize" }}
        onClick={() => props.onClose()}
      >
        Got it!
      </Button>
    </Box>
  );
}
