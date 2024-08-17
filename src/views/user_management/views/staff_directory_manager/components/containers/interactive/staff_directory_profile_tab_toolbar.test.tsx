import { render, screen } from "@testing-library/react";
import StaffDirectoryProfileTabToolbar from "./staff_directory_profile_tab_toolbar";
import { act } from "react-dom/test-utils";

describe("StaffDirectoryProfileTabToolbar", () => {
  it("should render toolbar with activated button and submit button type by default", () => {
    render(<StaffDirectoryProfileTabToolbar />);

    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeEnabled();
    expect(saveButton).toHaveAttribute("type", "submit");
  });

  it("should render toolbar with button disabled button with along with button attribute", async () => {
    const onClick = jest.fn();
    render(<StaffDirectoryProfileTabToolbar type="button" onClick={onClick} disabled={true} />);

    const saveButton = screen.getByRole("button", { name: /save/i });

    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveAttribute("type", "button");
  });

  it("should call onClick callback when button is clicked", async () => {
    const onClick = jest.fn();
    render(<StaffDirectoryProfileTabToolbar onClick={onClick} />);

    const saveButton = screen.getByRole("button", { name: /save/i });

    await act(async () => {
      saveButton.click();
    });

    expect(onClick).toHaveBeenCalled();
  });
});
