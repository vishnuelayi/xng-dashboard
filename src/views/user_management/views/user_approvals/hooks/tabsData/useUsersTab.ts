import React from "react";
import useUserApprovalsContext from "../context/useUserApprovalsContext";

import UserApprovalsTabsEnum from "../../types/user_approvals_tabs_enum";
import useXNGPagination from "../../../../../../hooks/use_xng_pagination";
import useUserManagementContext from "../../../../hooks/context/use_user_management_context";
import { allDistrictsOption } from "../../../../context/state/user_management_state_init";

const useUsersTab = (selectedTab: UserApprovalsTabsEnum) => {
  const apiData = useUserApprovalsContext().userManagementApiData.data;
  const usersFilterData = useUserApprovalsContext().userApprovalsFilterData.users;
  const selectedDistrict =
    useUserManagementContext().store.userManagementData.authorizedDistrictsFilterData
      .selectedDistricts;

  const cardsApiResponse =
    selectedTab === UserApprovalsTabsEnum.user_denials
      ? apiData?.deniedUsers
      : apiData?.unapprovedUsers;
  const contextFilterData =
    selectedTab === UserApprovalsTabsEnum.user_denials
      ? usersFilterData.denials
      : usersFilterData.approvals;
  // const setAllCards = selectedTab === UserApprovalsTabsEnum.user_denials ? usersFilterData.denials.setSelectAllCards : usersFilterData.approvals.setSelectAllCards;

  const filteredCards = React.useMemo(() => {
    const searchValue = contextFilterData.searchValue;

    return cardsApiResponse?.filter((userManagementCard) => {
      const fullName = `${userManagementCard.user?.firstName} ${userManagementCard.user?.lastName}`;
      const inSelectedDistrict =
        selectedDistrict.name === allDistrictsOption.name
          ? true
          : !!userManagementCard.districtAccessRequests?.find(
              (districtReqAccess) => districtReqAccess.district?.id === selectedDistrict.id,
            );
      return (
        fullName.toLowerCase().includes(searchValue?.toLowerCase() || "") && inSelectedDistrict
      );
    });
  }, [cardsApiResponse, contextFilterData.searchValue, selectedDistrict]);

  const paginatedData = useXNGPagination(filteredCards);

  return {
    filteredCards,
    contextFilterData,
    paginatedData,
  };
};

export default useUsersTab;
