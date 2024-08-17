import { useState } from "react";
import { RESULTS_PER_PAGE_OPTIONS } from "../constants/results_per_page_options";
import { PaginationState } from "../types";

export default function useXNGBigTablePaginationStateManager<T>(props: {
  totalCount: number;
}): PaginationState {
  const { totalCount } = props;

  const [resultsPerPage, setResultsPerPage] = useState<number>(RESULTS_PER_PAGE_OPTIONS[0]);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const totalPages = Math.ceil(totalCount / resultsPerPage);

  const isViewingAll = resultsPerPage > totalCount;

  const paginationState: PaginationState = {
    pageIndex,
    resultsPerPage,
    totalCount,
    totalPages,
    isViewingAll,
    onCurrentPageIndexChange: (v: number) => {
      setPageIndex(v);
    },
    onPageSizeChange: (v: number) => {
      setResultsPerPage(v);
    },
  };

  return paginationState;
}
