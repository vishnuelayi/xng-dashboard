import { Box, Stack, Typography } from "@mui/material";
import MSBTypedSelect from "../../components/typed_select";
import { useState } from "react";
import LiteralToJSONRenderer from "../components/literal_to_json_renderer";

type Student = { name: string; age: number };
const STUDENTS: Student[] = [
  { name: "Robert", age: 8 },
  { name: "Kate", age: 12 },
  { name: "Jackson", age: 14 },
];

function TypedSelectDemo() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <Stack gap="1rem">
      <Typography>
        The typed select in Fortitude (AKA: single-select and picker) boilerplates a controlled
        select component mapped to a generic type specified by the developer.
      </Typography>

      <Stack>
        <Typography variant="h6">Required Props</Typography>
        <Box component="ul" sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <li>
            <code>options</code>{" "}
            <Typography display="inline">
              Used as the list of all selectable options. Can be a complex type.
            </Typography>
          </li>
          <li>
            <code>onChange</code>{" "}
            <Typography display="inline">
              Will return the selected value mapped to the type specified by the developer
            </Typography>
          </li>
          <li>
            <code>getDisplayValue</code>{" "}
            <Typography display="inline">
              Function used to create a string value for each option by deriving from the specified
              schema.
            </Typography>
          </li>
        </Box>
      </Stack>

      <Stack gap="1rem">
        <Typography variant="h6">Component Example</Typography>
        <MSBTypedSelect<Student>
          options={STUDENTS}
          getDisplayValue={(v) => v.name}
          onChange={(v) => {
            setSelectedStudent(v);
          }}
        />
      </Stack>

      <Stack gap="1rem">
        <Typography variant="h6">Result</Typography>
        <Typography>Selection in JSON format:</Typography>
        <LiteralToJSONRenderer literal={selectedStudent} />
      </Stack>
    </Stack>
  );
}

export default TypedSelectDemo;
