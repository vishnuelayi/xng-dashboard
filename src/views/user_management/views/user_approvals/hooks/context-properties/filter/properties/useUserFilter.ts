import React from "react";
import UserCardRequest from "../../../../types/user_card_request";
import UsersCardsFilterType from "../../../../types/user_cards_filter_type";

/**
 * A custom React hook that provides state management for filtering user cards.
 * @returns An object containing the following properties and methods:
 * - userCards: an array of selected user cards.
 * - selectedAllCards: an object containing a boolean value indicating whether all user cards are selected and a boolean value indicating whether to trigger an update.
 * - searchFilterValue: a string representing the search filter value.
 * - setSelectAllCards: a function that sets the selectedAllCards state.
 * - addCard: a function that adds a user card to the userCards state.
 * - removeCard: a function that removes a user card from the userCards state.
 * - updateCard: a function that updates a user card in the userCards state.
 * - setSearchFilterValue: a function that sets the searchFilterValue state.
 */
const useUserFilter = () => {
  const [selectedUserCards, setSelectedUserCards] = React.useState<UserCardRequest[]>([]);
  const [selectAllUserCards, setSelectAllUserCards] = React.useState<{
    value: boolean;
    triggerUpdate: boolean;
  }>({
    value: false,
    triggerUpdate: false,
  });
  const [selectedUserCardsSearch, setSelectedUserCardsSearch] = React.useState<string | null>("");

  const setSelectedUserCardsSearchHandler = (search: string) => {
    setSelectedUserCardsSearch(search);
  };

  const selectAllUserCardsHandler = (triggerUpdate: boolean, value?: boolean) => {
    setSelectAllUserCards((prev) => ({
      value: value ?? !prev.value,
      triggerUpdate,
    }));
  };

  const setSelectedUserCardsHandler = (userCard: UserCardRequest) => {
    // console.log("setSelectedUserCardsHandler", userCard);
    // setSelectedUserCards((prev) => [...prev, userCard])
    setSelectedUserCards((prev) => {
      return prev.find((prevCard) => prevCard.id === userCard.id) ? prev : [...prev, userCard];
    });
  };

  const removeSelectedUserCardsHandler = (id: string) => {
    setSelectedUserCards((prev) => prev.filter((selectedUser) => selectedUser.id !== id));
  };

  const updadateSelectedUserCardsHandler = (userCard: UserCardRequest) => {
    setSelectedUserCards((prev) => {
      return prev.map((selectedUser) =>
        selectedUser.id === userCard.id ? { ...selectedUser, ...userCard } : { ...selectedUser },
      );
    });
  };

  const hadCardHandler = (id: string) => {
    // console.log("hadCardHandler", id);
    // console.log("selectedUserCards", selectedUserCards);
    return selectedUserCards.some((selectedUser) => selectedUser.id === id);
  };

  const addAllCardsHandler = (userCards: UserCardRequest[]) => {
    // console.log("addAllCardsHandler", userCards);
    setSelectedUserCards((prev) => {
      const existingIds = prev.map((card) => card.id);
      const newCards = userCards.filter((card) => !existingIds.includes(card.id));
      return [...prev, ...newCards];
    });
  };

  const removeAllCardsHandler = () => {
    setSelectedUserCards([]);
  };

  //This is a workaround for the issue where the user cards are not being removed from the selected cards when the user cards are filtered out.
  const cleanupSelectedCardsHandler = (filteredCards: UserCardRequest[]) => {
    setSelectedUserCards((prev) => {
      const existingIds = filteredCards.map((card) => card.id);
      return prev.filter((card) => existingIds.includes(card.id));
    });
  };

  const userCardsFilterData: UsersCardsFilterType = {
    userCards: selectedUserCards,
    selectedAllCards: selectAllUserCards,
    searchValue: selectedUserCardsSearch,
    setSelectAllCards: selectAllUserCardsHandler,
    addCard: setSelectedUserCardsHandler,
    removeCard: removeSelectedUserCardsHandler,
    updateCard: updadateSelectedUserCardsHandler,
    hasCard: hadCardHandler,
    setSearchValue: setSelectedUserCardsSearchHandler,
    addAllCards: addAllCardsHandler,
    removeAllCards: removeAllCardsHandler,
    cleanupSelectedCards: cleanupSelectedCardsHandler,
  };

  return userCardsFilterData;
};

export default useUserFilter;
