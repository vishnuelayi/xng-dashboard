import { Typography } from "@mui/material";
import { thankYouModalActions } from "../../context/slices/thankYouModalSlice";
import { useXNGSelector, useXNGDispatch } from "../../context/store";
import usePalette from "../../hooks/usePalette";
import { XNGIconRenderer, XNGICONS } from "../icons";
import { SingleActionModal } from "./single_action";
import { removeProvderConfirmationModalAction } from "../../context/slices/removeProviderConfirmationModalSlice";
import { useProfileMenuActions } from "../high-level/navbar/menus/profile/_profile_menu";

const RemoveProviderConfirmationModal = () => {
  const confirmationModal = useXNGSelector((state) => state.removeProviderConfirmationModalSlice);
  const profileMenuActions = useProfileMenuActions();
  const dispatch = useXNGDispatch();
  const palette = usePalette();

  return (
    <SingleActionModal
      open={confirmationModal.show}
      onClose={() => {
        dispatch(removeProvderConfirmationModalAction.ACTION_ShowModal({ show: false }));
      }}
      injectContent={{
        icon: <XNGIconRenderer color={palette.danger[4]} size="2rem" i={<XNGICONS.Alert />} />,
        buttonText: "Yes, Remove",
        header: "Warning",
        body: (
          <Typography textAlign={"center"} whiteSpace={"pre-wrap"}>
            {confirmationModal.confirmationData.confirmationText}
          </Typography>
        ),
        onButtonClick() {
          switch (confirmationModal.confirmationData.providerInformation.caseloadType) {
            case "proxyCaseload":
              profileMenuActions.removeProviderFromProxyCaseload(
                confirmationModal.confirmationData.providerInformation.providerId,
              );
              break;
            case "approverCaseload":
              profileMenuActions.removeProviderFromApproverCaseload(
                confirmationModal.confirmationData.providerInformation.providerId,
              );
              break;
          }
        },
      }}
    />
  );
};

export default RemoveProviderConfirmationModal;
