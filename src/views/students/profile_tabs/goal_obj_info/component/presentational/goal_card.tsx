import { Box, Divider, Typography } from "@mui/material";
import React from "react";
import { Goal } from "../../../../../../profile-sdk";
import dayjs from "dayjs";

type Props = {
  goal: Goal;
  OnClick?: (goal: Goal) => void;
};

const GoalCard = (props: Props) => {
  const { goal } = props;

  const CardTitledSection = (comp_props: { title: string; content: string }) => {
    return (
      <Box>
        <Typography fontWeight={700} color={"primary"}>
          {comp_props.title}
        </Typography>
        <Typography>{comp_props.content}</Typography>
      </Box>
    );
  };

  /**
   * Calculates the percentage of time elapsed between a start date and an end date.
   * @param startDate The start date of the goal.
   * @param endDate The end date of the goal.
   * @returns The percentage of time elapsed between the start date and the current date, clamped between 0 and 100.
   */
  const getGoalPercentage = (startDate: Date, endDate: Date) => {
    const today = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = today.getTime() - startDate.getTime();
    const percentage = (elapsedDuration / totalDuration) * 100;
    return Math.min(Math.max(Math.round(percentage), 0), 100);
  };

  const goal_duration =
    props.goal.startDate && props.goal.endDate
      ? `${getGoalPercentage(new Date(props.goal.startDate), new Date(props.goal.endDate))}%`
      : undefined;

  return (
    <Box
      sx={{
        maxWidth: "285px",
        minWidth: "285px",
        p: "1.3rem",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: "3px",
        borderColor: "#E6E6E6",
        transition: "all .09s ease-in-out",
        cursor: "pointer",
        ":hover": {
          transform: "scale(1.02)",
          borderWidth: "2px",
        },
      }}
      onClick={() => {
        if (props.OnClick) {
          props.OnClick(goal);
        }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: "1rem",
        }}
      >
        <CardTitledSection title={"Goal ID"} content={goal?.number || "N/A"} />
        <CardTitledSection
          title={"Objectives"}
          content={goal.objectives?.length.toString() || "N/A"}
        />
      </Box>
      <Box
        sx={{
          mb: "1rem",
          minHeight: "200px",
          maxHeight: "220px",
          overflowY: "auto",
        }}
      >
        <Typography width={"99%"}>{goal.description}</Typography>
      </Box>
      <Divider sx={{ borderColor: "#757575", borderWidth: "1px", mb: "1rem" }} />
      <Box>
        <Box mb={"1rem"}>
          <CardTitledSection
            title={"Goal Duration"}
            content={`${dayjs(goal?.startDate).format("MM/DD/YYYY")} - ${dayjs(
              goal?.endDate,
            ).format("MM/DD/YYYY")}`}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Box bgcolor={"#4B4B4B33"} flexGrow={1}>
            <Box
              sx={{
                width: goal_duration ?? "10%",
                bgcolor: "#3FA65E",
                py: "2px",
              }}
            ></Box>
          </Box>
          <Typography>{goal_duration ?? "NAN"}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GoalCard;
