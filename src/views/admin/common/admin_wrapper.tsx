import { Box } from "@mui/material";
import { ADMIN_VISUAL_STANDARD_SPACING } from "../constants/spacing";

export default function AdminLayout(props: { readonly children: React.ReactNode }) {
  return <Box sx={{ p: ADMIN_VISUAL_STANDARD_SPACING, pb: 0 }}>{props.children}</Box>;
}
