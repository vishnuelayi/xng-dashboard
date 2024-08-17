import { TableCell, Typography } from "@mui/material";
import XNGCheckbox from "../../../low-level/checkbox";
import Box from "../../../components-dev/BoxExtended";

export function SelectableColumnHeaderCell(props: {
  value: boolean;
  onClick: () => void;
  numSelected: number;
}) {
  const { numSelected, onClick, value } = props;

  return (
    <TableCell>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <XNGCheckbox checked={value} onToggle={onClick} />
        <Box sx={{ minWidth: "3rem", display: "flex" }}>
          <Typography>All</Typography>
          {numSelected > 0 && (
            <Typography className="noselect" ml=".3rem" sx={{ color: "#0005" }}>
              ({numSelected})
            </Typography>
          )}
        </Box>
      </Box>
    </TableCell>
  );
}

export function SelectableRowFirstCell(props: {
  checked: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  const { checked, onToggle } = props;

  return (
    <TableCell sx={{display: "flex"}}>
      <XNGCheckbox
        checked={checked}
        onToggle={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onToggle(e)}
      />
    </TableCell>
  );
}
