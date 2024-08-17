import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export default styled(Button)(({ theme }) => ({
  borderWidth: 2,
  borderColor: theme.palette.primary.main,
  "&:hover": {
    borderWidth: 2,
  },
}));
