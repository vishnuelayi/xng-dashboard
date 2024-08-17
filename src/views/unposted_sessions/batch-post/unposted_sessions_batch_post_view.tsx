import Box from "@mui/material/Box";
import PageHeader from "./components/layout/page-header";
import ContentHeader from "./components/layout/content-header";
import SessionListContainer from "./components/lists/session-list/session-list-container";
import { useUnpostedSessionsBatchPostContext } from "./providers/unposted_sessions_batch_post_provider";

export default function UnpostedSessionsBatchPostView() {
  const {
    sessions,
    selectedSessionIds,
    onSelectSession,
    onSelectAllSessions,
    selectedSessionIndexes,
    isLoading,
    isPosting,
  } = useUnpostedSessionsBatchPostContext();

  return (
    <Box sx={{ overflow: "auto" }}>
      <PageHeader />

      <Box sx={{ paddingX: "54px" }}>
        <ContentHeader />

        <SessionListContainer
          sessions={sessions}
          selectedIds={selectedSessionIds}
          onSelect={onSelectSession}
          onSelectAll={onSelectAllSessions}
          selectedIndexes={selectedSessionIndexes}
          isLoading={isLoading}
          isPosting={isPosting}
        />
      </Box>
    </Box>
  );
}
