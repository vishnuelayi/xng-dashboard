import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import Box from "../../design/components-dev/BoxExtended";
import { getSizing } from "../../design/sizing";
import XNGAvatar from "../../design/low-level/avatar";
import { ServiceProviderRef } from "../../profile-sdk";
import { Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { Instance } from "@popperjs/core";
import { useCalendarContext } from "./context/context";
import toggleFromArray from "../../utils/getToggledArray";
import { useXNGSelector } from "../../context/store";
import { selectUserIsSignedInAsDEP } from "../../context/slices/dataEntryProvider";
dayjs.extend(weekday);

/**
 * Presentational component in charge of displaying bubbles for each approver the user is capable of viewing sessions for.
 */
export function ApproverFilterBubbles() {
  const calendarContext = useCalendarContext();
  const fullSelectableAssistantList = calendarContext.calendarFilterState.fullSelectableAssistantList;
  const userIsSignedInAsDEP = useXNGSelector(selectUserIsSignedInAsDEP);

  return (
    <>
      {!userIsSignedInAsDEP && (
        <Box sx={{ position: "relative", height: "3rem" }}>
          <Box
            sx={{
              display: "flex",
              "#avatar": {
                marginRight: getSizing(-1.5),
              },
              maxHeight: "2.8rem",
              overflow: "hidden",
              ":hover": {
                "#avatar": { marginRight: 0 },
                "#view-more-placeholder": { display: "none" },
                maxHeight: "unset",
                bgcolor: "#FFF5",
                border: "1px solid #CCC5",
                transform: "translateX(-1px) translateY(-1px)",
                backdropFilter: "blur(2px)",
              },
              minWidth: "10.6rem",
              flexWrap: "wrap",
              zIndex: 999,
              gap: ".25rem",
              position: "absolute",
              padding: ".25rem",
              borderRadius: "4px",
              transition: "background-color .1s ease",
            }}
          >
            {fullSelectableAssistantList.map((thisAssistant: ServiceProviderRef, i: number) => {
              const isSelected = calendarContext.calendarFilterState.selectedAssistantRefs
                .map((a) => a.id!)
                .includes(thisAssistant.id!);

              function handleClick() {
                const newSelectedAssistants = toggleFromArray(
                  thisAssistant,
                  calendarContext.calendarFilterState.selectedAssistantRefs,
                );
                calendarContext.calendarFilterState.setSelectedAssistants(newSelectedAssistants);
              }

              return (
                <React.Fragment key={i}>
                  {i === 4 && (
                    <div id="view-more-placeholder">
                      <ViewMorePlaceholder />
                    </div>
                  )}
                  <Avatar
                    firstName={thisAssistant.firstName ?? ""}
                    lastName={thisAssistant.lastName ?? ""}
                    isSelected={isSelected}
                    onClick={() => handleClick()}
                  />
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
}

function Avatar(props: {
  isSelected: boolean;
  firstName: string;
  lastName: string;
  onClick: () => void;
}) {
  const { isSelected, firstName, lastName } = props;

  const positionRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const popperRef = useRef<Instance>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent) {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  }

  return (
    <Box
      id="avatar"
      sx={{
        transition: "margin-right .2s ease",
        cursor: "pointer",
      }}
      onClick={props.onClick}
    >
      <Tooltip
        title={`${firstName} ${lastName}`}
        placement="top"
        arrow
        disableInteractive
        PopperProps={{
          popperRef,
          anchorEl: {
            getBoundingClientRect: () => {
              return new DOMRect(
                positionRef.current.x,
                areaRef.current!.getBoundingClientRect().y,
                0,
                0,
              );
            },
          },
        }}
      >
        <div ref={areaRef} onMouseMove={handleMouseMove}>
          <XNGAvatar
            variant={isSelected ? "default" : "light"}
            text={firstName![0] + lastName![0]}
          />
        </div>
      </Tooltip>
    </Box>
  );
}

function ViewMorePlaceholder() {
  return <XNGAvatar variant="light" text="..." />;
}
