import { Outlet, Navigate } from "react-router";
import { useXNGSelector } from "./context/store";
import { selectLoggedInClientAssignment, selectUser } from "./context/slices/userProfileSlice";
import { ROUTES_XLOGS } from "./constants/URLs";

export default function AdminProtectedRoute() {
  const loggedInClientAssignment = useXNGSelector(selectLoggedInClientAssignment);
  const user = useXNGSelector(selectUser);

  const isClientAdmin =
    loggedInClientAssignment.isDelegatedAdmin || loggedInClientAssignment.isExecutiveAdmin;
  const isMSBAdmin = user?.isMsbAdmin || user?.isSuperAdmin;

  return isClientAdmin || isMSBAdmin ? <Outlet /> : <Navigate to={ROUTES_XLOGS.calendar} replace />;
}
