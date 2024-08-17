import { render, screen } from "@testing-library/react";
import PostedSessionsTabTable from "./posted_sessions_tab_table";
import { SessionCountReportDisplayTableRow } from "@xng/reporting";

describe("PostedSessionsTabTable", () => {
  it("should render no data message when table rows is empty", () => {
    const emptyTableRegex = /No Posted Sessions Data found/i;
    render(<PostedSessionsTabTable rows={[]} columnDef={[]} />);

    expect(screen.getByText(emptyTableRegex)).toBeInTheDocument();
  });

  it("should render table rows when rows are passed in as props", () => {
    const rowsProp: SessionCountReportDisplayTableRow[] = [
      {
        id: "1",
        serviceId: "1",
        campus: "campus",
        postedCount: 1,
      },
    ];

    render(
      <PostedSessionsTabTable
        rows={rowsProp}
        columnDef={[
          {
            field: "campus",
            headerName: "Campus",
          },
          {
            field: "postedCount",
            headerName: "Posted Count",
          },
        ]}
      />,
    );

    const tableRows = rowsProp.map((row, i) => ({ i, ...row }));

    tableRows.forEach((row) => {
      expect(screen.getByText(row.campus!)).toBeInTheDocument();
      expect(screen.getByText(row.postedCount!.toString())).toBeInTheDocument();
    });
  });
});
