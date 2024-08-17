import {
  Card,
  CardActions,
  Checkbox,
  CardActionArea,
  Typography,
  Divider,
  Box,
  styled,
  TypographyTypeMap,
} from "@mui/material";
import XNGProgress from "../../../design/low-level/progress";
import React from "react";
import { GoalRef } from "../../../session-sdk";
import { Goal } from "../../../profile-sdk";

type Props = {
  goal: Goal;
  goalSelectState: {
    checked: (goal: GoalRef) => boolean;
    onSelect: (goal: GoalRef) => void;
  };
};

export const GoalCard = ({ goal, goalSelectState }: Props) => {
  const cardTitleProps = {
    component: "h4",
    fontWeight: "700",
    color: "primary",
  };
  const goalRef = { goalNumberFromVendor: goal.number, description: goal.description } as GoalRef;
  return (
    <Card
      sx={{
        paddingInline: "1.4rem",
        paddingBlock: "1rem",
        width: "295px",
        // marginInline: "auto",
        border: "0.8px solid rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardActions sx={{ padding: 0, height: "fit-content" }}>
        <Checkbox
          size="small"
          sx={{ marginLeft: "auto", marginBottom: "-10px" }}
          checked={goalSelectState.checked(goalRef)}
          onClick={() => goalSelectState.onSelect(goalRef)}
        />
      </CardActions>
      <CardActionArea onClick={() => goalSelectState.onSelect(goalRef)}>
        {/* SECTIION 1 */}
        <Box display={"flex"} mb={"1rem"}>
          <Box flexGrow={1}>
            <Typography {...cardTitleProps}>Goal ID</Typography>
            <Typography>{goal.number}</Typography>
          </Box>
          <Box flexGrow={1}>
            <Typography {...cardTitleProps}>Objectives</Typography>
            <Typography>{goal.objectives?.length}</Typography>
          </Box>
        </Box>
        {/* SECTION 2  */}
        <Box
          height={"14rem"}
          mb={"2px"}
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Typography variant="body1">{goal.description}</Typography>
        </Box>
        {/* SECTION 3 */}
        <Box marginBottom={"1rem"}>
          <Divider
            sx={{
              borderWidth: "1px",
              borderColor: "rgba(0, 0, 0, 0.50)",
              marginBottom: "1rem",
            }}
          />
          <Typography {...cardTitleProps}>Goal Duration</Typography>
          <Typography fontSize={"0.8rem"} mb={"1rem"}>
            {new Date(goal.startDate || Date.now()).toDateString()} -{" "}
            {new Date(goal.endDate || Date.now()).toDateString()}
          </Typography>

          <XNGProgress progress={50} />
        </Box>
      </CardActionArea>
    </Card>
  );
};
