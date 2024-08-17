import { Button, ButtonProps } from "@mui/material";

/**
 * A button component that navigates to the unposted sessions page when clicked.
 */

type Props = {
  icon?: React.ReactNode;
  onClick?: ButtonProps["onClick"];
  start?: boolean;
  end?: boolean;
  label: string;
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  size?: ButtonProps["size"];
};

const ArrowLabelBtn = (props: Props) => {
  return (
    <Button
      startIcon={props.start && props.icon}
      endIcon={props.end && props.icon}
      onClick={props.onClick}
      variant={props.variant}
      color={props.color}
      size={props.size}
    >
      {props.label}
    </Button>
  );
};

export default ArrowLabelBtn;
