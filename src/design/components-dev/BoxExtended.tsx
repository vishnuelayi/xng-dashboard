import { Box as MUIBox, BoxTypeMap } from "@mui/system";
import { DefaultComponentProps } from "@mui/types";

// The 'name' prop does absolutely nothing. This type only exists so
// that we can optionally self document our code by naming our boxes.

type CustomBoxProps = DefaultComponentProps<BoxTypeMap> & { name?: string };
export default function Box(boxProps: CustomBoxProps) {
  return <MUIBox {...boxProps}>{boxProps.children}</MUIBox>;
}
