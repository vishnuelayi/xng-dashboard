import UserCardRequest from "./user_card_request";

type UsersCardsFilterType = {
  userCards: UserCardRequest[];
  selectedAllCards: { value: boolean; triggerUpdate: boolean };
  searchValue: string | null;
  addCard: (userCard: UserCardRequest) => void;
  removeCard: (id: string) => void;
  updateCard: (userCard: UserCardRequest) => void;
  hasCard: (id: string) => boolean;
  addAllCards: (userCards: UserCardRequest[]) => void;
  removeAllCards: () => void;
  setSelectAllCards: (triggerUpdate: boolean, value?: boolean) => void;
  cleanupSelectedCards: (filteredCards: UserCardRequest[]) => void;
  setSearchValue: (search: string) => void;
};

export default UsersCardsFilterType;
