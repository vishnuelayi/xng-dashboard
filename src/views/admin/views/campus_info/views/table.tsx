import { useContext, useEffect, useMemo, useState } from "react";
import XNGBigTable from "../../../../../design/high-level/xngbigtable/table";
import {
  DistrictRef,
  GetSchoolCampusLineItemsResponse,
  CampusLineItemCard,
} from "../../../../../profile-sdk";
import { API_DISTRICTS } from "../../../../../api/api";
import { useXNGSelector } from "../../../../../context/store";
import { selectStateInUS } from "../../../../../context/slices/stateInUsSlice";
import { TableRequestParameters } from "../../../../../design/high-level/xngbigtable/types";
import useXNGBigTableKeyedRows from "../../../../../design/high-level/xngbigtable/hooks/use_big_table_keyed_rows";
import useXNGBigTableSortStateManager from "../../../../../design/high-level/xngbigtable/hooks/use_sort_state_manager";
import useXNGBigTableSelectableRowStateManager from "../../../../../design/high-level/xngbigtable/hooks/use_selectable_row_state_manager";
import { CampusInformationContext } from "../campus_info";
import { Box, Typography, Button } from "@mui/material";

export default function CampusInformationTableView() {
  const { district, setSelectedSlide, table } = useContext(CampusInformationContext);

  const { sortState, selectionState } = useTableStateManagers({ district });

  return (
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
          <Button>Remove</Button>
          <Button onClick={() => setSelectedSlide(1)}>Add</Button>
        </Box>
      </Box>

      <XNGBigTable<CampusLineItemCard>
        styling={{ heightRelativeToScreen: 27 }}
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
      />
    </Box>
  );
}

function useFetchTable(props: { dependencies: { district: DistrictRef | null } }): {
  campusLineItemsRes: GetSchoolCampusLineItemsResponse | null;
  refetch: (trp: TableRequestParameters<CampusLineItemCard>) => void;
} {
  const { dependencies } = props;

  const stateInUS = useXNGSelector(selectStateInUS);

  async function refetch() {
    if (!dependencies.district) return;

    const res: GetSchoolCampusLineItemsResponse =
      await API_DISTRICTS.v1DistrictsDistrictIdSchoolCampusesLineItemDisplaysGet(
        dependencies.district.id!,
        stateInUS,
      );

    setCampusDropdownsRes(res);
  }

  const [campusLineItemsRes, setCampusDropdownsRes] =
    useState<GetSchoolCampusLineItemsResponse | null>(null);

  useEffect(() => {
    refetch();
  }, [dependencies.district]);

  return { campusLineItemsRes, refetch };
}

function useTableStateManagers(props: { district: DistrictRef | null }) {
  const { district } = props;

  const table = useFetchTable({ dependencies: { district } });

  const defaultRows = useMemo(() => {
    return table.campusLineItemsRes?.lineItemCards ?? [];
  }, [table.campusLineItemsRes]);

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
