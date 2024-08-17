import { Button } from "@mui/material";
import usePalette from "../../hooks/usePalette";

interface IXNGHyperlink {
  children: React.ReactNode;
  onClick: () => void;
  width?: string;
  color?: string;
}
function XNGHyperlink(props: IXNGHyperlink) {
  const palette = usePalette();

  return (
    <Button
      variant="text"
      sx={{
        width: props.width || "min-content",
        textDecoration: "underline",
        color: props.color || palette.primary[2],
        cursor: "pointer",
      }}
      onClick={() => props.onClick()}
      className="noselect"
    >
      {props.children}
    </Button>
  );
}

export default XNGHyperlink;
