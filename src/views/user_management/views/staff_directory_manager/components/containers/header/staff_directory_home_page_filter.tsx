import { Box, Stack, Typography, debounce } from "@mui/material";
import XNGToggle from "../../../../../../../design/low-level/button_toggle";
import XNGSimpleSearchBar from "../../../../../../../design/low-level/simple_searchbar";
import usePalette from "../../../../../../../hooks/usePalette";
import useApiQueryServiceProviders from "../../../../../../../api/hooks/service_provider/use_api_query_service_providers";
import React from "react";
import useUserManagementContext from "../../../../../hooks/context/use_user_management_context";
import useStaffDirectoryHomePageContext from "../../../hooks/context/use_staff_directory_home_page_context";

const StaffDirectoryHomePageFilter = () => {
  const palette = usePalette();

  const clientId = useUserManagementContext().store.userManagementData.client?.id;
  const stateInUs = useUserManagementContext().store.userManagementData.stateInUs;

  const showInactiveStaff =
    useStaffDirectoryHomePageContext().store.tableData.filter.showInactiveStaff;

  const [controlledSearchValue, setControlledSearchValue] = React.useState("");

  const filterCount =
    useStaffDirectoryHomePageContext().apiQueryStaffDirectory.data?.dataList?.length;

  const totalProviderCount =
    useStaffDirectoryHomePageContext().apiQueryStaffDirectory.data?.totalRecords;

  const staffDirectoryDispatch = useStaffDirectoryHomePageContext().dispatch;

  const queryApiProviders = useApiQueryServiceProviders({
    queryParams: {
      clientId: clientId || "",
      state: stateInUs,
    },
  });

  const searchProviderOptions = React.useMemo(() => {
    return queryApiProviders.data?.serviceProviders?.map((provider) => {
      return provider.firstName + " " + provider.lastName + " " + provider.email;
    });
  }, [queryApiProviders.data?.serviceProviders]);

  const updateSearchFilterQueryParamHandler = React.useMemo(() => {
    return debounce((searchValue: string) => {
      staffDirectoryDispatch({
        type: "set_provider_search_filter",
        payload: { searchedProvider: searchValue },
      });
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSearchFilterHandler = (searchValue: string) => {
    setControlledSearchValue(searchValue);
    updateSearchFilterQueryParamHandler(searchValue);
  };

  const toggeAndSeachFilterSecion = (
    <Stack
      direction={"row"}
      flexGrow={1}
      gap={3}
      width={"100%"}
      sx={{
        flexDirection: {
          flexDirection: "column",
          sm: "row",
        },

        justifyContent: {
          justifyContent: "center",
          md: "flex-start",
        },
        alignItems: "center",
      }}
    >
      <XNGToggle
        label="Show Inactive Staff"
        onToggle={() => {
          // console.log("active toggle", e);
          staffDirectoryDispatch({
            type: "set_show_inactive_staff_filter",
            payload: { showInactive: !showInactiveStaff },
          });
        }}
        value={showInactiveStaff}
      />
      <Box maxWidth={"300px"} sx={{ flexGrow: 1 }}>
        <XNGSimpleSearchBar
          id={"staff-directory-search"}
          value={controlledSearchValue}
          useFilterOptions={{
            limit: 20,
          }}
          options={[...(searchProviderOptions || [])]}
          size={"small"}
          useInputField={{
            label: "",
            placeholder: "Search by Provider or Email",
          }}
          useStartAdornment
          disableDropdown
          onInputChange={(_, v) => {
            updateSearchFilterHandler(v);
          }}
        />
      </Box>
    </Stack>
  );

  const filterResultAndTotalProvidersSecion = (
    <Stack
      direction={"row"}
      gap={2}
      sx={{
        flexDirection: {
          flexDirection: "column",
          sm: "row",
        },

        justifyContent: {
          justifyContent: "center",
          // sm: "flex-start"
        },
      }}
    >
      <Typography whiteSpace={"nowrap"}>
        Filter results:{" "}
        <Box component={"span"} color={palette.primary[2]}>
          {filterCount}
        </Box>
      </Typography>
      <Typography whiteSpace={"nowrap"}>
        Total Providers:{" "}
        <Box component={"span"} color={palette.primary[2]}>
          {totalProviderCount}
        </Box>
      </Typography>
    </Stack>
  );
  return (
    <Stack
      width={"100%"}
      direction={"row"}
      gap={2}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        flexDirection: {
          flexDirection: "column",
          md: "row",
        },

        justifyContent: {
          justifyContent: "center",
          // sm: "flex-start"
        },
      }}
    >
      {toggeAndSeachFilterSecion}
      {filterResultAndTotalProvidersSecion}
    </Stack>
  );
};

export default StaffDirectoryHomePageFilter;
