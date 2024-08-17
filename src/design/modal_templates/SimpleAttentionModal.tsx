import React from "react";
import XNGErrorDialog from "./XNGErrorDialog";
import { useXNGDispatch, useXNGSelector } from "../../context/store";
import { SimpleAttentionMessagesActions } from "../../context/slices/SimpleAttentionMessageSlice";
import Typography from "@mui/material/Typography";

export const SimpleAttentionModal = () => {
  const attentionModalData = useXNGSelector((state) => state.SimpleAttentionMessageSlice);

  const dispach = useXNGDispatch();

  return (
    <XNGErrorDialog
      open={attentionModalData.showModal}
      onClose={() =>
        dispach(
          SimpleAttentionMessagesActions.ACTION_ShowModal({
            show: false,
            message: "",
          }),
        )
      }
      useClose={{
        closeButtonLabel: "OK",
      }}
    >
      <Typography textAlign={"center"} whiteSpace={"pre-line"}>
        {attentionModalData.message}
      </Typography>
    </XNGErrorDialog>
  );
};
