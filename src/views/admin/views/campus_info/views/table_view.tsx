import { useContext, useMemo, useState } from "react";
import XNGBigTable from "../../../../../design/high-level/xngbigtable/table";
import { CampusLineItemCard, DistrictRef, RemoveCampusRequest } from "../../../../../profile-sdk";
import { API_DISTRICTS } from "../../../../../api/api";
import { useXNGSelector } from "../../../../../context/store";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import useXNGBigTableKeyedRows from "../../../../../design/high-level/xngbigtable/hooks/use_big_table_keyed_rows";
import useXNGBigTableSortStateManager from "../../../../../design/high-level/xngbigtable/hooks/use_sort_state_manager";
import useXNGBigTableSelectableRowStateManager from "../../../../../design/high-level/xngbigtable/hooks/use_selectable_row_state_manager";
import { CampusInformationContext } from "../campus_info";
import { Box, Typography, Button } from "@mui/material";
import { ConfirmModal } from "../../../../../design";
import { XNGBigTableSelectableRowState } from "../../../../../design/high-level/xngbigtable/types";
import { CampusInformationFetchedTable } from "../types/types";
import { CampusFormValues, domainToForm } from "../temp/form_to_domain";

export default function CampusInformationTableView() {
  // Context, Selectors
  const { district, setSelectedSlide, setSlide1Screen, table } =
    useContext(CampusInformationContext);
  const stateInUS = useXNGSelector(selectStateInUS);

  // Table Logic
  const defaultRows = useMemo(() => {
    return table!.campusLineItemsRes?.lineItemCards ?? [];
  }, [table!.campusLineItemsRes]);
  const { sortState, selectionState } = useTableStateManagers({ defaultRows });

  // States
  const [removeConfirmationOpen, setRemoveConfirmationOpen] = useState<boolean>(false);

  // Shortcut Constants
  const numSelected = selectionState.rowSelections.filter((r) => r.isSelected).length;
  const isAnySelected = numSelected > 0;

  async function fetchDefaultValues(campusID: string): Promise<CampusFormValues> {
    const campus = await API_DISTRICTS.v1DistrictsIdSchoolCampusesSchoolCampusIdGet(
      district!.id!,
      campusID,
      stateInUS,
    );
    const formValues = domainToForm(campus);

    return formValues;
  }

  return (
    <>
      <RemoveCampusTwoLayerConfirmationModals
        modalState={{ removeConfirmationOpen, setRemoveConfirmationOpen }}
        dependencies={{ district, numSelected, selectionState, table: table! }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Campus Information</Typography>

          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Button disabled={!isAnySelected} onClick={() => setRemoveConfirmationOpen(true)}>
              Remove
            </Button>
            <Button
              onClick={() => {
                setSlide1Screen({ id: "add" });
                setSelectedSlide(1);
              }}
            >
              Add
            </Button>
          </Box>
        </Box>

        <XNGBigTable<CampusLineItemCard>
          columns={[
            { key: "name", label: "Campus Name" },
            { key: "stateId", label: "State ID" },
            { key: "address", label: "Address" },
            { key: "contactFullName", label: "Contact" },
            { key: "contactRole", label: "Contact Role" },
            { key: "contactEmail", label: "Contact Email" },
          ]}
          useSort={sortState}
          useSelectableRows={selectionState}
          styling={{ heightRelativeToScreen: 25 }}
          overrideFunctionalities={{
            onRowClick: async (campus) => {
              setSelectedSlide(1);
              setSlide1Screen({
                id: "edit",
                params: {
                  campusID: campus.id!,
                  defaultFormValues: await fetchDefaultValues(campus.id!),
                },
              });
            },
          }}
        />
      </Box>
    </>
  );
}

/**
 * Accepts and processes our fetched data, returning state that will
 * allow us to appropriately render rows in our `XNGBigTable`.
 */
function useTableStateManagers(props: { defaultRows: CampusLineItemCard[] }) {
  const { defaultRows } = props;

  const keyedRows = useXNGBigTableKeyedRows<CampusLineItemCard>({
    defaultRows,
  });
  const sortState = useXNGBigTableSortStateManager<CampusLineItemCard>({
    keyedRows,
    originalRows: defaultRows,
  });
  const selectionState = useXNGBigTableSelectableRowStateManager<CampusLineItemCard>({
    keyedRows,
  });

  return { sortState, selectionState };
}

function RemoveCampusTwoLayerConfirmationModals(props: {
  modalState: {
    removeConfirmationOpen: boolean;
    setRemoveConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  dependencies: {
    numSelected: number;
    selectionState: XNGBigTableSelectableRowState<CampusLineItemCard>;
    district: DistrictRef | null;
    table: CampusInformationFetchedTable;
  };
}) {
  const { removeConfirmationOpen, setRemoveConfirmationOpen } = props.modalState;
  const { numSelected, selectionState, district, table } = props.dependencies;
  const stateInUS = useXNGSelector(selectStateInUS);

  const [secondRemoveConfirmationOpen, setSecondRemoveConfirmationOpen] = useState<boolean>(false);

  return (
    <>
      {/* Modals */}
      <ConfirmModal
        open={removeConfirmationOpen}
        onClose={() => setRemoveConfirmationOpen(false)}
        onConfirm={() => {
          setRemoveConfirmationOpen(false);
          setSecondRemoveConfirmationOpen(true);
        }}
        injectContent={{
          titleText: "Remove Campuses",
          body: (
            <Typography variant="body1">
              {numSelected > 1 ? (
                <>
                  Are you sure you want to remove these <strong>{numSelected}</strong> campuses?
                </>
              ) : (
                <>Are you sure you want to remove this campus?</>
              )}
            </Typography>
          ),
          noText: "No",
          yesText: "Yes",
        }}
      />
      <ConfirmModal
        open={secondRemoveConfirmationOpen}
        onClose={() => setSecondRemoveConfirmationOpen(false)}
        onConfirm={async () => {
          const body: RemoveCampusRequest = { campusIds: [] };
          selectionState.rowSelections.forEach((campus) => {
            if (campus.isSelected && campus.row.id) {
              body.campusIds!.push(campus.row.id);
            }
          });

          await API_DISTRICTS.v1DistrictsDistrictIdCampusesRemovePatch(
            district?.id!,
            stateInUS,
            body,
          );
          table.refetch();
          setSecondRemoveConfirmationOpen(false);
        }}
        injectContent={{
          titleText: "Remove Campuses",
          body: (
            <Typography variant="body1">
              {numSelected > 1 ? (
                <>
                  <strong>Warning:</strong> You are about to permanently remove{" "}
                  <strong>{numSelected}</strong> campuses. This action cannot be undone. Do you wish
                  to proceed?
                </>
              ) : (
                <>
                  <strong>Warning:</strong> You are about to permanently remove this campus. This
                  action cannot be undone. Do you wish to proceed?
                </>
              )}
            </Typography>
          ),
          noText: "No",
          yesText: "Yes",
        }}
      />
    </>
  );
}
