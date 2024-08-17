import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useForm, Controller } from "react-hook-form";
import session_date_filter_options from "../../../../data/get_session_date_filter_options";
import GetSessionReportStatusOptions from "../../../../data/get_session_report_status_options";
import GridSectionLayout from "../../../../design/high-level/common/grid_section_layout";
import { XNGDateField } from "../../../unposted_sessions/components/common/date_field";
import XNGDropDown from "../../../../design/low-level/dropdown2";
import SessionLogsFormFilterData, {
  FiltersFormType,
  filters_form_schema,
} from "./session_logs_form_filter_data";
import React from "react";
import { DistrictRef } from "../../../../profile-sdk";
import { Stack } from "@mui/system";
import generateWeeks from "../../utils/generate_weeks_from_year_range";
import produce from "immer";
import { MSBSearchMultiselect } from "../../../../fortitude";
import msbMUIAutoCompleteFilterOptions from "../../../../utils/msb_mui_auto_complete_filter_options";
import { DisabledPreselectedDropdown } from "./components/disabled_preselected_dropdown";

type SessionLogsFormProps = {
  defaultOptions: SessionLogsFormFilterData;
  update_selected_authorized_district_ids: (districts: DistrictRef[]) => void;
  onSubmitFormFilters: (data: FiltersFormType) => void;
};
const SessionLogsForm = (props: SessionLogsFormProps) => {
  //#region REACT HOOKS
  const has_initialized_schools = React.useRef(false);
  //#endregion

  //#region HOOKFORMS
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<FiltersFormType>({
    resolver: yupResolver(filters_form_schema),
    defaultValues: {
      session_date_filter: "Date Range",
      session_filter: [],
      show_iep_service_data: false,
      student_with_session: false,
      medical_eligible_only: false,
      service_providers:
        props.defaultOptions.serviceProviders.length === 1
          ? props.defaultOptions.serviceProviders
          : [],
      dols:
        props.defaultOptions.districtsOfLiability.length === 1
          ? props.defaultOptions.districtsOfLiability
          : [],
      service_types: [],
      schools: [],
    },
  });

  const selected_session_date_filter = watch("session_date_filter");
  const start_year = watch("date_filter_options.start_year");
  const end_year = watch("date_filter_options.end_year");
  const selected_districts = watch("dols");
  const selected_campuses = watch("schools");
  //#endregion

  //#region METHODS
  const onSubmitFilters = (data: FiltersFormType) => {
    const new_form_data = produce(data, (draft) => {
      draft.schools =
        draft.schools?.length === props.defaultOptions.campuses.length ? undefined : draft.schools;
      draft.dols =
        draft.dols?.length === props.defaultOptions.districtsOfLiability.length
          ? undefined
          : draft.dols;
      draft.service_providers =
        draft.service_providers?.length === props.defaultOptions.serviceProviders.length
          ? undefined
          : draft.service_providers;
      draft.service_types =
        draft.service_types?.length === props.defaultOptions.service_types.length
          ? undefined
          : draft.service_types;
    });
    props.onSubmitFormFilters(new_form_data);
  };
  //#endregion

  //#region SIDE EFFECTS
  React.useEffect(() => {
    if (selected_districts) {
      props.update_selected_authorized_district_ids(selected_districts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected_districts]);

  React.useEffect(() => {
    if (!has_initialized_schools.current && props.defaultOptions.campuses.length > 0) {
      has_initialized_schools.current = true;
      setValue("schools", []);
    } else if (props.defaultOptions.campuses) {
      const new_selected_campuses =
        selected_campuses?.filter(
          (selected_campus) =>
            !!props.defaultOptions.campuses.find(
              (campus_option) => campus_option.id === selected_campus.id,
            ),
        ) || [];
      setValue("schools", new_selected_campuses);
    }
  }, [props.defaultOptions.campuses]);
  //#endregion

  //#region SECTIONS
  const session_filters_section = (
    <GridSectionLayout
      headerConfig={{
        title: "Session Filter(s)",
        title_sx: {
          fontWeight: 700,
        },
      }}
      divider
      bottomMargin={"2rem"}
      rows={[
        {
          rowSx: {
            pb: 3,
          },
          cellSizes: {
            xs: 12,
            lg: 6,
            sm: 6,
          },
          cells: [
            <Typography>Please refine results starting with the "Session Date Filter."</Typography>,
          ],
        },
        {
          rowSx: {
            alignItems: "stretch",
          },
          cellSizes: {
            xs: 12,
            sm: 4,
            lg: 4,
          },
          useCellStyling: {
            sx: {
              py: "18px",
              px: "20px",
              display: "flex",
              alignItems: "center",
            },
          },
          cells: [
            {
              content: (
                <Controller
                  control={control}
                  name="session_date_filter"
                  render={({ field, fieldState: { error } }) => (
                    <XNGDropDown
                      id={"session_date_filter"}
                      variant="onPrimary"
                      size="small"
                      ref={field.ref}
                      name={field.name}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      items={session_date_filter_options}
                      label={"Session Date Filter"}
                      fullWidth
                      maxwidth="100%"
                      useError={error?.message}
                    />
                  )}
                />
              ),
            },
            {
              sx: {
                bgcolor: "contrasts.1",
              },
              content: (
                <Controller
                  control={control}
                  name="session_filter"
                  render={({ field, fieldState: { error } }) => (
                    <XNGDropDown
                      id={"multi-select"}
                      size="small"
                      variant="onPrimary"
                      renderValueVariant="chip"
                      useMultipleSelect={{
                        value: field.value,
                        useSelectAll: true,
                        onChange(item: string[]) {
                          field.onChange(item);
                        },

                        items: GetSessionReportStatusOptions(),
                        getRenderedValue: (item) => item,
                        renderOptionsVariant: "checkbox",
                        onChipDelete: (item, deleteAll) => {
                          if (!deleteAll && field.value) {
                            field.onChange(field.value.filter((i) => i !== item));
                          }
                        },
                      }}
                      label={"Session Filter"}
                      fullWidth
                      maxwidth="100%"
                      useError={error?.message}
                    />
                  )}
                />
              ),
            },
          ],
        },
        {
          useCellStyling: {
            sx: {
              py: "18px",
              px: "20px",
              // display: "flex",
              // alignItems: "center",
            },
          },
          cellSizes: {
            xs: 12,
            sm: 6,
            lg: 4,
          },
          cells: [
            <Box
              key={0}
              sx={{
                display: "flex",
                gap: "1rem",
                flexDirection: "column",
              }}
            >
              {selected_session_date_filter === session_date_filter_options[0] && (
                <>
                  <Stack direction={"row"} gap={1} alignItems={"center"}>
                    <Controller
                      control={control}
                      name="date_filter_options.start_year"
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <XNGDateField
                            size="small"
                            fullWidth
                            label="Start Year"
                            views={["year"]}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => {
                              field.onChange(date?.format("YYYY"));
                            }}
                          />
                        );
                      }}
                    />
                    -
                    <Controller
                      control={control}
                      name="date_filter_options.end_year"
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <XNGDateField
                            size="small"
                            fullWidth
                            label="End Year"
                            views={["year"]}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => {
                              field.onChange(date?.format("YYYY"));
                            }}
                          />
                        );
                      }}
                    />
                  </Stack>
                  {start_year && end_year && (
                    <Controller
                      control={control}
                      name="date_filter_options.week"
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <XNGDropDown
                            id="week-id"
                            label="Week"
                            size="small"
                            fullWidth
                            maxwidth="100%"
                            useTypedDropDown={{
                              items:
                                start_year && end_year
                                  ? generateWeeks(Number(start_year), Number(end_year))
                                  : [],
                              value: field.value || null,
                              onChange: field.onChange,
                              getRenderedValue: (week) =>
                                week ? (
                                  <Typography fontSize={"12.5px"}>
                                    <Box component={"span"} fontSize={"13px"} fontWeight={700}>
                                      Week {week.week_number}:
                                    </Box>{" "}
                                    {dayjs(week.start).format("MM-DD-YYYY")} to{" "}
                                    {dayjs(week.end)?.format("MM-DD-YYYY")}{" "}
                                  </Typography>
                                ) : (
                                  ""
                                ),
                            }}
                          />
                        );
                      }}
                    />
                  )}
                </>
              )}

              {selected_session_date_filter === session_date_filter_options[1] && (
                <Controller
                  control={control}
                  name="date_filter_options.start_date"
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <XNGDateField
                        size="small"
                        fullWidth
                        label="Start Date"
                        value={field.value ? dayjs(field.value).utc() : null}
                        onChange={(date) => {
                          field.onChange(date?.format("MM/DD/YYYY"));
                        }}
                      />
                    );
                  }}
                />
              )}
              {selected_session_date_filter === session_date_filter_options[1] && (
                <Controller
                  control={control}
                  name="date_filter_options.end_date"
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <XNGDateField
                        size="small"
                        fullWidth
                        label="End Date"
                        value={field.value ? dayjs(field.value).utc() : null}
                        onChange={(date) => {
                          field.onChange(date?.format("MM/DD/YYYY"));
                        }}
                      />
                    );
                  }}
                />
              )}
            </Box>,
          ],
        },
      ]}
    />
  );

  const additional_filters_section = (
    <GridSectionLayout
      headerConfig={{
        title: "Additional Filter(s)",
        title_sx: {
          fontWeight: 700,
        },
      }}
      rows={[
        {
          rowSx: {
            alignItems: "stretch",
            mb: "52px",
          },
          cellSizes: {
            xs: 12,
            sm: 4,
            lg: 4,
          },
          useCellStyling: {
            sx: {
              bgcolor: "contrasts.1",
              py: "18px",
              px: "20px",
              display: "flex",
              alignItems: "center",
            },
          },
          cells: [
            <Controller
              key={0}
              control={control}
              name={"service_providers"}
              render={({ field }) => {
                return props.defaultOptions.serviceProviders.length > 1 ? (
                  <MSBSearchMultiselect
                    selectedOptions={field.value ?? []}
                    options={props.defaultOptions.serviceProviders}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    onChange={(so) => field.onChange(so)}
                    renderOptionVariant="checkbox"
                    variant="no overflow after 1"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    label="Service Provider"
                    sx={{ width: "100%", backgroundColor: "white" }}
                    autocompleteProps={{
                      disableCloseOnSelect: true,
                      filterOptions: msbMUIAutoCompleteFilterOptions(),
                    }}
                  />
                ) : (
                  <DisabledPreselectedDropdown>
                    {`${props.defaultOptions.serviceProviders[0]?.firstName} ${props.defaultOptions.serviceProviders[0]?.lastName}`}
                  </DisabledPreselectedDropdown>
                );
              }}
            />,
            <Controller
              key={1}
              control={control}
              name={"dols"}
              render={({ field }) => {
                return props.defaultOptions.districtsOfLiability?.length > 1 ? (
                  <MSBSearchMultiselect
                    selectedOptions={field.value ?? []}
                    options={props.defaultOptions.districtsOfLiability}
                    getOptionLabel={(option) => option?.name ?? ""}
                    onChange={(so) => field.onChange(so)}
                    renderOptionVariant="checkbox"
                    variant="no overflow after 1"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    label="District Of Liability"
                    sx={{ width: "100%", backgroundColor: "white" }}
                    autocompleteProps={{
                      disableCloseOnSelect: true,
                      filterOptions: msbMUIAutoCompleteFilterOptions(),
                    }}
                  />
                ) : (
                  <DisabledPreselectedDropdown>
                    {`${props.defaultOptions.districtsOfLiability?.[0].name}`}
                  </DisabledPreselectedDropdown>
                );
              }}
            />,
            <Controller
              key={2}
              control={control}
              name={"schools"}
              render={({ field }) => {
                return (
                  <MSBSearchMultiselect
                    selectedOptions={field.value ?? []}
                    options={props.defaultOptions.campuses}
                    getOptionLabel={(option) => option?.name ?? ""}
                    onChange={(so) => field.onChange(so)}
                    renderOptionVariant="checkbox"
                    variant="no overflow after 1"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    label="School"
                    sx={{ width: "100%", backgroundColor: "white" }}
                    autocompleteProps={{
                      disableCloseOnSelect: true,
                      filterOptions: msbMUIAutoCompleteFilterOptions(),
                    }}
                  />
                );
              }}
            />,
          ],
        },
        {
          rowSx: {
            alignItems: "stretch",
          },
          cellSizes: {
            xs: 12,
            sm: 4,
            lg: 4,
          },
          useCellStyling: {
            sx: {
              bgcolor: "contrasts.1",
              py: "18px",
              display: "flex",
              alignItems: "center",
              px: "20px",
            },
          },
          cells: [
            <Controller
              key={0}
              control={control}
              name={"service_types"}
              render={({ field }) => {
                return (
                  <MSBSearchMultiselect
                    selectedOptions={field.value ?? []}
                    options={props.defaultOptions.service_types}
                    getOptionLabel={(option) => option?.name ?? ""}
                    onChange={(so) => field.onChange(so)}
                    renderOptionVariant="checkbox"
                    variant="no overflow after 1"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    label="Service Type"
                    sx={{ width: "100%", backgroundColor: "white" }}
                    autocompleteProps={{
                      disableCloseOnSelect: true,
                      filterOptions: msbMUIAutoCompleteFilterOptions(),
                    }}
                  />
                );
              }}
            />,
            <Controller
              key={1}
              control={control}
              name="provider_absent"
              render={({ field, fieldState: { error } }) => (
                // TODO: Have this MSBTypedSelect
                <XNGDropDown
                  id={"provider-absent"}
                  renderValueVariant="chip"
                  renderOptionsVariant="radio"
                  onChipDelete={() => {
                    field.onChange("");
                  }}
                  variant="onPrimary"
                  size="small"
                  ref={field.ref}
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  items={["Both", "Yes", "No"]}
                  label={"Provider Absent"}
                  fullWidth
                  maxwidth="100%"
                  useError={error?.message}
                />
              )}
            />,
            <Controller
              key={2}
              control={control}
              name="make_up_session"
              render={({ field, fieldState: { error } }) => (
                // TODO: Have this MSBTypedSelect
                <XNGDropDown
                  id={"make-up-session"}
                  renderValueVariant="chip"
                  renderOptionsVariant="radio"
                  onChipDelete={() => {
                    field.onChange("");
                  }}
                  variant="onPrimary"
                  size="small"
                  ref={field.ref}
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  items={["Both", "Yes", "No"]}
                  label={"Make Up Session"}
                  fullWidth
                  maxwidth="100%"
                  useError={error?.message}
                />
              )}
            />,
          ],
        },
        {
          rowSx: {
            mt: "3rem",
          },
          cellSizes: {
            xs: 12,
            sm: 4,
            lg: 4,
          },
          cells: [
            <></>,
            <></>,
            <Box key={0} display={"flex"} justifyContent={"flex-end"}>
              <Button
                disabled={!isValid}
                sx={{
                  width: "178px",
                  px: "2rem",
                  py: "1.5rem",
                }}
                type="submit"
              >
                Apply Filter(S)
              </Button>
            </Box>,
          ],
        },
      ]}
    />
  );

  //#endregion
  //#endregion

  //#endregion
  return (
    <Box
      sx={{
        overflowY: "auto",
      }}
    >
      <form onSubmit={handleSubmit(onSubmitFilters)}>
        <Box mb={"3rem"}>
          {session_filters_section}
          {additional_filters_section}
        </Box>
      </form>
    </Box>
  );
};

export default SessionLogsForm;
