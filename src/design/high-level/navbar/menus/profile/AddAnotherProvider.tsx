import { XNGICONS, XNGIconRenderer } from "../../../../icons";
import { getSizing } from "../../../../sizing";
import { Typography } from "@mui/material";
import Box from "../../../../components-dev/BoxExtended";
import usePalette from "../../../../../hooks/usePalette";

interface IAddAnotherProvider {
  showModal: () => void; //This can be used to modify which modal is shown when this component is clicked.
}
export function AddAnotherProvider(props: IAddAnotherProvider) {
  const palette = usePalette();
  const actionStyle = {
    ":hover": { bgcolor: palette.contrasts[4] },
    borderRadius: "4px",
    padding: "3px",
    paddingY: "1rem",
    cursor: "pointer",
  };
  return (
    <Box onClick={() => props.showModal()} sx={{ ...actionStyle }}>
      <Box sx={{ display: "flex", gap: getSizing(2), px: getSizing(2.5) }}>
        {/* TODO: We need to use an XNG Icon here. */}
        <XNGIconRenderer size="md" i={<XNGICONS.Person />} />
        <Typography className="noselect" display="inline">
          Add Another Provider
        </Typography>
      </Box>
    </Box>
  );
}
