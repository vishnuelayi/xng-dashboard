import { Box, CreateFilterOptionsConfig, Stack, createFilterOptions } from "@mui/material";
import { XNGIconRenderer, XNGICONS } from "../../../../design/icons";
// import DateFieldRange from "../../components/common/date_field_range";
import useUnpostedSessionsCtx from "../../hooks/context/useUnpostedSessionsCtx";
import { filterObjectType } from "../../types/SelectedUnpostedSessionsFilter";
import React from "react";
import { StudentRef } from "../../../../profile-sdk";
import { MSBSearchMultiselect } from "../../../../fortitude";

// import { useLocation } from "react-router-dom";

/**
 * This component renders the filter section for unposted sessions.
 * @returns The UnpostedSessionsFilter component.
 */
export const UnpostedSessionsFilter = () => {
  /**
   * This component retrieves the filter context from the Unposted Sessions context.
   * @returns The filter context from the Unposted Sessions context.
   */
  const selectedFilterData = useUnpostedSessionsCtx().selectedFilterData;

  const unpostedSessionsCardsData =
    useUnpostedSessionsCtx().unpostedSessionsData.unpostedSessionsApiData?.slimCards;

  const filterOptions =
    useUnpostedSessionsCtx().unpostedSessionsData.unpostedSessionsApiData?.filterOptions;

  const studentOptions = React.useMemo(() => {
    const options: StudentRef[] = [];

    selectedFilterData.selectedFilter.providers?.forEach((provider) => {
      const card = unpostedSessionsCardsData?.[provider.id];
      if (card) {
        card?.forEach((session) => {
          const students = session?.students;

          students?.forEach((student) => {
            const optionStudent = options.find((option) => option.id === student?.id);
            if (!optionStudent) {
              options.push(student);
            }
          });
        });
      }
    });

    return options;
  }, [selectedFilterData.selectedFilter.providers, unpostedSessionsCardsData]);

  const setSelectedProvidersHandler = (selected: filterObjectType[]) => {
    selectedFilterData.setSelectedFilter({ providers: selected });
  };

  const setSelectedStudentsHandler = (selected: filterObjectType[]) => {
    selectedFilterData.setSelectedFilter({ students: selected });
  };

  function msbMUIAutoCompleteFilterOptions<T>(options?: CreateFilterOptionsConfig<T>) {
    return createFilterOptions<T>(options ?? { limit: 500 }); //defaults to a limit of 500 if no options are provided
  }
  return (
    <Box pb={5}>
      <Stack
        flexWrap={"wrap"}
        sx={{
          flexDirection: {
            direction: "column",
            sm: "row",
          },
          gap: {
            xs: 2,
            xl: 9,
          },
          alignItems: "center",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"start"}
          gap={3}
          sx={{ maxWidth: "320px", width: "100%" }}
        >
          <XNGIconRenderer i={<XNGICONS.Filter />} size={"small"} />
          <MSBSearchMultiselect
            selectedOptions={selectedFilterData.selectedFilter.providers ?? []}
            options={
              filterOptions?.providerOptions?.map((p) => ({
                id: `${p.id}`,
                name: `${p.firstName} ${p.lastName}`,
              })) ?? []
            }
            getOptionLabel={(option) => `${option?.name}` ?? ""}
            onChange={(sp) => setSelectedProvidersHandler(sp)}
            renderOptionVariant="checkbox"
            variant="no overflow after 1"
            isOptionEqualToValue={(option, value) => option.id === value.id}
            label="Provider"
            sx={{ backgroundColor: "white", width: "100%" }}
            autocompleteProps={{
              disableCloseOnSelect: true,
              filterOptions: msbMUIAutoCompleteFilterOptions(),
            }}
          />
        </Stack>

        <MSBSearchMultiselect
          selectedOptions={selectedFilterData.selectedFilter.students ?? []}
          options={
            studentOptions?.map((s) => ({
              id: `${s.id}`,
              name: `${s.firstName} ${s.lastName}`,
            })) ?? []
          }
          getOptionLabel={(option) => `${option?.name}` ?? ""}
          onChange={(selStudents) => setSelectedStudentsHandler(selStudents)}
          renderOptionVariant="checkbox"
          variant="no overflow after 1"
          isOptionEqualToValue={(option, value) => option.id === value.id}
          label="Student"
          sx={{ backgroundColor: "white", width: "100%", maxWidth: "320px" }}
          autocompleteProps={{
            disableCloseOnSelect: true,
            filterOptions: msbMUIAutoCompleteFilterOptions(),
          }}
        />
      </Stack>
    </Box>
  );
};
