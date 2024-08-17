import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import XNGButton from "../common/xng-button";
import { getSizing } from "../../../../../design/sizing";
import { XNGICONS, XNGIconRenderer } from "../../../../../design";
import usePalette from "../../../../../hooks/usePalette";
import { ROUTES_XLOGS } from "../../../../../constants/URLs";

interface DlgWrongSignatureProps {
  open: boolean;
  onClose: () => void;
}

export default function DlgWrongSignature({ open, onClose }: DlgWrongSignatureProps) {
  const palette = usePalette();

  return (
    <Dialog className="noselect" onClose={() => onClose()} open={open}>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: getSizing(1),
            alignItems: "center",
            paddingTop: getSizing(7),
          }}
        >
          <XNGIconRenderer i={<XNGICONS.Alert />} size="lg" />
          <Typography variant="h6">Attention</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(1) }}>
          <Typography variant="body1" align="center">
            The signature does not match the name in your account. Please sign with the first and
            last name used in your{" "}
            <Link to={ROUTES_XLOGS.user}>
              <Typography
                variant="body1"
                display={"inline"}
                color={palette.primary[2]}
                sx={{ textDecoration: "underline", cursor: "pointer" }}
              >
                User Profile
              </Typography>
            </Link>{" "}
          </Typography>
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
        <XNGButton onClick={() => onClose()}>OK</XNGButton>
      </Box>
    </Dialog>
  );
}
