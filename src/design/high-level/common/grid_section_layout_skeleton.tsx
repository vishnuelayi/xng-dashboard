import { Box, Skeleton, SkeletonOwnProps } from "@mui/material";
import React from "react";
import GridSectionLayout from "./grid_section_layout";

type Props = {
  header_props?: SkeletonOwnProps;
  content_props?: SkeletonOwnProps;

  sections: {
    header_props?: SkeletonOwnProps;
    content_props?: SkeletonOwnProps;
    divider?: boolean;
    num_rows: number;
    num_cells: number;
    cell_sizes?: {
      xs: number;
      sm: number;
      lg: number;
    };
  }[];
};

const GridSectionLayoutSkeleton = (props: Props) => {
  const skeletonheaderprops: SkeletonOwnProps = {
    sx: { fontSize: "1rem", animationDuration: "0.75s" },
    variant: "rectangular",
    height: "30px",
    width: "100px",
  };

  const skeletoncontentprops: SkeletonOwnProps = {
    sx: { fontSize: "1rem", animationDuration: "0.75s" },
    variant: "rectangular",
    height: "40px",
    width: "100%",
  };

  return (
    <Box>
      {/* <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Skeleton {...{ skeletonheaderprops, width: "100px", height: "40px" }} />
          </Box> */}
      {props.sections.map((section, i) => {
        const header_props = {
          ...{ ...skeletonheaderprops, ...(section.header_props || props.header_props) },
        };
        return (
          <GridSectionLayout
            key={i}
            headerConfig={{
              titleOverride: <Skeleton {...header_props} />,
            }}
            divider={section.divider}
            rows={Array.from({ length: section.num_rows }).map(() => {
              const content_props = {
                ...{ ...skeletoncontentprops, ...(section.content_props || props.content_props) },
              };
              return {
                //   cellSizes:{...(section.cell_sizes || {xs: 12, sm: 12, lg: 12})},
                ...{ cellSizes: section.cell_sizes },
                cells: Array.from({ length: section.num_cells }).map(() => (
                  <Skeleton {...content_props} />
                )),
              };
            })}
          />
        );
      })}
    </Box>
  );
};

export default GridSectionLayoutSkeleton;
