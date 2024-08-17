import dayjs from "dayjs";
import GridSectionLayout from "../../../../design/high-level/common/grid_section_layout";
import XNGSmartTable from "../../../../design/high-level/common/xng_smart_table";
import React from "react";
import { SessionLogsSummaryDataRow } from "@xng/reporting";

type Props = {
  layout: {
    onGenerateReportBtnClick: () => void;
    generateReportBtnDisabled: boolean;
  };
  table: {
    rows: SessionLogsSummaryDataRow[];
    default_selected_rows: SessionLogsSummaryDataRow[];
    onRowsSelected: (selectedRows: SessionLogsSummaryDataRow[]) => void;
    data_loading: boolean;
  };
};

/**
 * Renders a summary of session logs.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {React.Ref<HTMLDivElement>} ref - The ref for the component.
 * @returns {JSX.Element} The rendered SessionLogsSummary component.
 */
const SessionLogsSummary = React.forwardRef<HTMLDivElement, Props>(
  (props: Props, ref?: React.Ref<HTMLDivElement>) => {
    return (
      <GridSectionLayout
        ref={ref}
        headerConfig={{
          title: "Summary",
          title_sx: {
            fontWeight: 700,
          },
          useHeaderButton: {
            label: "Generate Report",
            disabled: props.layout.generateReportBtnDisabled,
            sx: {
              // width:"178px",
              px: "2rem",
              py: "1.5rem",
            },
            onClick: props.layout.onGenerateReportBtnClick,
          },
        }}
        bottomMargin={"10rem"}
        rows={[
          {
            fullwidth: true,
            cells: [
              <XNGSmartTable
                key={0}
                columnsConfig={{
                  columns: [
                    {
                      key: "firstName",
                      headerName: "First Name",
                    },
                    {
                      key: "lastName",
                      headerName: "Last Name",
                    },
                    {
                      key: "studentId",
                      headerName: "Student ID",
                    },
                    {
                      key: "dateOfBirth",
                      headerName: "Birth Date",
                      useOverride: {
                        overrideCell(row) {
                          return dayjs(row.dateOfBirth).format("MM/DD/YYYY");
                        },
                      },
                      convertToExpectedType(value) {
                        return dayjs(value.dateOfBirth).unix();
                      },
                    },
                    {
                      key: "numberOfSessions",
                      headerName: "Number of Sessions",
                      convertToExpectedType(value) {
                        return Number(value.numberOfSessions);
                      },
                    },
                    {
                      key: "gradeLevel",
                      headerName: "Grade",
                      // disableSort: true,
                      convertToExpectedType: (value) => Number(value.gradeLevel),
                    },
                  ],
                }}
                useSort={{}}
                rowsConfig={{
                  rows: props.table.rows,
                  useSelectableRows: {
                    compareFunction(row1, row2) {
                      return (
                        row1.id === row2.id &&
                        row1.firstName === row2.firstName &&
                        row1.lastName === row2.lastName &&
                        row1.studentId === row2.studentId &&
                        row1.dateOfBirth === row2.dateOfBirth &&
                        row1.numberOfSessions === row2.numberOfSessions &&
                        row1.gradeLevel === row2.gradeLevel
                      );
                    },
                    defaultSelectedRows: props.table.default_selected_rows,
                    onRowSelected: props.table.onRowsSelected,
                  },
                }}
                usePagination={{}}
                useTableLoading={{
                  isloading: props.table.data_loading,
                  disableInteractivity: true,
                  showSkeleton: true,
                }}
                emptyTableText="No records found"
              />,
            ],
          },
        ]}
      />
    );
  },
);

export default SessionLogsSummary;
