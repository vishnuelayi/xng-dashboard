import { Stack, Pagination } from "@mui/material";

type Props = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  showPagination: boolean;
};

const UserApprovalsPagination = (props: Props) => {
  const { totalPages, currentPage, setCurrentPage, showPagination } = props;

  return (
    <Stack alignItems={"center"} justifyContent={"center"} py={2}>
      {showPagination && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, v) => setCurrentPage(v)}
          size="large"
        />
      )}
    </Stack>
  );
};

export default UserApprovalsPagination;
