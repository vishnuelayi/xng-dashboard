import { Box, Button, Typography } from "@mui/material";
import { GetGoalAreasOfFocusResponse, Goal, StudentResponse } from "../../../../../../profile-sdk";
import XNGInput2 from "../../../../../../design/low-level/input_2";
import XNGDropDown from "../../../../../../design/low-level/dropdown2";
import { XNGDateField } from "../../../../../unposted_sessions/components/common/date_field";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { API_STATESNAPSHOTS } from "../../../../../../api/api";
import dayjs from "dayjs";
import GoalInfoTabHeader from "./goal_info_tab_header";
import produce from "immer";
import GoalFromType, { schema } from "../../../types/goal_objective_tab_form_schema_type";
import GridSectionLayout from "../../../../../../design/high-level/common/grid_section_layout";

type Props = {
  edited_student: StudentResponse;
  selected_goal: Goal;
  onGoalSaved: (
    updated_student: StudentResponse,
    current_student: StudentResponse,
  ) => Promise<boolean>;
  onBackBtnClick: () => void;
};

/**
 * Component responsible for creating and editing goals.
 */
const GoalCreateEditView = (props: Props) => {
  //#region DROPDOWN OPTIONS
  const [goal_area_of_focus_options, set_goal_area_of_focus_options] =
    React.useState<GetGoalAreasOfFocusResponse>();
  //#endregion

  //#region HOOKFORM
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { isValid, errors, isDirty },
    reset,
  } = useForm<GoalFromType>({
    resolver: yupResolver(schema),
    defaultValues: {
      goal: {
        number: props.selected_goal?.number || "",
        description: props.selected_goal?.description || "",
        goal_area_of_focus: props.selected_goal?.goalAreaOfFocus || undefined,
        start_date: props.selected_goal?.startDate || undefined,
        end_date: props.selected_goal?.endDate || undefined,
        status: props.selected_goal?.status || "",
      },
      objectives:
        props.selected_goal?.objectives && props.selected_goal.objectives.length > 0
          ? props.selected_goal?.objectives
          : [
              {
                number: "",
                description: "",
              },
            ],
    },
  });
  //#endregion

  //#region FORM STATES
  const objectives_inputs = watch("objectives");
  const is_form_valid = isValid;
  const form_edited = isDirty;
  const [saving_goal, set_saving_goal] = React.useState<boolean>(false); // state for saving goal progress
  //#endregion

  //#region METHODS
  /**
   * Handles the submission of a goal.
   *
   * @param data - The goal data to be submitted.
   * @returns Promise<void>
   */
  const onSumbitGoal = async (data: GoalFromType) => {
    set_saving_goal(true); // This sets the state variable saving_goal to true, indicating that the goal progress is being saved.

    const new_goal = produce(props.selected_goal, (draft) => {
      draft.number = data.goal.number;
      draft.description = data.goal.description;
      draft.status = data.goal.status;
      draft.startDate = data.goal.start_date;
      draft.endDate = data.goal.end_date;
      draft.goalAreaOfFocus = data.goal.goal_area_of_focus;
      draft.objectives = data.objectives?.filter((obj) => !!obj.number && !!obj.description);
    });
    const new_edited_student = produce(props.edited_student, (draft) => {
      if (
        draft.spedDossier &&
        draft.spedDossier?.prescribedCareProvisionsLedger &&
        draft.spedDossier?.prescribedCareProvisionsLedger?.goals
      ) {
        const goal_index = draft.spedDossier?.prescribedCareProvisionsLedger?.goals?.findIndex(
          (g) => g.internalId === new_goal.internalId,
        );
        if (goal_index !== -1) {
          draft.spedDossier.prescribedCareProvisionsLedger.goals[goal_index] = new_goal;
        } else if (JSON.stringify(props.selected_goal) === "{}") {
          draft.spedDossier?.prescribedCareProvisionsLedger?.goals.push(new_goal);
        }
      }
    });
    /* 
    This calls the onGoalSaved function from the props object, passing the new_edited_student and props.edited_student objects as parameters. 
    It awaits the result of the function call and assigns it to the saved_data variable.
    */
    const saved_data = await props.onGoalSaved(new_edited_student, props.edited_student);
    set_saving_goal(false);
    if (saved_data) {
      reset(data);
    } else {
      // handle error
    }
  };

  //#endregion

  //#region SIDE EFFECTS
  // strictly for fetching goal area of focus options
  React.useEffect(() => {
    const fetch = async () => {
      const aof = await API_STATESNAPSHOTS.v1StateSnapshotsGoalAreasOfFocusGet("TX");
      set_goal_area_of_focus_options(aof);
      // console.log("aof", aof)
    };
    fetch();
  }, []);
  //#endregion

  //#region UI COMPONENTS
  const goals_form = (
    <GridSectionLayout
      headerConfig={{
        title: "Goal Information",
      }}
      divider
      fullWidth
      rows={[
        {
          cells: [
            <XNGInput2
              type={"text"}
              label="Goal Number"
              id={"goal-number-id"}
              {...register("goal.number")}
              useError={errors?.goal?.number?.message}
              fullWidth
            />,
            <Controller
              control={control}
              name="goal.status"
              render={({ field }) => {
                return (
                  <XNGDropDown
                    id={"x-logs-status"}
                    items={["Active", "Inactive"]}
                    label={"Goal Status"}
                    ref={field.ref}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    value={field.value}
                    fullWidth
                    enableButtomMargin
                    maxwidth="100%"
                    useError={errors?.goal?.status?.message}
                  />
                );
              }}
            />,
            <Controller
              control={control}
              name="goal.goal_area_of_focus"
              render={({ field }) => {
                return (
                  <XNGDropDown
                    id={"x-logs-status"}
                    label={"Goal Area Of Focus"}
                    useTypedDropDown={{
                      defaultValue: field.value,
                      value: field.value,
                      items:
                        (goal_area_of_focus_options?.areasOfFocus as GoalFromType["goal"]["goal_area_of_focus"][]) ||
                        [],
                      getRenderedValue: (item) => item?.name || "",
                      onChange: (item) => {
                        field.onChange(item);
                      },
                    }}
                    fullWidth
                    enableButtomMargin
                    maxwidth="100%"
                    useError={errors?.goal?.goal_area_of_focus?.message}
                  />
                );
              }}
            />,
          ],
        },
        {
          useCellStyling: {
            sx: {
              mb: "1rem",
            },
          },
          cells: [
            <Controller
              control={control}
              name="goal.start_date"
              render={({ field }) => {
                return (
                  <XNGDateField
                    label={"Start Date"}
                    value={field.value ? dayjs(new Date(field.value).toDateString()) : null}
                    onChange={field.onChange}
                    fullWidth
                    useError={errors?.goal?.start_date?.message}
                  />
                );
              }}
            />,
            <Controller
              control={control}
              name="goal.end_date"
              render={({ field }) => {
                return (
                  <XNGDateField
                    label={"End Date"}
                    value={field.value ? dayjs(new Date(field.value).toDateString()) : null}
                    onChange={field.onChange}
                    fullWidth
                    useError={errors?.goal?.end_date?.message}
                  />
                );
              }}
            />,
          ],
        },
        {
          // fullwidth: true,
          cellSizes: {
            lg: 9,
            sm: 12,
            xs: 12,
          },

          cells: [
            <XNGInput2
              type={"text"}
              label="Measurable Annual Goal Text"
              id={"measurable-annual-goal-id"}
              {...register("goal.description")}
              // useError={errors?.firstName?.message}
              fullWidth
              multiline
              rows={10}
              useError={errors?.goal?.description?.message}
            />,
          ],
        },
      ]}
    />
  );

  const objectives_form = (
    <GridSectionLayout
      headerConfig={{
        titleOverride: (
          <Typography variant="h6">
            {"Objective Information"} |{" "}
            <Box component={"span"} color={"primary.main"}>
              Total: {objectives_inputs?.length}
            </Box>
          </Typography>
        ),
      }}
      fullWidth
      rows={[
        ...(objectives_inputs
          ?.map((_, index) => {
            return [
              {
                cells: [
                  <XNGInput2
                    type={"text"}
                    label="Objective Number"
                    id={"objective-number-id"}
                    {...register(`objectives.${index}.number`)}
                    // useError={errors?.firstName?.message}
                    fullWidth
                  />,
                ],
              },
              {
                cellSizes: {
                  lg: 9,
                  sm: 12,
                  xs: 12,
                },
                cells: [
                  <XNGInput2
                    type={"text"}
                    label="Objective Text"
                    id={"objective-text-id"}
                    {...register(`objectives.${index}.description`)}
                    // useError={errors?.firstName?.message}
                    fullWidth
                    multiline
                    rows={10}
                  />,
                ],
              },
            ];
          })
          .flat() || []),
        {
          useCellStyling: {
            sx: {
              mb: "3rem",
            },
          },
          cells: [
            <Button
              sx={{ py: "1.5rem" }}
              disabled={!objectives_inputs?.every((obj) => !!obj.number && !!obj.description)}
              onClick={() => {
                if (objectives_inputs) {
                  setValue("objectives", [
                    ...objectives_inputs,
                    {
                      number: "",
                      description: "",
                    },
                  ]);
                }
              }}
            >
              Add Another Objective
            </Button>,
          ],
        },
      ]}
    />
  );
  //#endregion

  return (
    <Box width={"100%"}>
      <form onSubmit={handleSubmit(onSumbitGoal)}>
        <GoalInfoTabHeader
          justifify_content="space-between"
          use_back_btn={{
            onClick: props.onBackBtnClick,
          }}
          use_save_btn={{
            disabled: !is_form_valid || !form_edited || saving_goal,
            label: saving_goal ? "Saving..." : "Save Goal/Observation",
          }}
        />
        {goals_form}
        {objectives_form}
      </form>
    </Box>
  );
};

export default GoalCreateEditView;
