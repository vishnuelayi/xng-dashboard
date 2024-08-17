import Navbar from "../design/high-level/navbar/Navbar";
import Box from "../design/components-dev/BoxExtended";

export function NavLayout(props: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Navbar />

      {props.children}
    </Box>
  );
}
