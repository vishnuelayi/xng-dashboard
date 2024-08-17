import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import XNGLabelText from "../../common/xng-label-text";

interface SessionListActionProps {
  total: number;
  selectedAll: boolean;
  onSelectAll: (selectedAll: boolean) => void;
}

export default function SessionListAction({
  total,
  selectedAll,
  onSelectAll,
}: SessionListActionProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", paddingY: "40px" }}>
      <FormControlLabel
        sx={{ marginRight: "90px" }}
        checked={selectedAll}
        onChange={(_, checked) => onSelectAll(checked)}
        control={<Checkbox size="small" />}
        label={`Select All (${total})`}
      />

      <XNGLabelText
        label="Note: "
        text="Please Scroll down to make sure all session are reflective of intended selections."
      />
    </Box>
  );
}
