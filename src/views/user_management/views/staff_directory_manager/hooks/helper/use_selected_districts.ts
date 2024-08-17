import React from "react";
import removeArrayDuplicates from "../../../../../../utils/remove_array_duplicates";
import { ClientAssignment, DistrictRef } from "../../../../../../profile-sdk";

/**
 * useSelectedDistricts Hook
 *
 * This hook is used to manage the selected districts for a client in a staff directory manager view.
 * Allows for the selection and deselection behavior of districts utilized in parts of the staff directory manager view.
 *
 * @param client_id - The ID of the client.
 * @param clientAssignments - An optional array of client assignments.
 * @param defaultSelectedDistrictOptionsClientAssignment - An optional array of default selected district options from the client assignment.
 * @param selected_districts_default - An optional array of default selected districts.
 *
 * @returns An object containing the following properties:
 *   - districtOptions: An array of unique authorized districts for the client.
 *   - selectedDistricts: An array of selected districts.
 *   - setSelectedDistricts: A function to set the selected districts.
 *   - deselectedDistricts: A reference to an array of deselected districts.
 *   - selectedAllAuthorizedDistricts: A boolean indicating whether all authorized districts are selected.
 */
const useSelectedDistricts = (
  client_id: string,
  // we loop through all the client assignments to find the client assignment that matches the client id, then we get the authorized districts from that client assignment
  clientAssignments?: ClientAssignment[] | undefined,
  defaultSelectedDistrictOptionsClientAssignment?: ClientAssignment[] | undefined,
  // here we override the default selected districts with the default selected districts from the client assignment
  selected_districts_default?: DistrictRef[] | undefined,
) => {
  const districtOptions = React.useMemo(() => {
    return removeArrayDuplicates(
      [
        ...(clientAssignments?.find((clientAssigmnet) => clientAssigmnet.client?.id === client_id)
          ?.authorizedDistricts || []),
      ],
      () => "id",
    );
  }, [client_id, clientAssignments]);

  // Calculate the default selected districts based on the client assignments and the selected_districts_default
  const defaultSelectedDistricts = React.useMemo(() => {
    const retVal = removeArrayDuplicates(
      [
        ...(selected_districts_default ||
          defaultSelectedDistrictOptionsClientAssignment?.find(
            (clientAssigmnet) => clientAssigmnet.client?.id === client_id,
          )?.authorizedDistricts ||
          []),
      ],
      () => "id",
    );

    return !!defaultSelectedDistrictOptionsClientAssignment || selected_districts_default
      ? retVal
      : undefined;
  }, [client_id, defaultSelectedDistrictOptionsClientAssignment, selected_districts_default]);

  // Initialize the selected districts state with the default selected districts or the district options
  const [selectedDistricts, setSelectedDistricts] = React.useState<DistrictRef[]>([
    ...(defaultSelectedDistricts || districtOptions),
  ]);

  // Initialize the deselected districts reference
  const deselectedDistricts = React.useRef<string[]>();

  // Calculate whether all authorized districts are selected
  const selectedAllAuthorizedDistricts = React.useMemo(() => {
    return selectedDistricts.length === districtOptions.length;
  }, [selectedDistricts.length, districtOptions.length]);

  return {
    districtOptions,
    selectedDistricts,
    setSelectedDistricts,
    deselectedDistricts,
    selectedAllAuthorizedDistricts,
  };
};

export default useSelectedDistricts;
