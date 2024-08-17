import { useState, useEffect } from "react";
import { Dialog, Typography } from "@mui/material";
import Box from "../../../design/components-dev/BoxExtended";
import { XNGICONS, XNGIconRenderer } from "../../../design/icons";
import { getSizing } from "../../../design/sizing";
import XNGInput from "../../../design/low-level/input";
import XNGButton from "../../../design/low-level/button";
import { useNotatorTools } from "../tools";

/**
 * Warning: This modal component is tightly coupled to its parent's state. This is not only
 * a violation of SRP in React but adds unnecessary complexity and limits reusability.
 *
 * Recommendation: Invert the control. Refactor to use standard prop names like `onClose`
 * and `open` for increased clarity and reusability.
 */
export function AddRationaleModal(props: {
  setModalOpen: (arg: boolean) => void;
  modalOpen: boolean;
  rationale: string | undefined;
  selectedStudentIndex: number;
  studentName: string;
}) {
  const { rationale, selectedStudentIndex, setModalOpen, modalOpen } = props;
  const [editedRationale, setEditedRationale] = useState(rationale);
  const { editDraft } = useNotatorTools();

  useEffect(() => {
    setEditedRationale(rationale);
  }, [rationale]);

  return (
    <Dialog className="noselect" onClose={() => setModalOpen(false)} open={modalOpen}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(1),
          alignItems: "center",
          paddingTop: getSizing(7),
        }}
      >
        <XNGIconRenderer i={<XNGICONS.Alert />} size="md" />
        <Typography variant="h6">Attention</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          paddingBlock: getSizing(5),
          paddingTop: getSizing(3),
          paddingX: getSizing(3),
          gap: getSizing(3),
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">
          You are adding a rationale for the following student:
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          {props.studentName}
        </Typography>
        <Box sx={{ width: "100%" }}>
          <XNGInput
            multiline
            row={12}
            onChange={(e) => setEditedRationale(e.target.value)}
            value={editedRationale}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <XNGButton
            onClick={() => {
              setModalOpen(false);

              editDraft(
                `studentJournalList.${selectedStudentIndex}.studentAttendanceRecord.rationale`,
                editedRationale,
              );
            }}
          >
            Submit Rationale
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
}
