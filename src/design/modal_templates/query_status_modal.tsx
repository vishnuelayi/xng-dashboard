import { Box, Button, CircularProgress, Dialog, Typography } from "@mui/material";
import MSBClose from "../../fortitude/components/button_close";
import FadeIn from "../components-dev/FadeIn";
import { MSBICONS } from "../../fortitude";
import { XNGIconRenderer } from "../icons";

const REM_BALANCE = "1rem";

// --------------------------- CONTRACTS ---------------------------

export type QueryStatusModalProps = {
  isOpen: boolean;
  status: MutationObserverStatus;
  /**
   * The close button shown when the request is settled. We will later implement a different
   * action (or handle within the component itself) for cancelling pending requests.
   */
  onSettledClose: () => void;
  content?: QueryStatusModalContentProps;
};

export type QueryStatusModalContentProps = {
  errorTitle?: string;
  pendingTitle?: string;
  successTitle?: string;
  successBody?: React.ReactNode | string;
  errorBody?: React.ReactNode | string;
};

/**
 * Helper type for better handling the TanStack Query's internal mutation observer's distinct statuses,
 * since the library does not directly expose a usable type.
 */
export type MutationObserverStatus = "pending" | "success" | "error" | "idle";

// -----------------------------------------------------------------

/**
 * Our default modal for visualizing mutated API requests using TanStack Query's `status` field, returned by
 * the `useQuery` hook. Content is optionally overrideable through the prop `content`.
 */
function QueryStatusModal(props: QueryStatusModalProps) {
  const { isOpen, status, onSettledClose, content } = props;

  return (
    <Dialog open={isOpen} maxWidth="md" aria-label="query-status-modal">
      <Box
        sx={{
          width: "20rem",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: REM_BALANCE,
            p: REM_BALANCE,
            pb: 0,
          }}
        >
          {(status === "error" || status === "success") && <MSBClose onClick={onSettledClose} />}

          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {status === "success" && <XNGIconRenderer i={<MSBICONS.SmallCheck />} size="lg" />}
            {status === "error" && <XNGIconRenderer i={<MSBICONS.Alert />} size="lg" />}
          </Box>
          <Typography variant="h6" sx={{ width: "100%" }}>
            {status === "error" && <>{content?.errorTitle ?? "Hm, something's not right"}</>}
            {status === "pending" && <>{content?.pendingTitle ?? "Performing request..."}</>}
            {status === "success" && <>{content?.successTitle ?? "Thank you"}</>}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            p: REM_BALANCE,
          }}
        >
          {status === "pending" && (
            <Box sx={{ width: "100%" }}>
              <CircularProgress size="3rem" variant="indeterminate" />
            </Box>
          )}

          {status === "success" && (
            <>
              {content?.successBody && (
                <>
                  {typeof content?.successBody !== "string" && content?.successBody}
                  {typeof content?.successBody === "string" && (
                    <FadeIn>
                      <Typography variant="body1">{content?.successBody}</Typography>
                    </FadeIn>
                  )}
                </>
              )}

              <Button color="success" onClick={onSettledClose}>
                Okay
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              {content?.errorBody && (
                <>
                  {typeof content?.errorBody !== "string" && content?.errorBody}
                  {typeof content?.errorBody === "string" && (
                    <FadeIn>
                      <Typography variant="body1">{content?.errorBody}</Typography>
                    </FadeIn>
                  )}
                </>
              )}

              <Button color="error" onClick={onSettledClose}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}

export default QueryStatusModal;
