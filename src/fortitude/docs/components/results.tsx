import { Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";

export function Results(props: {
  readonly isShown?: boolean;
  readonly isLoading?: boolean;
  readonly count?: number;
}) {
  const isLoading = props.isLoading ?? false;
  const isShown = props.isShown ?? true;
  const count = props.count ?? 5;

  return (
    <Stack gap="1rem">
      {isShown && (
        <>{isLoading ? <SkeletonResults count={count} /> : <MockResults count={count} />}</>
      )}
    </Stack>
  );
}

function SkeletonResults(props: { readonly count: number }) {
  const items: JSX.Element[] = [];

  for (let i = 0; i < props.count; i++) {
    items.push(<Skeleton variant="rectangular" height="3rem" />);
  }

  return <>{items}</>;
}

function MockResults(props: { readonly count: number }) {
  const { palette } = useTheme();
  const results: JSX.Element[] = [];

  for (let i = 0; i < props.count; i++) {
    results.push(
      <Box
        className="noselect"
        key={i}
        sx={{
          height: "3rem",
          display: "flex",
          alignItems: "center",
          pl: "1rem",
          border: "1px dashed " + palette.grey[400],
          borderRadius: "4px",
        }}
      >
        <Typography sx={{ color: palette.grey[400] }}>(Result {i})</Typography>
      </Box>,
    );
  }

  return <>{results}</>;
}
