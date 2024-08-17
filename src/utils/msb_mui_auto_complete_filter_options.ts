import { CreateFilterOptionsConfig, createFilterOptions } from "@mui/material";

function msbMUIAutoCompleteFilterOptions<T>(options?: CreateFilterOptionsConfig<T>) {
    return createFilterOptions<T>(options ?? { limit: 500 }); //defaults to a limit of 500 if no options are provided
}

export default msbMUIAutoCompleteFilterOptions;