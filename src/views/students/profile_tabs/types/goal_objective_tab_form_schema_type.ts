import * as yup from "yup";

const goal_objective_schema = yup.object().shape({
    number: yup.string(),
    description: yup.string(),
  });
  
  const schema = yup.object().shape({
    goal: yup.object().shape({
      number: yup.string().required("Goal number is required"),
    description: yup.string().required("Goal description is required"),
    status: yup.string().required("Goal status is required"),
    start_date: yup.date().required("Goal start date is required"),
    end_date: yup.date().required("Goal end date is required"),
    goal_area_of_focus: yup.object().shape({
      id: yup.string().required("Goal area of focus is required"),
      name: yup.string().required("Goal area of focus is required"),
    }),
    }),
    objectives: yup.array().of(goal_objective_schema),
  });

  
  type GoalFromType = yup.InferType<typeof schema>;
 
  export {schema};
  export default GoalFromType;