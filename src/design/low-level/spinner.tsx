import usePalette from "../../hooks/usePalette";
import Box from "../components-dev/BoxExtended";

function XNGSpinner(props: { fullPage?: boolean }) {
  const palette = usePalette();

  return (
    <Box
      sx={{
        ".lds-roller div:after": { bgcolor: palette.primary[2] + "!important" },
        ...(props.fullPage
          ? {
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }
          : {}),
      }}
    >
      <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Box>
  );
}

export default XNGSpinner;
