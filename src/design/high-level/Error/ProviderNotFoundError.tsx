import { useXNGDispatch, useXNGSelector } from "../../../context/store";
import { providerNotFoundErrorActions } from "../../../context/slices/providerNotFoundErrorSlice";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";
import XNGErrorDialog from "../../modal_templates/XNGErrorDialog";

const ProviderNotFoundError = () => {
  const clientName = useXNGSelector((state) => state.loggedInClient?.name);
  const showError = useXNGSelector((state) => state.providerNotFoundErrorSlice);

  const dispatch = useXNGDispatch();

  return (
    <XNGErrorDialog
      open={showError.show}
      onClose={() =>
        dispatch(
          providerNotFoundErrorActions.ACTION_ShowProviderNotFound({
            show: false,
            errorMsg: "",
          }),
        )
      }
      useClose={{}}
    >
      It seems that you are attempting to login to the district account:{" "}
      <Typography color={"primary"} display={"inline"}>
        {clientName}
      </Typography>
      , which has not been set up yet. If you did not intend to login to this district, you can
      select another one via the dropdown menu in the navigation bar. If you believe this district
      should already be available in X Logs, please contact{" "}
      <Link href="https://static.zdassets.com/web_widget/latest/liveChat.html?v=10#key=msbsconnect.zendesk.com">
        Client Care.
      </Link>
    </XNGErrorDialog>
  );
};

export default ProviderNotFoundError;
