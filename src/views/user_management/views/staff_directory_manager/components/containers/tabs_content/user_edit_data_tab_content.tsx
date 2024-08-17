import { Box, Button } from "@mui/material";
import React from "react";
import GridSectionLayout from "../../../../../../../design/high-level/common/grid_section_layout";
import XNGSmartTable from "../../../../../../../design/high-level/common/xng_smart_table";

const UserEditDataTabContent = () => {
  const rows = [
    {
      itemModified: "John Doe",
      dateModified: "Leader ISD",
      userWhoModified: "Campus 1",
      modification: "Speech Therapy",
    },
    {
      itemModified: "Jane Smith",
      dateModified: "Leader ISD",
      userWhoModified: "Campus 2",
      modification: "Occupational Therapy",
    },
    {
      itemModified: "Mike Johnson",
      dateModified: "Leader ISD",
      userWhoModified: "Campus 3",
      modification: "Physical Therapy",
    },
    {
      itemModified: "Sarah Williams",
      dateModified: "Principal",
      userWhoModified: "Campus 4",
      modification: "Counseling",
    },
    {
      itemModified: "David Brown",
      dateModified: "Teacher",
      userWhoModified: "Campus 5",
      modification: "Special Education",
    },
    {
      itemModified: "Emily Davis",
      dateModified: "Leader ISD",
      userWhoModified: "Campus 6",
      modification: "Behavioral Therapy",
    },
  ];

  return (
    <Box>
      <GridSectionLayout
        headerConfig={{
          title: "<NAME> Edit Data",
        }}
        rows={[
          {
            fullwidth: true,
            cells: [
              <Box>
                <XNGSmartTable
                  headerConfig={{
                    bgColor: "white",
                  }}
                  columnsConfig={{
                    columns: [
                      {
                        key: "itemModified",
                        headerName: "Item Modified",
                      },
                      {
                        key: "dateModified",
                        headerName: "Date Modified",
                      },
                      {
                        key: "userWhoModified",
                        headerName: "User Who Modified",
                      },
                      {
                        key: "modification",
                        headerName: "Modification",
                        useOverride: {
                          overrideColumnIndex: 3,
                          overrideCell: (row) => {
                            return (
                              <Button onClick={() => console.log(row.modification)}>View</Button>
                            );
                          },
                        },
                      },
                    ],
                  }}
                  rowsConfig={{
                    rows: rows,
                  }}
                  maxheight={"250px"}
                />
              </Box>,
            ],
          },
        ]}
      />
    </Box>
  );
};

export default UserEditDataTabContent;
