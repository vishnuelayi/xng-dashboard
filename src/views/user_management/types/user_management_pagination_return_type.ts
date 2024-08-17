type UserManagementPaginationReturnType<T> = {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  paginatedItems: T[] | undefined;
  currentPage: number;
  totalPages: number;
  showPagination: boolean;
};

export default UserManagementPaginationReturnType;
