import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
import { FrontEndStudentMergeRow } from "./mapper";
import MSBClose from "../../../../fortitude/components/button_close";
import { useState } from "react";
import { MSBRadioTable } from "../../../../fortitude";
import { useV1StudentsMergeStudentsPatch } from "../../../../api/hooks/use_v1_students_merge_students_patch";
import { useConfirmModal } from "../../../../design/modal_templates/confirm";
import { useMutation } from "@tanstack/react-query";
import QueryStatusModal from "../../../../design/modal_templates/query_status_modal";

export function MergeModalView(props: {
  selectedRows: FrontEndStudentMergeRow[];
  open: boolean;
  onClose: () => void;
  onRequestRefreshTable: () => void;
  workflow: "potentials" | "search";
  onClearSelection: () => void;
}) {
  const mergeStudentPatch = useV1StudentsMergeStudentsPatch();

  const [selectedStudent, setSelectedStudent] = useState<FrontEndStudentMergeRow | null>(null);

  const primaryStudentID = selectedStudent?.xlogsID!;
  const secondaryProfileIDs: string[] = props.selectedRows
    .filter((sr) => sr.xlogsID !== primaryStudentID)
    .map((sr) => sr.xlogsID!);

  const [handleConfirm, confirmModalEl] = useConfirmModal({
    onConfirm: handleRequestWithStatusModal,
    content: {
      titleText: "Are you sure you want to merge these students?",
      body: "A merge cannot be undone. All student data is transferred to the primary student you've selected. The duplicate student will be permanently deleted after 30 days.",
      yesText: "Yes, Merge",
    },
  });

  const { mutate: mutateMerge, status: mergeStatus } = useMutation({
    mutationFn: () => mergeStudentPatch(primaryStudentID, secondaryProfileIDs),
  });
  const [isMergeRequestModalOpen, setIsMergeRequestModalOpen] = useState<boolean>(false);

  function handleRequestWithStatusModal() {
    setIsMergeRequestModalOpen(true);
    mutateMerge();
  }

  const successBody: string | React.ReactNode =
    props.workflow === "potentials" ? (
      <Box>
        <Typography>
          Students merged successfully. Please note that it may take up to 24 hours for changes to
          reflect.
        </Typography>
      </Box>
    ) : (
      "Students merged successfully! You may close this window."
    );

  const errorBody: string | React.ReactNode =
    props.workflow === "potentials" ? (
      <Box>
        <Typography>
          We encountered a problem while attempting to merge students. We apologize for the
          inconvenience.
          <br />
          <strong>Please note:</strong> Students may have already been merged. Please verify by
          searching for your student using the searchbar on this screen.
        </Typography>
      </Box>
    ) : (
      "We encountered a problem while attempting to merge students. We apologize for the inconvenience."
    );

  return (
    <>
      {/* MODALS */}
      {confirmModalEl}

      <QueryStatusModal
        isOpen={isMergeRequestModalOpen}
        status={mergeStatus}
        onSettledClose={() => {
          setIsMergeRequestModalOpen(false);
          props.onClose();
          props.onRequestRefreshTable();
          props.onClearSelection();
        }}
        content={{
          pendingTitle: "Merging students...",
          successBody,
          errorBody,
        }}
      />

      {/* DOM HIERARCHY */}
      <Dialog maxWidth="xl" open={props.open} onClose={props.onClose}>
        <Stack gap={2} p={2}>
          <Stack alignItems="flex-end">
            <MSBClose onClick={props.onClose} />
          </Stack>

          <Stack gap={1}>
            <Typography variant="h5">Please Select Your Primary Student</Typography>
            <Typography>
              Here are your choices based on your selections, please confirm your primary Student.
            </Typography>
          </Stack>

          <MSBRadioTable
            rows={props.selectedRows}
            columns={[
              { key: "firstName", title: "First Name" },
              { key: "lastName", title: "Last Name" },
              { key: "studentID", title: "Student ID" },
              { key: "birthdate", title: "Birthdate" },
              { key: "createdBy", title: "Created by" },
              { key: "school", title: "School" },
              { key: "gender", title: "Gender" },
            ]}
            onChange={(v) => {
              setSelectedStudent(v);
            }}
          />

          <Stack direction="row" gap={2}>
            <Button variant="outlined" color="inherit" fullWidth onClick={props.onClose}>
              Cancel
            </Button>
            <Button fullWidth disabled={selectedStudent === null} onClick={handleConfirm}>
              Merge
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}
