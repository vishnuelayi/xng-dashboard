import Box from "../../../design/components-dev/BoxExtended";
import useBreakpointHelper from "../../../design/hooks/use_breakpoint_helper";
import { getSizing } from "../../../design/sizing";

// This is purely a presentational, or "dumb" component. This is not to house any sort of logic. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

// This grid is configurable between column-major and column-minor styles, read here:
// https://en.wikipedia.org/wiki/Row-_and_column-major_order

export default function CareProvisionGridLayout(props: { children: React.ReactNode }) {
  const bph = useBreakpointHelper();
  const columns = bph.isGreaterThanEqualTo("md") ? 2 : 1;

  return (
    <Box
      pb={getSizing(10)}
      sx={{
        // --- Use Row-Major Grid ---
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "4px",
        maxWidth: getSizing(120),

        // --- Use Column-Major Grid ---
        // columnCount: columns,
      }}
    >
      {props.children}
    </Box>
  );
}
