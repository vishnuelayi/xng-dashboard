import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { XNGICONS, XNGIconRenderer } from "../../../design/icons";
import { getSizing } from "../../../design/sizing";
import usePalette from "../../../hooks/usePalette";
import XNGInput from "../../../design/low-level/input";
import XNGSwitch from "../../../design/low-level/switch";
import XNGButton from "../../../design/low-level/button";
import XNGSelect from "../../../design/low-level/dropdown";
import XNGDatePicker from "../../../design/low-level/calendar";
import Box from "../../../design/components-dev/BoxExtended";

function Iep_services() {
  const INPUT_SIZE = "large";
  const palette = usePalette();

  const [createModeMinutes, setCreateModeMinutes] = useState(false);
  const [createModeActivities, setCreateModeActivities] = useState(false);
  const [createModeAccomadations, setCreateModeAccomadations] = useState(false);
  const [createModeModifications, setCreateModeModifications] = useState(false);

  const [optionValues, setOptionValues] = useState([
    "Service 1",
    "Service 2",
    "Service 3",
    "Service 4",
    "Service 5",
    "Service 6",
  ]);
  const [select, setSelect] = useState<string>("");
  const [optionValues2, setOptionValues2] = useState(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  const [select2, setSelect2] = useState<string>("");
  const [optionValues3, setOptionValues3] = useState(["Day", "Week", "Month"]);
  const [select3, setSelect3] = useState<string>("");

  const handleSelect = (e: any) => {
    setSelect(e.target.value);
  };
  const handleSelect2 = (e: any) => {
    setSelect2(e.target.value);
  };
  const handleSelect3 = (e: any) => {
    setSelect3(e.target.value);
  };

  return (
    <div>
      <Accordion sx={{ margin: getSizing(2) }}>
        <AccordionSummary
          expandIcon={<XNGIconRenderer down i={<XNGICONS.Caret />} size="md" />}
          id="panel1a-header"
        >
          <Typography>Ordered Minutes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {createModeMinutes ? (
            <Box
              sx={{ display: "flex", marginBottom: getSizing(2), justifyContent: "space-between" }}
            >
              <Box sx={{ display: "flex" }}>
                <XNGButton
                  onClick={() => {
                    setCreateModeMinutes(!createModeMinutes);
                  }}
                >
                  Back
                </XNGButton>
              </Box>
              <Box sx={{ display: "flex" }}>
                <XNGButton onClick={() => {}}>Add Another Service</XNGButton>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <XNGButton
                onClick={() => {
                  setCreateModeMinutes(!createModeMinutes);
                }}
              >
                Create New
              </XNGButton>
            </Box>
          )}

          {createModeMinutes ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2) }}>
              <Box sx={{ display: "flex", gap: getSizing(1) }}>
                <XNGSelect
                  options={optionValues}
                  value={select}
                  handle={handleSelect}
                  title="Service Ordered"
                  size="large"
                />
              </Box>
              <Box sx={{ display: "flex", gap: getSizing(1), alignItems: "center" }}>
                <XNGInput type="number" size={INPUT_SIZE} placeholder="Minutes" />
                <XNGSelect
                  options={optionValues2}
                  value={select2}
                  handle={handleSelect2}
                  title=" "
                  size="large"
                  sx={{ minWidth: getSizing(4) }}
                />
                <Typography variant="body1">times a </Typography>
                <XNGSelect
                  options={optionValues3}
                  value={select3}
                  handle={handleSelect3}
                  title=""
                  size="large"
                />
                <XNGInput size={INPUT_SIZE} placeholder="TimesSpan" />
              </Box>
              <Box sx={{ display: "flex", gap: getSizing(1) }}>
                <XNGDatePicker title="Start Date" setValue={() => {}} />
                <XNGDatePicker title="End Date" setValue={() => {}} />
              </Box>
            </Box>
          ) : (
            <Typography variant="body1">Wait for all services to load</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ margin: getSizing(2) }}>
        <AccordionSummary
          expandIcon={<XNGIconRenderer down i={<XNGICONS.Caret />} size="md" />}
          id="panel2a-header"
        >
          <Typography>Ordered Activities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa
            sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat
            excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
            voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure
            elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis
            laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex
            in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis
            sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa
            et culpa duis.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ margin: getSizing(2) }}>
        <AccordionSummary
          expandIcon={<XNGIconRenderer down i={<XNGICONS.Caret />} size="md" />}
          id="panel3a-header"
        >
          <Typography>Ordered Accomadations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa
            sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat
            excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
            voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure
            elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis
            laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex
            in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis
            sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa
            et culpa duis.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ margin: getSizing(2) }}>
        <AccordionSummary
          expandIcon={<XNGIconRenderer down i={<XNGICONS.Caret />} size="md" />}
          id="panel4a-header"
        >
          <Typography>Ordered Modifications</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa
            sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat
            excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
            voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure
            elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis
            laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex
            in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis
            sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa
            et culpa duis.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default Iep_services;
