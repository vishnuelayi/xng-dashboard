import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Icon,
} from "@mui/material";
import { useState } from "react";
import { MSBICONS } from "../../../../fortitude";

type Props = {
  onSubmitRevisions: (revision: string) => void;
};

const useBatchRequestRevisionsModal = (props: Props) => {
  const [isRequestRevisionsDlgOpen, setIsRequestRevisionsDlgOpen] = useState(false);
  const [isWarningDlgOpen, setIsWarningDlgOpen] = useState(false);
  const [revisionsText, setRevisionsText] = useState("");

  function hideRequestRevisionsDialog() {
    setIsRequestRevisionsDlgOpen(false);
  }

  function hideWarningDialog() {
    setIsWarningDlgOpen(false);
  }

  function showDialog({ showWarning }: { showWarning: boolean }) {
    if (showWarning) {
      setIsWarningDlgOpen(true);
    } else {
      setIsRequestRevisionsDlgOpen(true);
    }
  }

  const requestRevisionsDlgEl = (
    <Dialog open={isRequestRevisionsDlgOpen} onClose={hideRequestRevisionsDialog}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props?.onSubmitRevisions?.(revisionsText || "");
          hideRequestRevisionsDialog();
          setRevisionsText("");
        }}
      >
        <DialogTitle>Request Revisions</DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Please type revisions you are requesting to your assistants below.
          </DialogContentText>
          <TextField
            multiline
            fullWidth
            minRows={10}
            required
            value={revisionsText}
            onChange={(e) => setRevisionsText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ mb: 1 }}>
          <Button onClick={hideRequestRevisionsDialog}>Close</Button>
          <Button autoFocus type="submit" onClick={() => setRevisionsText((prev) => prev.trim())}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

  const warningDlgEl = (
    <Dialog
      open={isWarningDlgOpen}
      onClose={() => hideWarningDialog()}
      sx={{ textAlign: "center", p: 2 }}
      PaperProps={{
        sx: {
          padding: "1rem",
        },
      }}
    >
      <Icon
        sx={{
          fontSize: "2rem",
          mx: "auto",
          transform: "scale(1.35)",
          svg: {
            transform: "scale(1)",
          },
        }}
      >
        <MSBICONS.Information />
      </Icon>
      <DialogTitle>Important Information</DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            fontSize: "13px",
            lineHeight: "20px",
            width: "250px",
          }}
        >
          You are about to request revisions for multiple sessions. This will apply the same
          revision note across all of the selected sessions; are you sure you would like to proceed?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ alignItems: "center", justifyContent: "center" }}>
        <Button onClick={() => hideWarningDialog()}>No</Button>
        <Button
          onClick={() => {
            hideWarningDialog();
            showDialog({ showWarning: false });
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );

  return {
    revisionsDialogEl: isWarningDlgOpen
      ? warningDlgEl
      : isRequestRevisionsDlgOpen
      ? requestRevisionsDlgEl
      : null,
    showDialog,
  };
};

export default useBatchRequestRevisionsModal;
