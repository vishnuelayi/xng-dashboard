/**
 * Renders a grid or list view of goals.
 * This component is responsible for rendering goals in either a grid with cards or a list in a table.
 * @component
 * @param {Object} props - The component props.
 * @param {Goal[]} props.goals - The array of goals to be rendered.
 * @param {Function} [props.onGoalCardClick] - The callback function triggered when a goal card is clicked.
 * @returns {JSX.Element} The rendered component.
 */
import { Goal } from "../../../../../../profile-sdk";
import GoalCard from "./goal_card";

type Props = {
  goals: Goal[];
  onGoalCardClick?: (goal: Goal) => void;
};

const GoalGridListView = (props: Props) => {
  return (
    <>
      {props.goals.map((goal, index) => {
        return (
          <GoalCard
            key={index}
            goal={goal}
            OnClick={() => {
              if (props.onGoalCardClick) {
                props.onGoalCardClick(goal);
              }
            }}
          />
        );
      })}
    </>
  );
};

export default GoalGridListView;
