import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import SessionListAction from "./session-list-action";
import SessionListItem from "./session-list-item";
import usePalette from "../../../../../../hooks/usePalette";
import { ActualSession } from "../../../../../../session-sdk";
import XNGSpinner from "../../../../../../design/low-level/spinner";
import { Typography } from "@mui/material";
import useUserRole from "../../../../../../hooks/useUserRole";

interface SessionListContainerProps {
  sessions: ActualSession[];
  selectedIds: string[];
  selectedIndexes: number[];
  onSelect: (sessionId: string, checked: boolean, index: number) => void;
  onSelectAll: (checked: boolean) => void;
  isLoading: boolean;
  isPosting: boolean;
}

export default function SessionListContainer({
  sessions,
  selectedIds,
  onSelect,
  onSelectAll,
  selectedIndexes,
  isLoading,
  isPosting,
}: SessionListContainerProps) {
  const palette = usePalette();
  const { isAssistant } = useUserRole();

  return (
    <Box sx={{ paddingX: "18px" }}>
      <Divider />

      <SessionListAction
        total={sessions.length}
        selectedAll={sessions.length === selectedIds.length}
        onSelectAll={onSelectAll}
      />

      <Divider sx={{ borderWidth: "2px", borderColor: palette.primary[2] }} />
      {!isLoading && !isPosting ? (
        sessions.map((session: any, index: number) => (
          <SessionListItem
            key={session.id ? session.id : index}
            session={session}
            checked={selectedIndexes.includes(index)}
            onSelect={(checked) => onSelect(session.id, checked, index)}
          />
        ))
      ) : (
        <Box
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={3}
        >
          <XNGSpinner />
          <Typography variant="h5" color={palette.primary[1]} textAlign={"center"}>
            {`${!isPosting ? "Loading unposted" : "Approving"} sessions...`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
