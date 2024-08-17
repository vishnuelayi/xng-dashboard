import { useState } from "react";
import MSBSearchMultiselect from "../../components/search_multiselect/search_multiselect";
import { Stack, Typography, useTheme } from "@mui/material";

type Person = {
  name: string;
  age: number;
};

const OPTIONS: Person[] = [
  { age: 23, name: "Jason" },
  { age: 34, name: "Sally" },
  { age: 28, name: "Jared" },
  { age: 21, name: "Lisa" },
];

export function SearchMultiselectDemo() {
  const [selectedOptions1, setSelectedOptions1] = useState<Person[]>([]);
  const [selectedOptions2, setSelectedOptions2] = useState<Person[]>([]);
  const [selectedOptions3, setSelectedOptions3] = useState<Person[]>([]);
  const [selectedOptions4, setSelectedOptions4] = useState<Person[]>([]);

  return (
    <Stack gap="1rem">
      <Typography>
        The MSBSearchMultiselect boilerplates an MUI multi-selectable Autocomplete, and is capable
        of being extended with programmable variants. Currently, we have two variants: 'Default' and
        'No Overflow After 1'
      </Typography>

      <PresentationVariant title="Default">
        <MSBSearchMultiselect
          options={OPTIONS}
          selectedOptions={selectedOptions1}
          getOptionLabel={(option) => option.name}
          onChange={(so) => setSelectedOptions1(so)}
        />
      </PresentationVariant>

      <PresentationVariant title="No Overflow">
        <MSBSearchMultiselect
          options={OPTIONS}
          selectedOptions={selectedOptions2}
          getOptionLabel={(option) => option.name}
          onChange={(so) => setSelectedOptions2(so)}
          variant="no overflow"
        />
      </PresentationVariant>

      <PresentationVariant title="No Overflow After 1">
        <MSBSearchMultiselect
          options={OPTIONS}
          selectedOptions={selectedOptions3}
          getOptionLabel={(option) => option.name}
          onChange={(so) => setSelectedOptions3(so)}
          variant="no overflow after 1"
        />
      </PresentationVariant>

      <PresentationVariant title="Checkbox">
        <MSBSearchMultiselect<Person>
          options={OPTIONS}
          selectedOptions={selectedOptions4}
          getOptionLabel={(option) => option.name}
          onChange={(so) => setSelectedOptions4(so)}
          renderOptionVariant="checkbox"
          variant="no overflow after 1"
        />
      </PresentationVariant>
    </Stack>
  );
}

function PresentationVariant(props: {
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  const { title, children } = props;
  const { palette } = useTheme();

  return (
    <Stack gap="1rem">
      <span>
        <Typography display="inline" variant="h6" sx={{ color: palette.text.secondary }}>
          Presentation Variant:
        </Typography>{" "}
        <Typography display="inline" variant="h6">
          {title}
        </Typography>
      </span>
      {children}
    </Stack>
  );
}
