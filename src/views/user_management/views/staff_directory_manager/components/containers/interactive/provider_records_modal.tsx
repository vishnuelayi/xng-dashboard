import StaffDirectoryDialog from "../../presentational/wrappers/staff_directory_dialog";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import usePalette from "../../../../../../../hooks/usePalette";
import { XNGICONS } from "../../../../../../../design";

export type ProviderRecordsModalType = {
  name: string;
  dateRange: string;
  onDelete?: () => void;
};

type Props = {
  title: string;
  subTitle?: string;
  isOpen: boolean;
  canDelete?: boolean;
  onClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
  noRecordsText?: string;
  record?: ProviderRecordsModalType[];
};

const ProviderRecordsModal = (props: Props) => {
  // const [isOpen, setIsOpen] = React.useState(true);
  const palette = usePalette();

  const ModalCard = ({ record }: { record: ProviderRecordsModalType }) => {
    return (
      <Box
        display={"flex"}
        py={"14px"}
        sx={{
          gap: "15px",
          pr: "5px",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          cursor: "pointer",
          ":hover": {
            backgroundColor: palette.contrasts[3],
          },
        }}
      >
        <Box flexGrow={1}>{record.name}</Box>
        <Box>{record.dateRange}</Box>
        {props.canDelete && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              record.onDelete?.();
            }}
          >
            <XNGICONS.Close />
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <StaffDirectoryDialog
      isOpen={props.isOpen}
      useCloseButton
      width={"100%"}
      maxWidth={"650px"}
      onClose={props.onClose}
    >
      <Box pb={"2rem"} px={"1rem"}>
        <Typography variant="h4" fontSize={"24px"} mb={"1rem"}>
          {props.title}
        </Typography>
        <Typography variant="h4" fontSize={"14px"} mb={"1rem"}>
          {props.subTitle}
        </Typography>
        <Box
          maxHeight={"300px"}
          minHeight={"200px"}
          sx={{
            overflowY: "auto",
          }}
        >
          {props.record?.map((record, i) => <ModalCard key={i} record={record} />)}
          {(props.record?.length === 0 || !props.record) && (
            <Alert severity="info">{props.noRecordsText || "No Records Found"}</Alert>
          )}
        </Box>
      </Box>
    </StaffDirectoryDialog>
  );
};

export default ProviderRecordsModal;
