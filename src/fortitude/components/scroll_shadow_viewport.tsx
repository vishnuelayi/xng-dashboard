import { Box, SxProps } from "@mui/system";
import { useEffect, useRef, useState } from "react";

type ShadowState = "both" | "bottom" | "top" | "none";

export default function ScrollShadowViewport(props: {
  maxHeight: string;
  children: React.ReactNode;
  sx?: SxProps;
  refreshDependencies?: any[];
}) {
  const refreshDependencies = props.refreshDependencies ?? [];

  const [shadow, setShadow] = useState<ShadowState>("both");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = () => {
    const element = containerRef.current;
    if (!element) return;

    const atTop = element.scrollTop === 0;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    const isScrollable = element.scrollHeight > element.clientHeight;

    if (atTop && isScrollable) {
      setShadow("bottom");
    } else if (atBottom && isScrollable) {
      setShadow("top");
    } else if (isScrollable) {
      setShadow("both");
    } else {
      setShadow("none");
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      handleScroll();
    }
  }, [containerRef, ...refreshDependencies]);

  const strength = 4;
  const topShadow = `inset 0 ${strength}px ${strength}px -${strength}px #0006`;
  const bottomShadow = `inset 0 -${strength}px ${strength}px -${strength}px #0006`;

  return (
    <Box
      sx={{
        maxHeight: props.maxHeight,
        overflowY: "auto",
        ...props.sx,
        boxShadow:
          shadow === "both"
            ? `${bottomShadow}, ${topShadow}`
            : shadow === "top"
            ? topShadow
            : shadow === "bottom"
            ? bottomShadow
            : "none",
      }}
      ref={containerRef}
      onScroll={handleScroll}
    >
      {props.children}
    </Box>
  );
}
