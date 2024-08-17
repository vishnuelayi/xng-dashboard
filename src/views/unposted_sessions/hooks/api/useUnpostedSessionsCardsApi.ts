import React from "react";
import { API_SESSIONS } from "../../../../api/api";
import { selectClientID, selectServiceProviderProfile } from "../../../../context/slices/loggedInClientSlice";
import { selectStateInUS } from "../../../../context/slices/stateInUsSlice";
import { useXNGDispatch, useXNGSelector } from "../../../../context/store";
import { selectLoggedInClientAssignment } from "../../../../context/slices/userProfileSlice";
import UnpostedSessionsCardApiData from "../../types/UnpostedSessionsCardApiData";
import { ServiceProviderRef } from "../../../../profile-sdk";
import { unpostedSessionsActions } from "../../../../context/slices/unpostedSessionsSlice";
import { GetSlimSessionCardsResponse, SessionStatus } from "../../../../session-sdk";
import { getUserTimeZone } from "../../../../utils/timeZones";
import dayjs from "dayjs";
import removeArrayDuplicates from "../../../../utils/remove_array_duplicates";

const useUnpostedSessionsCardsApi = (refetch:boolean) => {
  const state = useXNGSelector(selectStateInUS);

  const loggedInClientId = useXNGSelector(selectClientID)
  const client = useXNGSelector(selectLoggedInClientAssignment);
  const serviceProvider = useXNGSelector(selectServiceProviderProfile);
  // console.log("serviceProvider", serviceProvider);
  const appointingServiceProviders = useXNGSelector(selectLoggedInClientAssignment)
    ?.appointingServiceProviders; //providers you're posting on behalf of as a DEC
  const supervisedServiceProviders = useXNGSelector(selectLoggedInClientAssignment)
    ?.supervisedServiceProviders; //providers documenting on your behalf as Assistants
  const allServiceProviders = React.useMemo(() => {
    const providers = removeArrayDuplicates([
      // ...(serviceProvider ? [serviceProvider] : []),
      ...(appointingServiceProviders || []),
      ...(supervisedServiceProviders || []),
    ], ()=> "id");

    return providers;
  }, [appointingServiceProviders, supervisedServiceProviders]);
 
  const allServiceProvidersIds = React.useMemo(
    () => (Array.from(new Set(allServiceProviders?.map((provider) => provider?.id)))).join(","),
    [allServiceProviders],
  );

  const [data] = React.useState<UnpostedSessionsCardApiData["data"] | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const dispatch = useXNGDispatch();

  const getSlimSessionCards = React.useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      // const temp = appointingServiceProviders?.filter(p => p.id === "0fffc72d-a3c1-40db-b892-f156c760dead").map(p => p.id).toString();
      // // console.log("PUUL", temp)

      // const PaulsCards = await API_SESSIONS.v1SessionsSlimGet(
      //     temp || "",
      //     "0,1,2,3",
      //     state
      // );
      // console.log("PaulsCards", PaulsCards);
      const myUnpostedStatuses = [SessionStatus.NUMBER_0, SessionStatus.NUMBER_1, SessionStatus.NUMBER_3].join(",");
      const myUnpostedSessionCards = await API_SESSIONS.v1SessionsSlimGet(
        serviceProvider?.id || "",
        myUnpostedStatuses,
        loggedInClientId || "",
        state,
        dayjs().startOf("day").subtract(1, "year").toDate(),
        dayjs().endOf("day").toDate(),
        getUserTimeZone()
      );
      // console.log("allServiceProvidersIds", allServiceProvidersIds);
      // console.log("myUnpostedSessionCards", myUnpostedSessionCards);
      const otherUnpostedStatuses = [SessionStatus.NUMBER_0, SessionStatus.NUMBER_1, SessionStatus.NUMBER_2, SessionStatus.NUMBER_3].join(",");
      const approverUnpostedStatuses = [SessionStatus.NUMBER_2].join(",");
      let otherUnpostedSessionCards = {} as GetSlimSessionCardsResponse

      if(allServiceProvidersIds.length > 0){
        otherUnpostedSessionCards = await API_SESSIONS.v1SessionsSlimGet(
          allServiceProvidersIds,
          client.isApprover && !client.isProxyDataEntry ? approverUnpostedStatuses : otherUnpostedStatuses,
          loggedInClientId || "",
          state,
          dayjs().startOf("day").subtract(1, "year").toDate(),
          dayjs().endOf("day").toDate(),
          getUserTimeZone(),
        );
      }

      const slimCardsResponse: GetSlimSessionCardsResponse = {
        providerUnpostedSessionsDictionary: {
          ...myUnpostedSessionCards.providerUnpostedSessionsDictionary,
          ...otherUnpostedSessionCards.providerUnpostedSessionsDictionary,
        },
        students: [
          ...(myUnpostedSessionCards.students || []),
          ...(otherUnpostedSessionCards.students || []),
        ],
      };

      // console.log("DECs and assistants", myUnpostedSessionCards);
      const slimCards = {
        ...myUnpostedSessionCards.providerUnpostedSessionsDictionary,
        ...otherUnpostedSessionCards.providerUnpostedSessionsDictionary,
      };
      // const fl = Object.values(slimCards).flat();
      const unpostedSessionsCards: UnpostedSessionsCardApiData["data"] = {
        slimCards,
        filterOptions: {
          campusOptions: [],
          providerOptions:
            [...([serviceProvider as ServiceProviderRef] || []), ...(allServiceProviders || [])] ||
            [],
          studentOptions:
            [
              ...(myUnpostedSessionCards.students || []),
              ...(otherUnpostedSessionCards.students || []),
            ] || [],
        },
        unpostedSessions: Object.values(slimCards).flat() || [],
      };

      // setData(unpostedSessionsCards);
      dispatch(unpostedSessionsActions.setUnpostedSessionsMappedCards(unpostedSessionsCards));
      dispatch(unpostedSessionsActions.setUnpostedSessionsCards(slimCardsResponse));
      // console.log("myUnpostedSessionCards", myUnpostedSessionCards);
    } catch (error) {
      console.log(error);
      setError("Error fetching unposted sessions");
    } finally {
      setIsLoading(false);
    }
  }, [allServiceProviders, allServiceProvidersIds, client.isApprover, client.isProxyDataEntry, dispatch, loggedInClientId, serviceProvider, state]);

  React.useEffect(() => {
    // const getSlimSessionCards = async () => {
    //     setIsLoading(true);
    //     setError("");
    //     try {

    //         // const temp = appointingServiceProviders?.filter(p => p.id === "0fffc72d-a3c1-40db-b892-f156c760dead").map(p => p.id).toString();
    //         // // console.log("PUUL", temp)

    //         // const PaulsCards = await API_SESSIONS.v1SessionsSlimGet(
    //         //     temp || "",
    //         //     "0,1,2,3",
    //         //     state
    //         // );
    //         // console.log("PaulsCards", PaulsCards);

    //         const myUnpostedSessionCards = await API_SESSIONS.v1SessionsSlimGet(
    //             serviceProvider?.id || "",
    //             "0,1,3",
    //             state
    //         );
    //             // console.log("myUnpostedSessionCards", myUnpostedSessionCards);
    //         const otherUnpostedSessionCards = await API_SESSIONS.v1SessionsSlimGet( allServiceProvidersIds,
    //             "0,1,2,3",
    //             state);

    //         const slimCardsResponse:GetSlimSessionCardsResponse = {
    //             providerUnpostedSessionsDictionary:{
    //                 ...myUnpostedSessionCards.providerUnpostedSessionsDictionary,
    //                 ...otherUnpostedSessionCards.providerUnpostedSessionsDictionary,
    //             },
    //             students: [...(myUnpostedSessionCards.students || []), ...(otherUnpostedSessionCards.students || [])],
    //             }

    //         // console.log("DECs and assistants", myUnpostedSessionCards);
    //         const slimCards = {...myUnpostedSessionCards.providerUnpostedSessionsDictionary, ...otherUnpostedSessionCards.providerUnpostedSessionsDictionary};
    //         // const fl = Object.values(slimCards).flat();
    //         const unpostedSessionsCards: UnpostedSessionsCardApiData["data"] ={
    //            slimCards,
    //             filterOptions: {
    //                 campusOptions: [],
    //                 providerOptions: [...([serviceProvider as ServiceProviderRef] || []), ...(allServiceProviders || [])] || [],
    //                 studentOptions: [...(myUnpostedSessionCards.students || []), ...(otherUnpostedSessionCards.students || [])] || [],
    //             },
    //             unpostedSessions: Object.values(slimCards).flat() || [],
    //         }

    //         // setData(unpostedSessionsCards);
    //         dispatch(unpostedSessionsActions.setUnpostedSessionsMappedCards(unpostedSessionsCards));
    //         dispatch(unpostedSessionsActions.setUnpostedSessionsCards(slimCardsResponse));
    //         // console.log("myUnpostedSessionCards", myUnpostedSessionCards);
    //     } catch (error) {
    //         // console.error(error);
    //         setError("Error fetching unposted sessions");
    //     }
    //     finally {
    //         setIsLoading(false);
    //     }
    // };

    getSlimSessionCards();
  }, [getSlimSessionCards, refetch]);

  const unpostedSessionsApiData: UnpostedSessionsCardApiData | undefined = {
    data,
    isLoading,
    error,
  };

  return unpostedSessionsApiData;
};

export default useUnpostedSessionsCardsApi;
