import { Stack, Typography } from "@mui/material";
import MSBScrollShadowViewport from "../../components/scroll_shadow_viewport";
import { Results } from "../components/results";

function ScrollShadowViewportDemo() {
  return (
    <Stack gap="1rem">
      <Typography>
        The scroll shadow viewport provides a dynamically rendered shadow indicating that scrollable
        content is present within a viewport. It's recommended to use this in tandem with relative
        height <br /> (I.E: <code>calc(100vh - 25rem)</code>)
      </Typography>

      <MSBScrollShadowViewport maxHeight="calc(100vh - 25rem)" sx={{ minHeight: "10rem" }}>
        <Results count={15} />
      </MSBScrollShadowViewport>
    </Stack>
  );
}

export default ScrollShadowViewportDemo;
