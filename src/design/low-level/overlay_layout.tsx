import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

export function OverlayLayout(props: {
  readonly children: React.ReactNode;
  readonly overlayContent: React.ReactNode;
  readonly show: boolean;
}) {
  const variants = {
    hidden: { y: "calc(100vh - 30rem)", opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "inherit",
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {props.show && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {props.overlayContent}
          </motion.div>
        )}
      </AnimatePresence>

      {props.children}
    </Box>
  );
}
