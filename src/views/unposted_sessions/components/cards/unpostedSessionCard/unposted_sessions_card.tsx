import { Box } from "@mui/material";
import UnpostedSessionCardHeader from "./components/unposted_session_card_header";
import { UnpostedSessionCardContent } from "./components/unposted_session_card_content";
import { SessionSlimCard } from "../../../../../session-sdk";
import { ServiceProviderRef } from "../../../../../profile-sdk";

type Props = {
  serviceProvider: ServiceProviderRef | undefined;
  filteredSessions: SessionSlimCard[];
  totalSessionCount: number;
};

/**
 * This component renders the Unposted Sessions Card.
 * @returns The UnpostedSessionsCard component.
 */
const UnpostedSessionsCard = (props: Props) => {
  return (
    <Box
      sx={{
        maxWidth: "271px",
        minWidth: "240px",
        display: "flex",
        flexDirection: "column",
        overflowY: "hidden",
        // backgroundColor:"coral"
      }}
    >
      <UnpostedSessionCardHeader
        serviceProvider={props.serviceProvider}
        totalUnpostedSessionsCount={props.totalSessionCount}
        filteredUnpostedSessionsCount={props.filteredSessions.length}
      />
      <UnpostedSessionCardContent serviceProviderId={props.serviceProvider?.id} sessions={props.filteredSessions || []} />
    </Box>
  );
};

export default UnpostedSessionsCard;
