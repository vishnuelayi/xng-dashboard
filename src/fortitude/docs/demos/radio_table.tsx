import { Alert, Divider, Stack, Typography } from "@mui/material";
import MSBRadioTable from "../../components/radio_table";
import { MOCK_TABLE_ROWS, StudentMergeExampleModel } from "../mocks/table";
import { useState } from "react";
import LiteralToJSONRenderer from "../components/literal_to_json_renderer";

function RadioTableDemo() {
  const [radioSelection, setRadioSelection] = useState<StudentMergeExampleModel | null>(null);

  const rows = MOCK_TABLE_ROWS.slice(0, 3);

  return (
    <Stack sx={{ minWidth: "100%" }} gap="1rem">
      <Typography>
        The Radio Table will dynamically boilerplate an MUI table. It accepts a list of rows as a
        prop and will return the user's selection as type <code>T</code> for each{" "}
        <code>onChange</code> callback.
      </Typography>
      <Typography>
        <strong>Shortcomings:</strong> This component's state is uncontrolled by design for
        developer ease-of-use, so dynamic actions like resetting the user's selection are outside of
        the current component's capabilities. If we dynamic actions are truly needed, we should
        build a separate, controlled version of this component.
      </Typography>

      <Stack gap="1rem">
        <Divider />
        <Typography variant="h6">Component Example</Typography>

        <Alert severity="warning">
          <Typography>
            <strong>Attention:</strong> These are fake students, no real student data is shown below.
          </Typography>
        </Alert>

        <MSBRadioTable
          rows={rows}
          columns={[
            { key: "lastNameFirstName", title: "Student" },
            { key: "studentID", title: "Student ID" },
          ]}
          onChange={(v) => setRadioSelection(v)}
        />
      </Stack>

      <Stack gap="1rem">
        <Divider />
        <Typography variant="h6">Result</Typography>
        <Typography>Selected student in raw JSON format:</Typography>
        <LiteralToJSONRenderer literal={radioSelection} />
      </Stack>
    </Stack>
  );
}

export default RadioTableDemo;
