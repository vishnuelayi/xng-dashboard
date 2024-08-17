import { useCallback, useEffect, useState } from "react";
import { SessionResponse } from "../../../session-sdk";
import { FutureTabs } from "../types/types";
import Box from "../../../design/components-dev/BoxExtended";
import { getSizing } from "../../../design/sizing";
import XNGCheckbox from "../../../design/low-level/checkbox";
import XNGInput from "../../../design/low-level/input";
import { TabInnerViewportLayoutTwoTitles } from "../layouts/inner_viewport_headers";
import { EditDraftFunctionType } from "../tools/types";
import useBreakpointHelper from "../../../design/hooks/use_breakpoint_helper";
import { Divider, TextField, Typography } from "@mui/material";
import { useNotatorTools } from "../tools";
import { produce } from "immer";

// This is purely a presentational, or "dumb" component. This is not to house any of its own state. It should only ever provide callbacks.
// See more:
// https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
// https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43

export default function ObservationsTabView(
  props: Readonly<{
    applyFuture: Array<FutureTabs[]>;
    setApplyFuture: React.Dispatch<React.SetStateAction<Array<FutureTabs[]>>>;
    editSession: EditDraftFunctionType;
    selectedStudentIndex: number;
    editedSession: SessionResponse;
    isAllStudentView?: boolean;
  }>,
) {
  const isMobile = useBreakpointHelper().isMobile;
  const { readOnly } = useNotatorTools();

  const choiceEndPoint: string[] =
    props.editedSession.studentJournalList![props.selectedStudentIndex].observationSection
      ?.observations!;

  // There is no schema to save `Other` check and its text so just implemented like `[!]Other:[<text>]`
  // ! means unchecked with text
  const otherObservation = choiceEndPoint.find(
    (ob) => ob.startsWith("Other:") || ob.startsWith("!Other:"),
  );

  const Choices = [
    "Cooperative",
    "Uncooperative",
    "Responsive",
    "Unresponsive",
    "Disruptive",
    "Other",
  ];
  const [toggleVal, setToggleVal] = useState<boolean>(false);
  const [indexer, setIndexer] = useState<number>(0);
  const [clickable, setClickable] = useState<boolean>(false);
  // --------- STATES DEDICATED TO CONTROLLED COMPONENT IMPLEMENTATIONS BELOW ---------
  const [studentNotes, setStudentNotes] = useState<string>(
    props.editedSession.studentJournalList![props.selectedStudentIndex].observationSection
      ?.narrative ?? " ",
  );

  // Toggle check of `Other` observation
  const toggleOtherObservation = (otherObservation: string) =>
    otherObservation.startsWith("Other:") ? `!${otherObservation}` : otherObservation.slice(1);

  // Get the `Other` observation with updated text
  const getUpdatedOtherObservation = (otherObservation: string, text: string) =>
    `${otherObservation.split("Other:")[0]}Other:${text}`;

  // Get the text of `Other` observation
  const getOtherObservationText = (otherObservation: string) =>
    otherObservation?.split("Other:")[1];

  useEffect(() => {
    if (props.editedSession.status === 4 || props.editedSession.status === 5) {
      setClickable(true);
    } else {
      setClickable(false);
    }
  }, [props.editedSession.status]);

  function handleToggle() {
    let change = props.applyFuture;
    change[props.selectedStudentIndex][indexer].include = !toggleVal;
    setToggleVal(!toggleVal);
    props.setApplyFuture([...change]);
  }
  // On student index change...
  useEffect(() => {
    if (
      props.applyFuture[props.selectedStudentIndex]?.findIndex(
        (section) => section.section === 6,
      ) != -1 &&
      props.applyFuture[props.selectedStudentIndex] &&
      props.applyFuture[props.selectedStudentIndex][indexer]
    ) {
      setIndexer(
        props.applyFuture[props.selectedStudentIndex].findIndex((section) => section.section === 6),
      );
      setToggleVal(props.applyFuture[props.selectedStudentIndex][indexer]?.include);
    }

    // Reset student notes
    if (studentNotes !== "") {
      setStudentNotes(
        props.editedSession.studentJournalList![props.selectedStudentIndex].observationSection
          ?.narrative ?? " ",
      );
    }
  }, [props.selectedStudentIndex]);

  const { setDraftSession, selectedStudentIndex } = useNotatorTools();

  /**
   * Like some of the other code in this file, the why behind what's happening here
   * is unclear. We may want to refactor this screen when we get a chance.
   */
  const getNewOtherValue = useCallback(
    (newValue: string) => {
      return otherObservation
        ? [
            ...choiceEndPoint.filter((ob) => ob !== otherObservation),
            getUpdatedOtherObservation(otherObservation, newValue),
          ]
        : [...choiceEndPoint, `!Other:${newValue}`];
    },
    [otherObservation, choiceEndPoint, getUpdatedOtherObservation],
  );

  return (
    <TabInnerViewportLayoutTwoTitles
      titleLeft="Student Observations"
      titleRight="Student Notes"
      isAllStudentView={props.isAllStudentView}
      isMobile={isMobile}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: getSizing(5),
          paddingTop: !isMobile ? getSizing(3) : 0,
          paddingBottom: getSizing(4),
          ...(clickable === true && { pointerEvents: "none" }),
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            float: "left",
            width: isMobile ? "100%" : "50%",
            gap: getSizing(3),
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: getSizing(3),
              paddingTop: !isMobile ? getSizing(3) : 0,
            }}
          >
            {Choices.map((observation, i) => (
              <Box
                key={`${props.selectedStudentIndex}-${i}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: getSizing(1),
                }}
              >
                {observation !== "Other" ? (
                  <>
                    <XNGCheckbox
                      checked={choiceEndPoint.includes(observation)}
                      onToggle={() =>
                        props.editSession(
                          `studentJournalList.${props.selectedStudentIndex}.observationSection.observations`,
                          choiceEndPoint.includes(observation)
                            ? choiceEndPoint.filter((ob) => ob !== observation)
                            : [...choiceEndPoint, observation],
                        )
                      }
                      disabled={readOnly}
                    />

                    <label
                      htmlFor="caseload"
                      style={{
                        display: "flex",
                        alignItems: "end",
                        color: readOnly ? "grey" : "inherit",
                      }}
                    >
                      {observation}
                    </label>
                  </>
                ) : (
                  <>
                    <XNGCheckbox
                      checked={Boolean(otherObservation?.startsWith("Other:"))}
                      onToggle={() =>
                        props.editSession(
                          `studentJournalList.${props.selectedStudentIndex}.observationSection.observations`,
                          otherObservation
                            ? [
                                ...choiceEndPoint.filter((ob) => ob !== otherObservation),
                                toggleOtherObservation(otherObservation),
                              ]
                            : [...choiceEndPoint, "Other:"],
                        )
                      }
                      disabled={readOnly}
                    />

                    <label
                      htmlFor="caseload"
                      style={{
                        display: "flex",
                        alignItems: "end",
                        color: readOnly ? "grey" : "inherit",
                      }}
                    >
                      {observation}
                    </label>

                    <TextField
                      size="small"
                      onBlur={(e) =>
                        setDraftSession(
                          produce((draft) => {
                            draft.studentJournalList![
                              selectedStudentIndex
                            ].observationSection!.observations = getNewOtherValue(e.target.value);
                          }),
                        )
                      }
                      defaultValue={otherObservation && getOtherObservationText(otherObservation)}
                      disabled={readOnly}
                    />
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            float: "left",
            width: isMobile ? "100%" : "50%",
            gap: getSizing(3),
          }}
        >
          {props.isAllStudentView && (
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  height: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography mr="1rem" className="noselect" variant="h6">
                  Student Notes
                </Typography>
              </Box>
              <Divider sx={{ my: "0.8rem" }} />
            </Box>
          )}
          <XNGInput
            multiline
            row={12}
            value={studentNotes}
            onChange={(e) => {
              setStudentNotes(e.target.value);
            }}
            onBlur={() =>
              props.editSession(
                `studentJournalList.${props.selectedStudentIndex}.observationSection.narrative`,
                studentNotes,
              )
            }
            disabled={readOnly}
          />
        </Box>
      </Box>
    </TabInnerViewportLayoutTwoTitles>
  );
}
