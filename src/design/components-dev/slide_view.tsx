import { SxProps } from "@mui/material";
import Box from "./BoxExtended";
import XNGBack from "../low-level/button_back";
import { getSizing } from "../sizing";
import { useRef, useState, useEffect } from "react";
import { XNGSlide } from "../types/slide";

export interface IXNGSlideView {
  slides: XNGSlide[];
  currentSlideID: number;
  onDefaultCurrentSlideID: () => void;
  width?: string;
  useBackButtons?: boolean;
}

export function XNGSlideView(props: IXNGSlideView) {
  const width = props.width ?? getSizing(45);
  const isDefault = props.currentSlideID === 0;

  const { sxLeft, sxRight } = useLocalStyleConstants(width, isDefault);

  const { defaultContent, currentContent } = useContentExtractor(
    props.slides,
    props.currentSlideID,
  );

  const { dynamicHeightPx, defaultHeightRef, contentHeightRef } = useDynamicHeight(
    isDefault,
    currentContent,
  );

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        height: dynamicHeightPx,
        transition: "height .2s ease",
      }}
    >
      <Box sx={sxLeft}>
        <div ref={defaultHeightRef}>{defaultContent}</div>
      </Box>
      <Box sx={sxRight}>
        <div ref={contentHeightRef}>
          {props.useBackButtons && (
            <Box sx={{ marginLeft: getSizing(1), width: "100%" }}>
              <XNGBack onClick={() => props.onDefaultCurrentSlideID!()} />
            </Box>
          )}
          {currentContent}
        </div>
      </Box>
    </Box>
  );
}

/// LOCAL HOOK --- LOCAL STYLE CONSTANTS ///
function useLocalStyleConstants(width: string, isDefault: boolean) {
  const sxLeft: SxProps = {
    width: width,
    transform: `translateX(-${isDefault ? "0px" : width})`,
    transition: "transform .25s ease",
    top: 0,
    left: 0,
  };
  const sxRight: SxProps = {
    width: width,
    transition: "transform .25s ease",
    position: "absolute",
    transform: `translateX(${isDefault ? width : "0px"})`,
    top: 0,
    left: 0,
  };

  return { sxLeft: sxLeft, sxRight: sxRight };
}

/// LOCAL HOOK --- HEIGHT SYSTEM ///
function useDynamicHeight(isDefault: boolean, currentContent: JSX.Element) {
  const contentHeightRef = useRef<HTMLDivElement | null>(null);
  const defaultHeightRef = useRef<HTMLDivElement | null>(null);

  const [dynamicHeightPx, setHeight] = useState<string>("0px");

  useEffect(() => {
    if (isDefault) {
      setHeight(defaultHeightRef.current?.clientHeight + "px");
    } else {
      setHeight(contentHeightRef.current?.clientHeight + "px");
    }
  }, [currentContent]);

  return {
    dynamicHeightPx,
    defaultHeightRef,
    contentHeightRef,
  };
}

/// LOCAL HOOK --- GET CONTENT FROM PROPS ///
function useContentExtractor(slides: XNGSlide[], currentSlideID: number) {
  const defaultContent = slides[0].content;

  // Cache the last non-zero currentSlideID values, so the visual can remain on-screen
  const [slideIDNonZero, setSlideIDNonZero] = useState<number>(1);
  useEffect(() => {
    if (currentSlideID !== 0) setSlideIDNonZero(currentSlideID);
  }, [currentSlideID]);

  const currentContent = slides.find((s: XNGSlide) => s.id === slideIDNonZero)!.content;

  return { defaultContent, currentContent };
}
