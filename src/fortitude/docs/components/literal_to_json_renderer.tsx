import { Box, useTheme } from "@mui/material";

function LiteralToJSONRenderer(props: { readonly literal: any }) {
  return (
    <pre>
      <code>{JSON.stringify(props.literal, undefined, 2)}</code>
    </pre>
  );
}

export default LiteralToJSONRenderer;
