import { Stack, Box } from "@mui/material";
import React from "react";
import ArrowIconBtn from "./arrow_icon_btn";

type Props = {
  items: React.ReactNode[];
  maxheight?: boolean;
};

const SlideShow = (props: Props) => {
  const scrollPanelRef = React.useRef<HTMLUListElement>(null);

  const onScroll = (dir: "left" | "right") => {
    if (scrollPanelRef.current) {
      scrollPanelRef.current.scroll({
        left:
          scrollPanelRef.current.scrollLeft +
          (dir === "left" ? -1 : 1) *
            (scrollPanelRef.current.offsetWidth as number),
        behavior: "smooth",
      });
    }
  };
  return (
    <Box height={props.maxheight ? "100%" : "auto"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        sx={{
          // backgroundColor: "violet",
          position: "absolute",
          width: "100%",
          right: 0,
          top: 90,
          py: 3,
          px: 0.5,
          zIndex: 1,
          display: {
            display: "flex",
            md: "none",
          },
          pointerEvents: "none",
        }}
      >
        <ArrowIconBtn
          iconDir="left"
          onClick={() => {
            onScroll("left");
          }}
        />
        <ArrowIconBtn
          iconDir="right"
          onClick={() => {
            onScroll("right");
          }}
        />
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"start"}
        alignItems={"flex-start"}
        component={"ul"}
        position={"relative"}
        // bgcolor={palette.primary[2]}
        ref={scrollPanelRef}
        sx={{
          height: "96%",
          gap: 5,
          overflowY: "hidden",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
        }}
      >
        {props.items.map((item, i) => (
          <Box
            component={"li"}
            key={i}
            sx={{
              display: "flex",
              width: "fit-content",
              // width: "300px",
              height: "100%",
              overflowY: "hidden",
              // backgroundColor:"wheat",
              flexShrink: 0,
              scrollSnapAlign: "center",
            }}
          >
            {item}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default SlideShow;
