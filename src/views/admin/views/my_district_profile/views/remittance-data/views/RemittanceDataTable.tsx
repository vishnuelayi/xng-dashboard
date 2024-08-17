import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useApi } from "../../../context/apiContext";

const columns: GridColDef[] = [
  { field: "districtName", headerName: "District Name", width: 150, sortable: false },
  { field: "raNumber", headerName: "RA Number", width: 130, sortable: false },
  {
    field: "raDate",
    headerName: "RA Date",
    width: 220, // Increased width
    sortable: false,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: "checkDate",
    headerName: "CheckDate",
    width: 220, // Increased width
    sortable: false,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: "checkAmount",
    headerName: "Check Amount",
    width: 170,
    sortable: false,
    valueFormatter: (params) => `$${params.value.toFixed(2)}`,
  },
  {
    field: "invoiceAmount",
    headerName: "Invoice Amount",
    width: 200,
    sortable: false,
    valueFormatter: (params) => `$${params.value.toFixed(2)}`,
  },
];

const RemittanceDataTable: React.FC = () => {
  const { apiValue } = useApi();
  const [gridValues, setGridValues] = useState<any[]>([]);

  useEffect(() => {
    if (apiValue?.remittanceScheduleReports) {
      const newGridValues = apiValue.remittanceScheduleReports.map((item, index) => ({
        id: index,
        districtName: item.districtName,
        raNumber: item.raNum,
        raDate: item.raDate,
        checkDate: item.checkDate,
        checkAmount: item.checkAmount,
        invoiceAmount: item.invoiceAmount,
      }));
      setGridValues(newGridValues);
    }
  }, [apiValue]);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1600px",
        height: "100%",
        boxShadow: 5,
        padding: 2,
        borderRadius: "10px",
      }}
    >
      <DataGrid
        rows={gridValues}
        columns={columns}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableRowSelectionOnClick
        hideFooter={true}
        autoHeight
        sx={{
          bgcolor: "white",
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#f9fafb",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "15px",
            whiteSpace: "normal",
            lineHeight: "normal",
            display: "flex",
            alignItems: "center",
            color: "#666", // Gray color for cell values
          },
          "& .MuiDataGrid-columnHeader": {
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "black", // Black color for headers
            whiteSpace: "normal",
            lineHeight: "normal",
          },
          "& .MuiDataGrid-columnHeaders": {
            whiteSpace: "normal",
            lineHeight: "normal",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "normal",
            overflow: "visible",
          },
        }}
      />
    </Box>
  );
};

export default RemittanceDataTable;
