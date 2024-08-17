import { useState } from "react";
import { SessionResponse } from "../../../session-sdk";
import { Dialog, TextField, Typography, useTheme } from "@mui/material";
import { getSizing } from "../../../design/sizing";
import Box from "../../../design/components-dev/BoxExtended";
import XNGButton from "../../../design/low-level/button";
import { EditDraftFunctionType } from "../tools/types";

/**
 * Warning: This modal component is tightly coupled to its parent's state. This is not only
 * a violation of SRP in React but adds unnecessary complexity and limits reusability.
 *
 * Recommendation: Invert the control. Refactor to use standard prop names like `onClose`
 * and `open` for increased clarity and reusability.
 */
export function SessionNotesModal(props: {
  setShowSessionNotes: React.Dispatch<React.SetStateAction<boolean>>;
  showSessionNotes: boolean;
  editedSession: SessionResponse;
  sessionNotes: string | undefined;
  editSession: EditDraftFunctionType;
}) {
  
  const [editedSessionNotes, setEditedSessionNotes] = useState<string>(props.sessionNotes || "");
  const isSessionPosted = props.editedSession.status === 4;
  const primaryTextColor = useTheme().palette.text.primary;

  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowSessionNotes(false);
      }}
      open={props.showSessionNotes}
    >
      <Box
        sx={{
          display: "flex",
          paddingBlock: getSizing(5),
          paddingTop: getSizing(3),
          paddingX: getSizing(2),
          gap: getSizing(3),
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(1) }}>
          <Typography variant="h6">Session Notes</Typography>
          <Typography variant="body1">
            The following notes will be applied to all students in the session
          </Typography>
        </Box>
        <TextField
          id="session-notes"
          variant="outlined"
          disabled={isSessionPosted}
          multiline
          rows={12}
          value={editedSessionNotes}
          onChange={(e) => setEditedSessionNotes(e.target.value)}
          placeholder= {isSessionPosted ? "No notes added to this session" 
            : "Enter notes here..."}
          sx={{
            ".Mui-disabled": {
              color: (isSessionPosted ? primaryTextColor : "initial") + " !important",
              "-webkit-text-fill-color": (isSessionPosted ? primaryTextColor : "initial") + " !important",
            },
            ".Mui-disabled ::placeholder": {
              opacity: (isSessionPosted ? 1 : "inherit") + " !important",
            },
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          paddingBottom: getSizing(4),
          paddingTop: getSizing(2),
          paddingRight: getSizing(3),
        }}
      >
        <XNGButton
          disabled={isSessionPosted}
          onClick={() => {
            props.setShowSessionNotes(false);
            props.editSession(`sessionJournal.narrative`, editedSessionNotes);
          }}
        >
          Save
        </XNGButton>
      </Box>
    </Dialog>
  );
}
