import {
  Box,
  Divider,
  Stack,
  Typography,
  GridProps,
  FormHelperText,
  TypographyProps,
  Button,
  ButtonProps,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { CSSProperties } from "react";

type Props = {
  headerConfig: {
    title?: string;
    titleOverride?: React.ReactNode;
    headerContent?: React.ReactNode;
    headerStartContent?: React.ReactNode;
    showDivider?: boolean;
    title_sx?: TypographyProps["sx"];
    useHeaderButton?: {
      label: string;
      disabled?: boolean;
      sx?: ButtonProps["sx"];
      onClick?: (() => void) | undefined;
    };
  };
  maxHeight?: CSSProperties["maxHeight"];
  maxWidth?: CSSProperties["maxWidth"];
  fullWidth?: boolean;
  bottomMargin?: CSSProperties["marginBottom"];
  useError?: string;
  divider?: boolean;
  rows?: {
    fullwidth?: boolean;
    cellSizes?: {
      xs: number;
      sm: number;
      lg: number;
    };
    rowSx?: GridProps["sx"];
    cells: (
      | React.ReactNode
      | {
          sx?: GridProps["sx"];
          content: React.ReactNode;
        }
    )[];
    useCellStyling?: {
      indexes?: number[] | number; //index of the cell to apply the styling to
      sx: GridProps["sx"];
    };
  }[];
};

//A layout component that organizes content in a grid.
const GridSectionLayout = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref?: React.Ref<HTMLDivElement>) => {
    return (
      <Box
        mb={props.bottomMargin ?? 2}
        maxWidth={props.maxWidth ?? "1425px"}
        ref={ref}
        sx={{
          width: props.fullWidth ? "100%" : "auto",
        }}
      >
        <Grid container spacing={2} width={"95%"}>
          <Grid xs={12}>
            <Stack direction={"row"}>
              <Box
                sx={{
                  marginRight: !!props.headerConfig.headerStartContent ? "10px" : 0,
                }}
              >
                {props.headerConfig.headerStartContent}
              </Box>
              <Stack
                mb={props.headerConfig.showDivider ? 0 : 2}
                sx={{
                  width: "100%",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {/* Render the title */}
                {props.headerConfig.titleOverride ? (
                  props.headerConfig.titleOverride
                ) : (
                  <Typography
                    component={"h3"}
                    fontSize={"20px"}
                    position={"relative"}
                    sx={props.headerConfig.title_sx}
                  >
                    {/* Render the header content */}

                    {props.headerConfig.title}
                    <FormHelperText
                      component={"span"}
                      error={!!props.useError}
                      sx={{ position: "absolute", bottom: -15, left: 1, whiteSpace: "nowrap" }}
                    >
                      {props.useError}
                    </FormHelperText>
                  </Typography>
                )}

                {/* Render the header content */}
                <Box flexGrow={1}>{props.headerConfig.headerContent}</Box>
                {props.headerConfig.useHeaderButton && (
                  <Button
                    disabled={props.headerConfig.useHeaderButton.disabled}
                    onClick={props.headerConfig.useHeaderButton.onClick}
                    sx={props.headerConfig.useHeaderButton.sx}
                  >
                    {props.headerConfig.useHeaderButton.label}
                  </Button>
                )}
              </Stack>
            </Stack>
            {props.headerConfig.showDivider && <Divider sx={{ mt: 1, mb: 1.5 }} />}
          </Grid>
        </Grid>
        {/* content */}
        <Box
          maxHeight={props.maxHeight}
          // maxWidth={"1425px"}
          sx={{ overflowY: props.maxHeight ? "auto" : "visible", width: "100%" }}
        >
          {/* Render the rows */}
          {props.rows?.map((row, i) => (
            <Grid key={i} container spacing={2} width={"95%"} sx={row.rowSx}>
              {/* Render the cells in each row */}
              {row.cells.map((item, index) => {
                let cell_content: React.ReactNode = undefined;
                let cell_style: GridProps["sx"] | undefined = undefined;
                const row_style =
                  row.useCellStyling && !row.useCellStyling?.indexes
                    ? row.useCellStyling.sx
                    : (
                        typeof row.useCellStyling?.indexes === "number"
                          ? row.useCellStyling?.indexes === index
                          : row.useCellStyling?.indexes?.indexOf?.(index) ?? -2 > -1
                      )
                    ? row.useCellStyling?.sx
                    : {};
                if (item && typeof item === "object" && "content" in item) {
                  cell_content = item.content;
                  cell_style = item.sx;
                } else {
                  cell_content = item;
                }
                // console.log("cell_style", cell_style);
                // console.log("row.useCellStyling?.indexes", row.useCellStyling?.sx);
                const cell_sx = { ...row_style, ...cell_style };
                return (
                  item && (
                    <Grid
                      key={index}
                      xs={row.fullwidth ? 12 : row.cellSizes?.xs ?? 12}
                      sm={row.fullwidth ? 12 : row.cellSizes?.sm ?? 4}
                      lg={row.fullwidth ? 12 : row.cellSizes?.lg ?? 3}
                      sx={cell_sx}
                    >
                      {/* Render the content of each cell */}
                      {cell_content}
                    </Grid>
                  )
                );
              })}
            </Grid>
          ))}
          {props.divider && <Divider sx={{ mt: 4 }} />}
        </Box>
      </Box>
    );
  },
);

export default GridSectionLayout;
