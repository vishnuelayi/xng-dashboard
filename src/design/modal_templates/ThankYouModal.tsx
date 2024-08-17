import { Typography } from "@mui/material";
import { XNGIconRenderer, XNGICONS } from "../icons";
import { SingleActionModal } from "./single_action";
import usePalette from "../../hooks/usePalette";
import { useXNGDispatch, useXNGSelector } from "../../context/store";
import { thankYouModalActions } from "../../context/slices/thankYouModalSlice";

const ThankYouModal = () => {
  const thankYouModal = useXNGSelector((state) => state.thankYouModalSlice);
  const dispatch = useXNGDispatch();

  const palette = usePalette();
  return (
    <SingleActionModal
      open={thankYouModal.show}
      onClose={() => {
        dispatch(thankYouModalActions.ACTION_ShowThankyouModal({ show: false }));
        if (thankYouModal.cleanup) {
          thankYouModal.cleanup();
          dispatch(thankYouModalActions.ACTION_ResetCleanup);
        }
      }}
      injectContent={{
        icon: (
          <XNGIconRenderer color={palette.success[4]} size="2rem" i={<XNGICONS.SmallCheck />} />
        ),
        buttonText: "Close",
        header: "Thank You!",
        body: (
          <Typography textAlign={"center"} whiteSpace={"pre-wrap"}>
            {thankYouModal?.text}
          </Typography>
        ),
      }}
    />
  );
};

export default ThankYouModal;
