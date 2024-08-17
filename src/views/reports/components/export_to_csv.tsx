import { Button, ButtonProps } from "@mui/material";
import { FaFileCsv } from "react-icons/fa";
import { MSBIconRenderer } from "../../../fortitude";

function ExportToCSVButton(props: { onClick: () => void; buttonProps?: ButtonProps }) {
  return (
    <Button
      onClick={props.onClick}
      sx={{ width: "10rem" }}
      startIcon={<MSBIconRenderer i={<FaFileCsv />} size="sm" />}
      {...props.buttonProps}
    >
      Export to CSV
    </Button>
  );
}

export default ExportToCSVButton;
