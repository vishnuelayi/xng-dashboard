import Box from "../../../design/components-dev/BoxExtended";
import { Divider, Typography } from "@mui/material";
import { SingleActionModal } from "../../../design/modal_templates/single_action";
import { useState } from "react";
import { useNotatorTools } from "../tools";

// This is purely a presentational, or "dumb" component. This is not to house any sort of logic. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

export function TabInnerViewportLayout(props: {
  children: React.ReactNode;
  title: string;
  useLink?: { text: string; onClick: () => void };
  useComingSoonLink?: { text: string };
  isAllStudentView?: boolean;
}) {
  const [comingSoonModal, setComingSoonModal] = useState<boolean>(false);
  const { readOnly } = useNotatorTools();

  return (
    <>
      {!props.isAllStudentView ? (
        <>
          <SingleActionModal
            open={comingSoonModal}
            onClose={() => setComingSoonModal(false)}
            useTemplate="coming soon"
          />

          <Box sx={{ height: "2.5rem", display: "flex", alignItems: "center", mt: "1rem" }}>
            <Typography mr="1rem" className="noselect" variant="h6">
              {props.title}
            </Typography>

            {props.useLink && !readOnly && (
              <a onClick={() => props.useLink!.onClick()} target="#">
                {props.useLink!.text}
              </a>
            )}

            {props.useComingSoonLink && (
              <a onClick={() => setComingSoonModal(true)} target="#">
                {props.useComingSoonLink!.text}
              </a>
            )}
          </Box>
          <Divider sx={{ my: "0.8rem" }} />

          {props.children}
        </>
      ) : (
        <>
          {props.useLink && props.title.includes("Goals") && !readOnly && (
            <Box sx={{ height: "2.5rem", display: "flex", alignItems: "center", mt: "1rem" }}>
              <a onClick={() => props.useLink!.onClick()} target="#">
                {props.useLink!.text}
              </a>
            </Box>
          )}
          {props.children}
        </>
      )}
    </>
  );
}

// This is purely a presentational, or "dumb" component. This is not to house any sort of logic. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

export function TabInnerViewportLayoutTwoTitles(props: {
  children: React.ReactNode;
  titleLeft: string;
  titleRight: string;
  isAllStudentView?: boolean;
  isMobile?: boolean;
}) {
  const [comingSoonModal, setComingSoonModal] = useState<boolean>(false);

  return (
    <>
      {props.isMobile ? (
        <>
          <SingleActionModal
            open={comingSoonModal}
            onClose={() => setComingSoonModal(false)}
            useTemplate="coming soon"
          />
          <Box
            sx={{
              display: "flex",
              gap: "2.5rem",
              mt: "1rem",
              mb: "0.8rem",
              pr: "2.5rem",
            }}
          >
            {!props.isAllStudentView && <FlexChildHeader title={props.titleLeft} />}
          </Box>
          {props.children}
        </>
      ) : (
        <>
          <SingleActionModal
            open={comingSoonModal}
            onClose={() => setComingSoonModal(false)}
            useTemplate="coming soon"
          />

          <Box
            sx={{
              display: "flex",
              gap: "2.5rem",
              mt: "1rem",
              mb: "0.8rem",
              pr: "2.5rem",
            }}
          >
            {!props.isAllStudentView && <FlexChildHeader title={props.titleLeft} />}
            {!props.isAllStudentView && <FlexChildHeader title={props.titleRight} />}
          </Box>

          {props.children}
        </>
      )}
    </>
  );
}

function FlexChildHeader(props: { title: string }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          height: "2.5rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography mr="1rem" className="noselect" variant="h6">
          {props.title}
        </Typography>
      </Box>
      <Divider sx={{ my: "0.8rem" }} />
    </Box>
  );
}
