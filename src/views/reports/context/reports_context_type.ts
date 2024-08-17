import { DistrictRef } from "../../../profile-sdk";

/**
 * Represents the type of the reports context.
 */
type ReportsContextType = {
  clientId: string;
  authorizedDistricts: DistrictRef[] | undefined;
  stateInUs: string;
  contentPanel: HTMLDivElement | null; //panel containing the session logs ui components. Specifically added to context for scrolling to table when user generates summary report
};

export default ReportsContextType;
