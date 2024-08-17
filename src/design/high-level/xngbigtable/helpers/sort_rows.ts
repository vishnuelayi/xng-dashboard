import { XNGBigTableSortSetting } from "../types";

// sortBy: {key: "firstName", order: "ascending"} = sort by first name ascending
// sortBy: {key: "lastName", order: "descending"} = sort by last name descending
// sortBy: null = do not sort (default)

export default function sortRows<T>(props: {
  rows: T[];
  sortBy: XNGBigTableSortSetting<T>;
}): T[] {
  const { rows, sortBy } = props;

  // Check if sortState is null, return rows as is
  if (!sortBy) {
    return rows;
  }

  const { key, order } = sortBy;

  const sortedRows = [...rows];

  sortedRows.sort((a, b) => {
    if (a[key] < b[key]) {
      return order === "descending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return order === "descending" ? 1 : -1;
    }
    return 0;
  });

  return sortedRows;
}
