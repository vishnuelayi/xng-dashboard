import { Box, Skeleton, SkeletonOwnProps } from "@mui/material";
import GridSectionLayout from "../../../../../../../design/high-level/common/grid_section_layout";

const SkeletonTabContent = () => {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Skeleton {...{ skeletonheaderprops, width: "100px", height: "40px" }} />
      </Box>
      {Array.from({ length: 4 }).map((_, i) => (
        <GridSectionLayout
          key={i}
          headerConfig={{
            titleOverride: <Skeleton {...skeletonheaderprops} />,
          }}
          divider
          rows={[
            {
              cells: [
                <Skeleton {...skeletoncontentprops} />,
                <Skeleton {...skeletoncontentprops} />,
                <Skeleton {...skeletoncontentprops} />,
              ],
            },
            {
              cells: [
                <Skeleton {...skeletoncontentprops} />,
                <Skeleton {...skeletoncontentprops} />,
                <Skeleton {...skeletoncontentprops} />,
              ],
            },
            {
              cells: [
                <Skeleton {...skeletoncontentprops} />,
                <Skeleton {...skeletoncontentprops} />,
                <Skeleton {...skeletoncontentprops} />,
              ],
            },
          ]}
        />
      ))}
    </Box>
  );
};

export default SkeletonTabContent;
