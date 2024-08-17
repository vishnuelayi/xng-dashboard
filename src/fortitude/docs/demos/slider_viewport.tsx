import { Pagination, Paper, Stack, Switch, Typography } from "@mui/material";
import MSBSliderViewport, { MSBSlide } from "../../components/slider_viewport";
import { useState } from "react";

function SliderViewportDemo() {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(false);

  return (
    <Stack gap="1rem">
      <Typography>
        The MSBSliderViewport is an easy and intuitive solution for creating animated sliding pages.
        Its usage is visible on the Campus Management screen.
      </Typography>

      <Typography variant="h6" className="noselect">
        Component Example
      </Typography>
      <Stack alignItems="center" gap="1rem">
        <Paper>
          <MSBSliderViewport selectedSlideIndex={selectedSlideIndex}>
            <MSBSlide>
              <Stack p="2rem">
                <Typography variant="h6">Slide 1</Typography>
                <Typography>Welcome to slide 1!</Typography>
              </Stack>
            </MSBSlide>
            <MSBSlide>
              <Stack p="2rem">
                <Typography variant="h6">Slide 2</Typography>
                <Typography>Welcome to slide 2!</Typography>
              </Stack>
            </MSBSlide>
            <MSBSlide>
              <Stack p="2rem">
                <Typography variant="h6">Slide 3</Typography>
                <Typography>Welcome to slide 3!</Typography>
              </Stack>
            </MSBSlide>
          </MSBSliderViewport>
        </Paper>
        <Pagination
          page={selectedSlideIndex + 1}
          count={3}
          onChange={(e, v) => setSelectedSlideIndex(v - 1)}
        />
      </Stack>

      <Typography variant="h6" className="noselect">
        2-Screen Example
      </Typography>
      <Stack alignItems="center" gap="1rem">
        <Paper>
          <MSBSliderViewport selectedSlideIndex={isSwitchOn ? 1 : 0}>
            <MSBSlide>
              <Stack p="2rem">
                <Typography variant="h6">Slide 1</Typography>
                <Typography>Welcome to slide 1!</Typography>
              </Stack>
            </MSBSlide>
            <MSBSlide>
              <Stack p="2rem">
                <Typography variant="h6">Slide 2</Typography>
                <Typography>Welcome to slide 2!</Typography>
              </Stack>
            </MSBSlide>
          </MSBSliderViewport>
        </Paper>
        <Switch value={isSwitchOn} onChange={(e, v) => setIsSwitchOn(v)} />
      </Stack>
    </Stack>
  );
}

export default SliderViewportDemo;
