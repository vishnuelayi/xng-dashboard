import { Outlet } from "react-router";
import { useRef } from "react";
import ReportsContextType from "./context/reports_context_type";
import { useXNGSelector } from "../../context/store";
import { selectStateInUS } from "../../context/slices/stateInUsSlice";
import { selectLoggedInClientAssignment } from "../../context/slices/userProfileSlice";

function ReportsOutlet() {
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const clientId = loggedInClientAssignment.client?.id;
  const authorizedDistricts = loggedInClientAssignment.authorizedDistricts;
  const stateInUs = useXNGSelector(selectStateInUS);

  const contentPanelRef = useRef<HTMLDivElement>(null);

  const reportsContext: ReportsContextType = {
    clientId: clientId ?? "",
    authorizedDistricts,
    stateInUs,
    contentPanel: contentPanelRef.current,
  };

  return (
    <Outlet
      context={reportsContext}
    />
  );
}

export default ReportsOutlet;
