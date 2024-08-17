import { Stack, Typography } from "@mui/material";
import MSBSearch from "../../components/search";
import { useEffect, useState } from "react";
import { Results } from "../components/results";

function SearchDemo() {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <Stack gap="1rem">
      <Typography>
        Boilerplates an MUI TextField component with a style that's consistent with our wireframed
        search components. It accepts basic MUI TextFieldProps and spreads this as final props to
        the rendered TextField, allowing full uninhibited usage as a TextField.
      </Typography>

      <MSBSearch value={value} onChange={(e) => setValue(e.target.value)} />

      <Results isShown={value.length > 0} isLoading={isLoading} />
    </Stack>
  );
}

export default SearchDemo;
