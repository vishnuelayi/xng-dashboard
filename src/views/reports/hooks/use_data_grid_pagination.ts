import { DataGridProps } from "@mui/x-data-grid";
import { PageParameters } from "@xng/reporting";
import { useEffect, useState } from "react";

/**
 * Standard hook for handling pagination.
 *
 * Creates a Reporting API `pageParameters` that can be passed as-is directly to paginated requests,
 * and actively maintains and returns the props necessary for a DataGrid to render pagination.
 */
function useDataGridPagination(props: { rowCount: number | undefined }) {
  const [pageParameters, setPageParameters] = useState<PageParameters>({
    pageNumber: 1,
    pageSize: 100,
  });

  const rowCount = useStableValue(props.rowCount ?? 0);

  const dataGridPaginationProps: Partial<DataGridProps> = {
    paginationModel: {
      page: pageParameters.pageNumber! - 1,
      pageSize: pageParameters.pageSize!,
    },
    onPaginationModelChange: (v) => {
      setPageParameters({ pageNumber: v.page + 1, pageSize: v.pageSize });
    },
    rowCount,
    pagination: true,
    paginationMode: "server",
  };

  return { pageParameters, dataGridPaginationProps };
}

/**
 * Ensures that values that zero-out will retain their non-zero value.
 */
function useStableValue(value: number) {
  const [stableValue, setStableValue] = useState<number>(value);

  useEffect(() => {
    if (value > 0) {
      setStableValue(value);
    }
  }, [value]);

  return stableValue;
}

export default useDataGridPagination;
