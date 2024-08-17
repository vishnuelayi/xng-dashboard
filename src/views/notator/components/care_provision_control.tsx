import { BORDER_RADIUSES } from "../../../design/borderRadiuses";
import Box from "../../../design/components-dev/BoxExtended";
import XNGToggleGroup from "../../../design/low-level/button_togglegroup";
import { getSizing } from "../../../design/sizing";
import usePalette from "../../../hooks/usePalette";
import { Typography, TextField, Tooltip } from "@mui/material";
import { OtherStatus } from "../types/care_provision";
import { XNGICONS, XNGIconRenderer } from "../../../design/icons";
import { XNGStandardTab } from "../../../design/types/xngStandardTab";
import { XNGCheckbox } from "../../../design";
import { useNotatorTools } from "../tools";

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

export default function CareProvisionControl(props: {
  increments: number;
  label: string;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  useDeleteButton?: {
    onDelete: () => void;
  };
}) {
  const palette = usePalette();
  const { readOnly } = useNotatorTools();
  const marginsPx = "0px";

  function getOptions(): XNGStandardTab[] {
    const defaultOptions = [
      { onClick: () => props.onDecrement(), label: "-" },
      { label: props.increments.toString(), unclickable: true },
      { onClick: () => props.onIncrement(), label: "+" },
    ];

    const defaultOptionsWithDelete: XNGStandardTab[] = [
      {
        onClick: () => props.useDeleteButton?.onDelete(),
        label: <XNGIconRenderer color={palette.contrasts[5]} i={<XNGICONS.Close />} size="12px" />,
        sx: {
          bgcolor: palette.danger[2],
          ":hover": { bgcolor: palette.danger[2] },
          ":active": { bgcolor: palette.danger[2] },
        },
      },
      ...defaultOptions,
    ];

    return props.useDeleteButton ? defaultOptionsWithDelete : defaultOptions;
  }

  return (
    <Box
      onClick={() => props.onToggle()}
      sx={{
        "#show": {
          display: "none",
        },
        "#hide": {
          display: "inline",
        },
        ":hover": {
          bgcolor: readOnly ? "inherit" : palette.contrasts[4],
          cursor: readOnly ? "default" : "pointer",
          "#show": {
            display: "flex",
          },
          "#hide": {
            display: readOnly ? "inline" : "none",
          },
        },
        minHeight: getSizing(5),
        position: "relative",
        alignItems: "center",
        borderRadius: BORDER_RADIUSES[0],
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
        }}
      >
        <XNGCheckbox checked={props.increments > 0} onToggle={() => {}} disabled={readOnly} />
        <Box sx={{ minHeight: "min-content", py: "8px" }}>
          <Typography display="inline" sx={{ color: readOnly ? "grey" : "inherit" }}>
            {props.label}
          </Typography>
          {props.increments > 1 ? (
            <Typography
              display="inline"
              id="hide"
              sx={{ color: readOnly ? "grey" : palette.primary[2], display: "inline" }}
            >{` | ${props.increments} times`}</Typography>
          ) : (
            <></>
          )}
        </Box>
        {readOnly || (
          <Box
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="noselect"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              right: marginsPx,
              bottom: marginsPx,
            }}
            id="show"
          >
            {/* {props.useDeleteButton && <XNGClose sx={{ mr: marginsPx }} onClick={() => {}} />} */}

            <XNGToggleGroup options={getOptions()} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

export function UnsavedCustomCareProvisionControl(props: {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onToggle: () => void;
  increments: number;
  status: OtherStatus;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <XNGCheckbox checked={props.increments > 0} onToggle={() => props.onToggle()} />
      <Tooltip
        open={props.status.userFeedback !== ""}
        title={props.status.userFeedback}
        placement="bottom"
      >
        <TextField
          fullWidth
          error={props.status.unsaveable}
          onBlur={(e) => props.onBlur(e)}
          size="small"
          onChange={(e) => props.onChange(e)}
          value={props.name}
        />
      </Tooltip>
    </Box>
  );
}
