import XNGDateRange from "../../../../../design/low-level/daterange";
import { PlanOfCare } from "../../../../../profile-sdk";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";

// PLANS OF DATE RANGE COMPONENT, BUILT FOR THE PURPOSE OF MODULARITY
const PlansOfCareDateRange = (props: {
  label: string;
  index: number;
  planOfCare: PlanOfCare;
  setPlansOfCare: React.Dispatch<React.SetStateAction<PlanOfCare[] | null>>;
}) => {
  return (
    <XNGDateRange
      useStartDate={{
        setValue: (date) => {
          // console.log((date as Dayjs).toDate())
          props.setPlansOfCare((prev) => {
            const override = [...prev!];
            override[props.index].startDate = (date as Dayjs).toDate();
            return override;
          });
        },
        defaultValue: props.planOfCare.startDate ? dayjs(props.planOfCare.startDate) : undefined,
        label: `${props.label} Start Date`,
        title: props.label,
        size: "large",
      }}
      useEndDate={{
        setValue: (date) => {
          props.setPlansOfCare((prev) => {
            const override = [...prev!];
            override[props.index].endDate = (date as Dayjs).toDate();
            return override;
          });
        },
        defaultValue: props.planOfCare.endDate ? dayjs(props.planOfCare.endDate) : undefined,
        label: `${props.label} End Date`,
        title: props.label,
        size: "large",
      }}
    />
  );
};

export default PlansOfCareDateRange;
