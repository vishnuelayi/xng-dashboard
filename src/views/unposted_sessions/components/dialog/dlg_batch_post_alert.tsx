import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import XNGButton from "../../batch-post/components/common/xng-button";
import XNGClose from "../../../../design/low-level/button_close";
import { getSizing } from "../../../../design/sizing";
import { ROUTES_XLOGS } from "../../../../constants/URLs";

interface DlgBatchPostAlertProps {
  open: boolean;
  onClose: () => void;
}

export default function DlgBatchPostAlert({ open, onClose }: DlgBatchPostAlertProps) {
  const navigate = useNavigate();
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
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 0C15.35 0.02 17.1 0.389996 18.74 1.09C20.38 1.79 21.81 2.76 23.03 3.97C24.25 5.19 25.21 6.61999 25.91 8.25999C26.61 9.89999 26.98 11.65 27 13.5C26.98 15.38 26.61 17.12 25.91 18.74C25.21 20.38 24.24 21.81 23.03 23.03C21.82 24.25 20.38 25.21 18.74 25.91C17.1 26.64 15.35 27 13.5 27C11.65 27 9.90001 26.64 8.26001 25.91C6.62001 25.21 5.19003 24.25 3.97003 23.03C2.75003 21.81 1.79003 20.38 1.09003 18.74C0.390027 17.12 0.02 15.38 0 13.5C0.02 11.65 0.390027 9.89999 1.09003 8.25999C1.79003 6.61999 2.76003 5.19 3.97003 3.97C5.19003 2.75 6.62001 1.79 8.26001 1.09C9.90001 0.389996 11.65 0.02 13.5 0ZM13.5 24.3C15 24.3 16.41 24.02 17.72 23.46C19.03 22.9 20.18 22.13 21.15 21.16C22.12 20.19 22.89 19.04 23.45 17.73C24.01 16.42 24.29 15.01 24.29 13.51C24.29 12.01 24.01 10.64 23.45 9.32001C22.89 8.01001 22.12 6.85999 21.15 5.87C20.18 4.88 19.03 4.11 17.72 3.55C16.41 2.99 15 2.71001 13.5 2.71001C12 2.71001 10.59 2.99 9.28003 3.55C7.97003 4.11 6.81998 4.89 5.84998 5.87C4.87998 6.85 4.10999 8.00001 3.54999 9.32001C2.98999 10.63 2.71002 12.03 2.71002 13.51C2.71002 14.99 2.98999 16.42 3.54999 17.73C4.10999 19.04 4.87998 20.19 5.84998 21.16C6.81998 22.13 7.97003 22.9 9.28003 23.46C10.59 24.02 12 24.3 13.5 24.3ZM12.06 6.68001H14.77V9.56H12.06V6.68001ZM12.06 12.06H14.77V20.36H12.06V12.06Z"
              fill="#FFD945"
            />
          </svg>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: getSizing(1) }}
        >
          <Typography sx={{ fontSize: "16px", lineHeight: "20px", fontWeight: 700 }}>
            Important Information
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              lineHeight: "20px",
              fontWeight: 400,
              width: "250px",
              textAlign: "center",
            }}
          >
            Batch posting pulls all sessions within the time frame identified that meet all the
            required posting criteria.
          </Typography>
        </Box>
        <XNGButton onClick={() => navigate(ROUTES_XLOGS.unposted_sessions.batch_post)}>
          Continue
        </XNGButton>
      </Box>
    </Dialog>
  );
}
