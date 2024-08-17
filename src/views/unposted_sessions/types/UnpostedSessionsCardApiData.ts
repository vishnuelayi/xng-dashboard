import { ServiceProviderRef, StudentRef } from "../../../profile-sdk";
import { GetSlimSessionCardsResponse, SessionSlimCard } from "../../../session-sdk";

type UnpostedSessionsCardApiData = {
    data: {
      slimCards: GetSlimSessionCardsResponse["providerUnpostedSessionsDictionary"] | undefined;
      filterOptions: {
        providerOptions: ServiceProviderRef[] | undefined,
        studentOptions: StudentRef[] | undefined,
        campusOptions: string[] | undefined,
      } | undefined,
      unpostedSessions: SessionSlimCard[] | undefined,
    } | undefined;
    isLoading: boolean;
    error: string;

} 

export default UnpostedSessionsCardApiData;