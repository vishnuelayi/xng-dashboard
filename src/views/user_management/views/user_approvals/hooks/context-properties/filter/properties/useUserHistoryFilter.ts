import React from "react";
import UsersHistoryCardsFilterType from "../../../../types/users_history_cards_filter_type";

/**
 * A custom React hook that provides state management for filtering user history cards.
 * @returns An object containing the following properties and methods:
 * - userCards: an array of selected user cards.
 * - searchFilterValue: a string representing the search filter value.
 * - statusValue: a string representing the status filter value.
 * - setSearchFilterValue: a function that sets the searchFilterValue state.
 * - setStatusFilterValue: a function that sets the statusFilterValue state.
 */
const useUserHistoryFilter = () => {
  const [selectedUserCardsSearch, setSelectedUserCardsSearch] = React.useState<string | null>("");

  const setSelectedUserCardsSearchHandler = (search: string) => {
    setSelectedUserCardsSearch(search);
  };

  const [selectedStatus, setSelectedStatus] =
    React.useState<UsersHistoryCardsFilterType["statusValue"]>(0);

  const setSelectedStatusHandler = (status: UsersHistoryCardsFilterType["statusValue"]) => {
    setSelectedStatus(status);
  };

  const userCardsFilterData: UsersHistoryCardsFilterType = {
    searchValue: selectedUserCardsSearch,
    statusValue: selectedStatus,
    setSearchValue: setSelectedUserCardsSearchHandler,
    setStatusValue: setSelectedStatusHandler,
  };

  return userCardsFilterData;
};

export default useUserHistoryFilter;
