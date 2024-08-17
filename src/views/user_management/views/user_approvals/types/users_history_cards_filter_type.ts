// import UserCardRequest from "./UserCardRequest";

type SelectedStatusType = 0 | 1 | 2;

type UsersHistoryCardsFilterType = {
  searchValue: string | null;
  statusValue: SelectedStatusType;
  setSearchValue: (search: string) => void;
  setStatusValue: (status: SelectedStatusType) => void;
};

export default UsersHistoryCardsFilterType;
