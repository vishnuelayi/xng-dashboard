import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { XNGICONS, XNGIconRenderer } from "../../../../../design";
import { SessionResponse } from "../../../../../session-sdk";
import { EditDraftFunctionType } from "../../../tools/types";

export function CareProvisionAccordion(props: {
  index: number;
  expanded: boolean;
  children?: React.ReactNode;
  header: string;
  handleProvisionAccordionExpansion: (index: string) => void;
  draftSession: SessionResponse;
  editDraftSession: EditDraftFunctionType;
  selectedProvisions?: number;
}) {
  return (
    <Accordion
      disableGutters
      expanded={props.expanded}
      onChange={() => props.handleProvisionAccordionExpansion(props.header)}
      sx={{
        mb: 2,
        border: "unset",
        boxShadow: "none",
        "&::before": {
          display: "none",
        },
      }}
      key={props.index}
    >
      <AccordionSummary>
        <Typography sx={{ color: "#206A7E", display: "flex" }}>
          {props.header}
          &nbsp;
          {props.selectedProvisions && props.selectedProvisions > 0
            ? `(${props.selectedProvisions})`
            : null}
          &nbsp;
          {props.expanded ? (
            <XNGIconRenderer up color="#206A7E" i={<XNGICONS.Caret />} size="sm" />
          ) : (
            <XNGIconRenderer down color="#206A7E" i={<XNGICONS.Caret />} size="sm" />
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  );
}
