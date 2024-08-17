import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import XNGDropDown from "../../../design/low-level/dropdown2";
import usePalette from "../../../hooks/usePalette";
import { DistrictRef } from "../../../profile-sdk";

type Props = {
  clientName: string | undefined;
  authorizedDistrictsData: {
    authorizedDistrictsOptions: DistrictRef[] | undefined;
    selectedDistricts: DistrictRef;
    setSelectedDistricts: (value: DistrictRef) => void;
  };
  content?: React.ReactNode; // Optional content property
};

const UserManagementHeader = (props: Props) => {
  const palette = usePalette();
  const { clientName, authorizedDistrictsData, content } = props;

  return (
    <Stack
      bgcolor={palette.primary[1]}
      boxShadow={2}
      mb={3}
      p={2}
      alignItems={"center"}
      gap={2}
      sx={{
        borderRadius: "3px",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        justifyContent: {
          xs: "center",
          sm: "space-between",
        },
        // alignItems: {
        //   xs: "center",
        //   sm: "flex-start",
        // },
      }}
    >
      <Stack
        gap={2}
        sx={{
          alignItems: {
            alignItems: "center",
            sm: "flex-start",
          },
        }}
      >
        <Typography
          variant="h5"
          component={"h3"}
          color={palette.contrasts[3]}
          sx={{
            textAlign: {
              textAlign: "center",
              sm: "left",
            },
          }}
        >
          {clientName}
        </Typography>

        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <Box maxWidth={"300px"}>
            <XNGDropDown
              fullWidth
              size="small"
              variant="onPrimary"
              id={"authorized-districts"}
              useTypedDropDown={{
                value: authorizedDistrictsData.selectedDistricts,
                items: authorizedDistrictsData.authorizedDistrictsOptions || [],
                getRenderedValue: (item) => item?.name || "",
                onChange: (value) => {
                  authorizedDistrictsData.setSelectedDistricts(value);
                },
              }}
              // items={authorizedDistrictsData.authorizedDistrictsOptions || []}
              label={undefined}
              // value={authorizedDistrictsData.selectedDistricts}
              // onChange={(e) =>
              //   authorizedDistrictsData.setSelectedDistricts(e.target.value as string)
              // }
            />
          </Box>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Box
              width={"15px"}
              bgcolor={palette.success[2]}
              sx={{ aspectRatio: "1 / 1", borderRadius: "50%" }}
            ></Box>
            <Typography variant="body1" component={"p"} color={palette.contrasts[3]}>
              Active
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Box>{content}</Box>
    </Stack>
  );
};

export default UserManagementHeader;
