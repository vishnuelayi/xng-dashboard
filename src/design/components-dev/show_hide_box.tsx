import Box from "./BoxExtended";

function ShowHideBox(props: { if: boolean; show: JSX.Element }): JSX.Element {
  return <Box sx={{ display: props.if ? "block" : "none" }}>{props.show}</Box>;
}

export default ShowHideBox;
