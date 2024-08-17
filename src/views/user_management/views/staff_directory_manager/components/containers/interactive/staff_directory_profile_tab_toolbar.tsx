import { Button, ButtonProps, Stack } from "@mui/material";

type Props = {
  type?: ButtonProps["type"];
  onClick?: ButtonProps["onClick"];
  disabled?: boolean;
};

const StaffDirectoryProfileTabToolbar = (props: Props) => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"flex-end"}
      sx={{
        height: "1px",
        marginBottom: {
          xs: "2rem",
          sm: 0,
        },
      }}
    >
      {
        <Button
          sx={{ width: "115px" }}
          onClick={props.onClick}
          type={props.type ?? "submit"}
          disabled={props.disabled}
        >
          Save
        </Button>
      }
    </Stack>
  );
};

export default StaffDirectoryProfileTabToolbar;
