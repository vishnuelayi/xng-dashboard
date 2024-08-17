import { render, screen } from "@testing-library/react";
import PostedSessionsTabToolbar, {
  StaffDirectoryPostedSessionsTabToolbarProps,
} from "./posted_sessions_tab_toolbar";
import { TestProviders } from "../../../../../../../setupTests";
import { act } from "react-dom/test-utils";
import dayjs from "dayjs";

describe("PostedSessionsTabToolbar", () => {
  //helper function to setup tests
  const setupTests = (props?: {
    filters: StaffDirectoryPostedSessionsTabToolbarProps["filters"];
  }) => {
    const mockOnApplyFilters = jest.fn();

    render(
      <PostedSessionsTabToolbar onApplyFilters={mockOnApplyFilters} filters={props?.filters} />,
      {
        wrapper: TestProviders,
      },
    );

    return { mockOnApplyFilters };
  };

  it("should render the toolbar correctly", () => {
    setupTests();

    const applyFiltersButton = screen.getByRole("button", { name: /apply filters/i }); // get and assert the apply filters button

    // Assert that the toolbar elements are rendered correctly
    expect(screen.getByLabelText("posted-sessions-tab-toolbar")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
    expect(applyFiltersButton).toBeDisabled();
    expect(screen.getByRole("button", { name: /export excel/i })).toBeInTheDocument();
  });

  it("should not enable or click apply Filters button when start date and end date are not selected", () => {
    const { mockOnApplyFilters } = setupTests();

    const applyFiltersButton = screen.getByRole("button", { name: /apply filters/i }); // get and assert the apply filters button
    // Act: click the apply filters button
    act(() => {
      applyFiltersButton.click();
    });

    // Assert that the onApplyFilters function is called
    expect(mockOnApplyFilters).not.toHaveBeenCalled();
  });

  it("should enable and click apply Filters button when start date and end date are selected", () => {
    const { mockOnApplyFilters } = setupTests({
      filters: {
        startDate: dayjs(),
        endDate: dayjs().add(1, "day"),
      },
    });

    const applyFiltersButton = screen.getByRole("button", { name: /apply filters/i }); // get and assert the apply filters button
    // Act: click the apply filters button
    act(() => {
      applyFiltersButton.click();
    });

    // Assert that the onApplyFilters function is called
    expect(mockOnApplyFilters).toHaveBeenCalled();
  });
});
