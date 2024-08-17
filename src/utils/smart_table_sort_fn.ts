import TableSortDirection from "../design/types/table_sort_directions";
import { quickSortInPlace } from "./quick_sort_in_place";

export default function smartTableSortFn<T>(
  arr: T[],
  direction: TableSortDirection,
  algorithm: "default" | "quick_sort",
  objectInfo?: {
    columnKey?: string;
    convertToExpectedType?: (value: T) => any;
    overrideSortComparator?: (a: T, b: T) => 1 | 0 | -1;
  },
) {
  switch (algorithm) {
    case "quick_sort":
      return quickSortInPlace(arr || [], 0, arr.length - 1, (a: T, b: T) => {
        return smartTableCompareFn(a, b, direction, objectInfo);
      });
    default:
      return (
        arr?.sort((a, b) => {
          return smartTableCompareFn(a, b, direction, objectInfo);
        }) || []
      );
  }
}

function smartTableCompareFn<T>(
  a: T,
  b: T,
  direction: TableSortDirection,
  objectInfo?: {
    columnKey?: string;
    convertToExpectedType?: (value: T) => any;
    overrideSortComparator?: (a: T, b: T) => 1 | 0 | -1;
  },
) {
  if (direction === "asc") {
    if (objectInfo?.overrideSortComparator) return objectInfo.overrideSortComparator(a, b);
    else {
      const columnValueA = objectInfo?.convertToExpectedType
        ? objectInfo?.convertToExpectedType(a)
        : objectInfo
        ? a[objectInfo.columnKey as keyof typeof a]
        : a;
      const columnValueB = objectInfo?.convertToExpectedType
        ? objectInfo?.convertToExpectedType(b)
        : objectInfo
        ? b[objectInfo.columnKey as keyof typeof b]
        : b;

      if (columnValueA < columnValueB) return -1;
      else if (columnValueA > columnValueB) return 1;
      else return 0;
    }
  } else {
    if (objectInfo?.overrideSortComparator) return objectInfo.overrideSortComparator(b, a);
    else {
      const columnValueA = objectInfo?.convertToExpectedType
        ? objectInfo?.convertToExpectedType(a)
        : objectInfo
        ? a[objectInfo.columnKey as keyof typeof a]
        : a;
      const columnValueB = objectInfo?.convertToExpectedType
        ? objectInfo?.convertToExpectedType(b)
        : objectInfo
        ? b[objectInfo.columnKey as keyof typeof b]
        : b;

      if (columnValueA < columnValueB) return 1;
      else if (columnValueA > columnValueB) return -1;
      else return 0;
    }
  }
}
