import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import XNGButton from "../common/xng-button";
import XNGClose from "../../../../../design/low-level/button_close";
import { getSizing } from "../../../../../design/sizing";
import { ROUTES_XLOGS } from "../../../../../constants/URLs";

interface DlgPostSuccessProps {
  open: boolean;
  onClose: () => void;
}

export default function DlgPostSuccess({ open, onClose }: DlgPostSuccessProps) {
  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth={"xs"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(3),
          width: "100%",
          padding: "16px 24px 16px 24px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography />
          <XNGClose onClick={() => onClose()} size="modal" />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: getSizing(1) }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.59 25.22C10.85 25.22 9.21 24.88 7.67 24.2C6.15 23.54 4.81 22.65 3.68 21.51C2.54 20.37 1.65 19.04 0.99 17.52C0.33 15.97 0 14.33 0 12.6C0 10.87 0.33 9.23999 0.99 7.70999C1.65 6.15999 2.54 4.81999 3.68 3.67999C4.82 2.53999 6.15 1.64999 7.67 0.98999C9.22 0.32999 10.86 0 12.59 0C14.32 0 15.97 0.32999 17.51 0.98999C19.03 1.64999 20.36 2.53999 21.5 3.67999C22.64 4.81999 23.53 6.15999 24.19 7.70999C24.85 9.22999 25.17 10.86 25.17 12.6C25.17 14.34 24.84 15.98 24.19 17.52C23.53 19.04 22.64 20.37 21.5 21.51C20.36 22.65 19.03 23.54 17.51 24.2C15.96 24.88 14.32 25.22 12.59 25.22ZM9.88 19.35L21.13 8.09998L19.23 6.16998L9.87 15.56L5.93 11.62L4.03 13.52L9.87 19.36L9.88 19.35Z"
              fill="#3FA65E"
            />
          </svg>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: getSizing(1) }}
        >
          <Typography sx={{ fontSize: "16px", lineHeight: "20px", fontWeight: 700 }}>
            Thank you!
          </Typography>
          <Typography sx={{ fontSize: "12px", lineHeight: "20px", fontWeight: 400 }}>
            Your sessions have been posted
          </Typography>
        </Box>
        <XNGButton onClick={() => onClose()}>
          <Link
            to={ROUTES_XLOGS.unposted_sessions.home}
            style={{ textDecoration: "none", color: "white" }}
          >
            Back To Unposted Sessions
          </Link>
        </XNGButton>
      </Box>
    </Dialog>
  );
}
