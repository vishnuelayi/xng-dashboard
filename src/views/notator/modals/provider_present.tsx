import React, { useState, useEffect } from "react";
import { getSizing } from "../../../design/sizing";
import Box from "../../../design/components-dev/BoxExtended";
import { Dialog, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import XNGButton from "../../../design/low-level/button";
import XNGInput from "../../../design/low-level/input";
import { SessionResponse } from "../../../session-sdk";
import { EditDraftFunctionType } from "../tools/types";
import { useNavigate } from "react-router-dom";
import { useNotatorTools } from "../tools";

/**
 * Warning: This modal component is tightly coupled to its parent's state. This is not only
 * a violation of SRP in React but adds unnecessary complexity and limits reusability.
 *
 * Recommendation: Invert the control. Refactor to use standard prop names like `onClose`
 * and `open` for increased clarity and reusability.
 */
export function ProviderPresentModal(
  props: Readonly<{
    editedSession: SessionResponse;
    editSession: EditDraftFunctionType;
    setShowProviderModal: React.Dispatch<React.SetStateAction<boolean>>;
    showProviderModal: boolean;
    disableOptions?: boolean;
    bypassUnsavedChanges: () => void;
  }>,
) {
  const { saveSession, draftSession } = useNotatorTools();

  const radioValues = ["On Leave / Vacation", "IEP Meeting", "School Function"];
  const reasonAbsent = props.editedSession.sessionJournal?.providerAttendanceRecord
    ?.reasonAbsent as string;
  const [otherText, setOtherText] = useState<string>(
    radioValues.includes(reasonAbsent) ? "" : reasonAbsent,
  );
  const [isOtherChecked, setIsOtherChecked] = useState<boolean>(
    !(radioValues.includes(reasonAbsent) || reasonAbsent === null),
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isOtherChecked) {
      props.editSession(`sessionJournal.providerAttendanceRecord.reasonAbsent`, otherText);
    }
  }, [isOtherChecked]);

  // This (or something like it) will be used when future workflows are implemented
  // const [servicesRendered, setServicesRendered] = useState<boolean>(true);

  const handleReasonAbsentChange = (e: React.SyntheticEvent<Element, Event>) => {
    const targetValue = (e.target as HTMLInputElement).value;
    setIsOtherChecked(!radioValues.includes(targetValue));
    radioValues.includes(targetValue)
      ? props.editSession(`sessionJournal.providerAttendanceRecord.reasonAbsent`, targetValue)
      : props.editSession(`sessionJournal.providerAttendanceRecord.reasonAbsent`, otherText);
  };

  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowProviderModal(false);
      }}
      open={props.showProviderModal}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(2),
          paddingTop: getSizing(7),
          paddingX: getSizing(10),
        }}
      >
        <Typography variant="h6">Provider Present?</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2) }}>
          <Typography variant="body1">Why were you absent?</Typography>
          <RadioGroup
            value={props.editedSession.sessionJournal?.providerAttendanceRecord?.reasonAbsent}
            onChange={(e) => {
              if (e.target.value === "Other") setOtherText(" ");
              else if (radioValues.includes(e.target.value)) setOtherText(" ");
            }}
          >
            <FormControlLabel
              value={"On Leave / Vacation"}
              control={<Radio />}
              label="On Leave / Vacation"
              onChange={handleReasonAbsentChange}
              disabled={props.disableOptions}
            />
            <FormControlLabel
              value={"IEP Meeting"}
              control={<Radio />}
              label="IEP Meeting"
              onChange={handleReasonAbsentChange}
              disabled={props.disableOptions}
            />
            <FormControlLabel
              value={"School Function"}
              control={<Radio />}
              label="School Function"
              onChange={handleReasonAbsentChange}
              disabled={props.disableOptions}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: getSizing(1) }}>
              <FormControlLabel
                value={"Other"}
                control={<Radio />}
                label="Other"
                onChange={handleReasonAbsentChange}
                disabled={props.disableOptions}
                checked={isOtherChecked}
              />
              <XNGInput
                value={otherText}
                onChange={(e) => {
                  setIsOtherChecked(true);
                  setOtherText(e.target.value);
                }}
                disabled={props.disableOptions}
              />
            </Box>
          </RadioGroup>
          <Typography variant="body1">
            Were services still rendered even though you were absent?
          </Typography>
          <RadioGroup
            value={
              props.editedSession.sessionJournal?.providerAttendanceRecord?.present
                ? "true"
                : "false"
            }
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Yes"
              onChange={() => {
                props.editSession(`sessionJournal.providerAttendanceRecord.present`, true);
              }}
              disabled={props.disableOptions}
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="No"
              onChange={() => {
                props.editSession(`sessionJournal.providerAttendanceRecord.present`, false);
              }}
              disabled={props.disableOptions}
            />
          </RadioGroup>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: getSizing(4),
          paddingTop: getSizing(2),
        }}
      >
        <XNGButton
          onClick={() => {
            saveSession(draftSession).then((res) => {
              if (
                res.seriesId &&
                window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1) ===
                  "null"
              ) {
                const pathname = window.location.pathname;
                const newPath =
                  pathname.slice(0, pathname.lastIndexOf("/") + 1) +
                  res.id +
                  window.location.search;
                props.bypassUnsavedChanges();
                navigate(newPath);
              }
            });
            props.setShowProviderModal(false);
            if (!isOtherChecked) {
              setOtherText("");
            } else
              props.editSession(`sessionJournal.providerAttendanceRecord.reasonAbsent`, otherText);
          }}
          disabled={props.disableOptions}
        >
          Save
        </XNGButton>
      </Box>
    </Dialog>
  );
}
