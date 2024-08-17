import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import XNGLabelTextContainer from "../../common/xng-label-text-container";
import XNGLabelText from "../../common/xng-label-text";
import dayjs from "dayjs";
import { useUnpostedSessionsBatchPostContext } from "../../../providers/unposted_sessions_batch_post_provider";
import { ActualSession } from "../../../../../../session-sdk";

interface SessionListItemProps {
  session: ActualSession;
  checked: boolean;
  onSelect: (checked: boolean) => void;
}

export default function SessionListItem({ session, checked, onSelect }: SessionListItemProps) {
  const { selectedStudentIds } = useUnpostedSessionsBatchPostContext();

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", paddingTop: "40px", paddingBottom: "65px" }}
      >
        <FormControlLabel
          sx={{ marginBottom: "30px" }}
          checked={checked}
          onChange={(_, checked) => onSelect(checked)}
          control={<Checkbox size="small" />}
          label={
            <XNGLabelTextContainer component="span" flexItems={false}>
              <XNGLabelText
                label="Service Provider: "
                text={
                  session &&
                  session.serviceProvider &&
                  session.serviceProvider.firstName! + session.serviceProvider.lastName
                }
                size="medium"
              />
              <XNGLabelText
                label="Date: "
                text={dayjs(session?.meetingDetails?.date).format("MM/DD/YYYY")}
                size="medium"
              />
              <XNGLabelText
                label="Service: "
                text={session && session.service && session.service.name}
                size="medium"
              />
            </XNGLabelTextContainer>
          }
        />

        <XNGLabelTextContainer sx={{ width: "600px", marginBottom: "20px" }}>
          <XNGLabelText
            label="Start Time: "
            text={dayjs(session?.meetingDetails?.startTime).format("LT")}
          />
          <XNGLabelText
            label="End Time: "
            text={dayjs(session?.meetingDetails?.endTime).format("LT")}
          />
          <XNGLabelText
            label="Duration: "
            text={`${dayjs(session?.meetingDetails?.endTime)
              .diff(session?.meetingDetails?.startTime, "m")
              .toString()} minutes`}
          />
        </XNGLabelTextContainer>

        <XNGLabelTextContainer sx={{ width: "600px", marginBottom: "40px" }}>
          <XNGLabelText label="Location: " text={session?.meetingDetails?.location?.name} />
          <XNGLabelText
            label="Group Size: "
            text={session?.groupSetting ? `Group (${session?.studentJournalList?.length})` : "Individual"}
          />
          <XNGLabelText label="Session Narrative: " text={session?.sessionJournal?.narrative} />
        </XNGLabelTextContainer>

        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: "40px" }}>
          <XNGLabelText sx={{ marginBottom: "20px" }} label="Students: " size="big" />

          {session?.studentJournalList?.map(
            ({
              student,
              studentAttendanceRecord,
              observationSection,
              careProvisionLedger,
              approval,
            }: any) => {
              const { signedByFullName, signedOnDateLocal } =
                approval?.authorizingProviderSignature || {};

              return (
                selectedStudentIds.includes(student.id) && (
                  <Box
                    key={student.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      "&:not(:last-child)": {
                        marginBottom: "20px",
                      },
                    }}
                  >
                    <XNGLabelTextContainer sx={{ width: "600px", marginBottom: "20px" }}>
                      <XNGLabelText
                        sx={{ marginBottom: "20px" }}
                        label={`${student.firstName} ${student.lastName}`}
                      />

                      {approval?.authorizingProvider && (
                        <XNGLabelText
                          sx={{ marginBottom: "20px" }}
                          label={`Approved by ${signedByFullName} on ${dayjs(
                            signedOnDateLocal,
                          ).format("MM/DD/YYYY")}`}
                        />
                      )}
                    </XNGLabelTextContainer>

                    <XNGLabelTextContainer sx={{ width: "600px", marginBottom: "20px" }}>
                      <XNGLabelText
                        label="Start Time: "
                        text={dayjs(studentAttendanceRecord.arrivalTime).format("LT")}
                      />
                      <XNGLabelText
                        label="End Time: "
                        text={dayjs(studentAttendanceRecord.departureTime).format("LT")}
                      />
                      <XNGLabelText
                        label="Duration: "
                        text={`${dayjs(studentAttendanceRecord.departureTime)
                          .diff(studentAttendanceRecord.arrivalTime, "m")
                          .toString()} minutes`}
                      />
                    </XNGLabelTextContainer>

                    <XNGLabelTextContainer sx={{ width: "600px", marginBottom: "20px" }}>
                      <XNGLabelText label="Rationale: " text={studentAttendanceRecord.rationale} />
                      <XNGLabelText
                        label="Student Narrative: "
                        text={observationSection.narrative}
                      />
                      <XNGLabelText
                        label="Time Away: "
                        text={studentAttendanceRecord.timeAwayMinutes}
                      />
                    </XNGLabelTextContainer>

                    <XNGLabelText
                      label="Activities: "
                      text={careProvisionLedger.activities
                        .map((activity: any) => activity.name)
                        .join(", ")}
                    />
                  </Box>
                )
              );
            },
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <XNGLabelText label="Audit Items: " size="big" />
        </Box>
      </Box>

      <Divider />
    </>
  );
}
