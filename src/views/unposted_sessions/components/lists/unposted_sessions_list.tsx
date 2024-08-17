import { selectServiceProviderProfile } from "../../../../context/slices/loggedInClientSlice";
import { useXNGSelector } from "../../../../context/store";

import React from "react";
import { SessionSlimCard } from "../../../../session-sdk";
import useUnpostedSessionsCtx from "../../hooks/context/useUnpostedSessionsCtx";
import UnpostedSessionsCard from "../cards/unpostedSessionCard/unposted_sessions_card";
import SlideShow from "../common/slide_show";

const UnpostedSessionsList = () => {
  const loggedInProviderId = useXNGSelector(selectServiceProviderProfile)?.id;
  const slimCards =
    useUnpostedSessionsCtx().unpostedSessionsData.unpostedSessionsApiData?.slimCards;
  const serviceProviders =
    useUnpostedSessionsCtx().unpostedSessionsData.unpostedSessionsApiData?.filterOptions
      ?.providerOptions;

  const selectedProviders = useUnpostedSessionsCtx().selectedFilterData.selectedFilter.providers;
  const selectedStudents = useUnpostedSessionsCtx().selectedFilterData.selectedFilter.students;

  const filteredCards = React.useMemo(() => {
    const slimKeys = Object.keys(slimCards || {});

    if (selectedProviders && selectedProviders.length > 0) {
      const cards: {
        [key: string]: SessionSlimCard[];
      } = {};
      selectedProviders.forEach((provider) => {
        if (slimCards && slimKeys.includes(provider.id) && slimCards[provider.id]) {
          cards[provider.id] = slimCards[provider.id].filter(
            (card) =>
              card.students?.find(
                (student) =>
                  selectedStudents?.find((selectedStudent) => selectedStudent.id === student.id),
              ),
          );
        }
      });
      return cards;
    }
  }, [selectedProviders, selectedStudents, slimCards]);

  return (
    <SlideShow
      maxheight
      items={
        (filteredCards &&
          Object.keys(filteredCards)
            .sort((a, b) => {
              if (a === loggedInProviderId) return -1;
              if (b === loggedInProviderId) return 1;
              return 0;
            })
            .map((key) => (
              <UnpostedSessionsCard
                key={key}
                filteredSessions={filteredCards[key]}
                totalSessionCount={slimCards?.[key]?.length || 0}
                serviceProvider={serviceProviders?.find((provider) => provider.id === key)}
              />
            ))) ||
        []
      }
    />
  );
};

export default UnpostedSessionsList;
