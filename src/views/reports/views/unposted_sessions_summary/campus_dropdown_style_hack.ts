/**
  Hack: To keep the UI from fidgeting, we'll enforce some values. We may consider
  making this style code a part of the MSBSearchMultiselect itself if we encounter
  this again.
*/
export const campusDropdownStyleHack = {
  ".MuiInputBase-sizeSmall": { pt: "5px!important" },
  ".MuiInputBase-root": {
    minHeight: "2.3rem",
    maxHeight: "2.3rem",
  },
};
