/// ---------------- FOR EXAMPLE USAGE, UNCOMMENT BELOW. Please re-comment when done! ---------------- ///
// import { useEffect, useState } from "react";
// import { TableRequestParameters } from "../../types";

export type ExampleRow = {
  campusName: string;
  stateID: string;
  address: string;
  contact: string;
  contactRole: string;
  contactEmail: string;
};

export type FetchedTableResponse = {
  totalCount: number;
  fetchedRows: ExampleRow[];
};

/// ---------------- FOR EXAMPLE USAGE, UNCOMMENT BELOW. Please re-comment when done! ---------------- ///

// function generateDummyRows(): ExampleRow[] {
//   const dummyRows: ExampleRow[] = [];
//   const campusNames = [
//     "Green Valley High",
//     "Riverside Elementary",
//     "Maplewood Academy",
//     "Lakeside Middle School",
//     "Sunnydale School",
//     "Pinecrest Institute",
//     "Harborview School",
//     "Westbrook High",
//     "Springfield Elementary",
//     "Hilltop Academy",
//   ];
//   const states = ["TX", "CO", "CA", "NY", "FL", "IL", "PA", "OH", "MI", "WA"];
//   const roles = ["Principal", "Vice Principal", "Administrator", "Counselor", "Coordinator"];

//   for (let i = 0; i < 60; i++) {
//     const campus = campusNames[Math.floor(Math.random() * campusNames.length)];
//     const state = states[Math.floor(Math.random() * states.length)];
//     const addressNumber = Math.floor(Math.random() * 900) + 100;
//     const addressStreet = ["Main St", "Park Ave", "Cedar Rd", "Oak St", "2nd Ave"][
//       Math.floor(Math.random() * 5)
//     ];
//     const city = ["Austin", "Denver", "Los Angeles", "New York", "Miami"][
//       Math.floor(Math.random() * 5)
//     ];
//     const zipCode = Math.floor(Math.random() * 90000) + 10000;
//     const address = `${addressNumber} ${addressStreet}, ${city}, ${state}, ${zipCode}`;

//     const firstName = ["John", "Jane", "Mike", "Sara", "Chris"][Math.floor(Math.random() * 5)];
//     const lastName = ["Smith", "Johnson", "Williams", "Brown", "Jones"][
//       Math.floor(Math.random() * 5)
//     ];
//     const contact = `${firstName} ${lastName}`;
//     const role = roles[Math.floor(Math.random() * roles.length)];
//     const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${campus
//       .replace(/\s+/g, "")
//       .toLowerCase()}.edu`;

//     dummyRows.push({
//       campusName: campus,
//       stateID: state,
//       address: address,
//       contact: contact,
//       contactRole: role,
//       contactEmail: email,
//     });
//   }

//   return dummyRows;
// }

// export const DUMMY_ROWS = generateDummyRows();

// export const exampleRowsAPI = {
//   getTableResponse: (props: {
//     tableRequestParameters: TableRequestParameters<ExampleRow>;
//   }): FetchedTableResponse => {
//     const { resultsPerPage, pageIndex, sortBy } = props.tableRequestParameters;

//     const sliceStartIndex = resultsPerPage * pageIndex;
//     const sliceEndIndex = sliceStartIndex + resultsPerPage;
//     const dataset = DUMMY_ROWS.slice(sliceStartIndex, sliceEndIndex);

//     return { fetchedRows: dataset, totalCount: DUMMY_ROWS.length };
//   },
// };

// export function useFetchTable(): {
//   table: FetchedTableResponse | null;
//   refetch: (trp: TableRequestParameters<ExampleRow>) => void;
// } {
//   function refetch(tableRequestParameters: TableRequestParameters<ExampleRow>) {
//     const res = exampleRowsAPI.getTableResponse({ tableRequestParameters });
//     setTable(res);
//   }

//   const [table, setTable] = useState<FetchedTableResponse | null>(null);

//   useEffect(() => {
//     refetch({ resultsPerPage: 50, pageIndex: 0, sortBy: null });
//   }, []);

//   return { table, refetch };
// }
