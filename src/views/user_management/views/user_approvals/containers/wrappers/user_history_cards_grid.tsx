import { Box, Stack } from "@mui/material";
import useUserApprovalsContext from "../../hooks/context/useUserApprovalsContext";
import UserApprovalsTabsEnum from "../../types/user_approvals_tabs_enum";
import UseUserApprovalDenialHistoryTab from "../../hooks/tabsData/useUserApprovalDenialHistoryTab";
import UserManagementHistoryCard from "../../components/user/cards/user_management_history_card";
import React from "react";

import { UserManagementHistoryCard as UserManagementHistoryCardType } from "../../../../../../profile-sdk";
import UserApprovalsPagination from "../../components/common/user_approval_pagination";
import useXNGPagination from "../../../../../../hooks/use_xng_pagination";
import useUserManagementContext from "../../../../hooks/context/use_user_management_context";
import { allDistrictsOption } from "../../../../context/state/user_management_state_init";

const UserHistoryCardsGrid = () => {
  const selectedTabIndex = useUserApprovalsContext().approvalsTabIndex.selectedTabIndex;
  const selectedDistrict =
    useUserManagementContext().store.userManagementData.authorizedDistrictsFilterData
      .selectedDistricts;
  const userHistoryTab = UseUserApprovalDenialHistoryTab();
  // console.log("selectedDeniedUsers", userDenialsCardsFilter.selectAllDeniedUserCards);

  const selectedUserTabData = React.useMemo(() => {
    switch (selectedTabIndex) {
      // case UserApprovalsTabsEnum.user_approvals:
      //   return userApprovalsTab;
      // case UserApprovalsTabsEnum.user_denials:
      //   return userDenialsTab;
      case UserApprovalsTabsEnum.approval_denial_history:
        return userHistoryTab;
      default:
        return userHistoryTab;
    }
  }, [selectedTabIndex, userHistoryTab]);

  const userManagementCardResponse = selectedUserTabData.cardsApiResponse;

  const userManagementCardFilter = selectedUserTabData.cardsFilter;

  const filteredCards = React.useMemo(() => {
    const searchValue = selectedUserTabData.cardsFilter.searchValue;

    return userManagementCardResponse?.filter((userManagementCard) => {
      const fullName = `${userManagementCard.user?.firstName} ${userManagementCard.user?.lastName} ${userManagementCard.user?.email}`;
      const inSelectedDistrict =
        selectedDistrict.name === allDistrictsOption.name
          ? true
          : !!userManagementCard.districts?.find(
              (district) => district?.id === selectedDistrict.id,
            );

      const StatusFilter =
        userManagementCardFilter.statusValue !== 0
          ? userManagementCard.currentStatus === userManagementCardFilter.statusValue
          : true;

      return (
        fullName.toLowerCase().includes(searchValue?.toLowerCase() || "") &&
        StatusFilter &&
        inSelectedDistrict
      );
    });
  }, [
    selectedDistrict,
    selectedUserTabData.cardsFilter.searchValue,
    userManagementCardFilter.statusValue,
    userManagementCardResponse,
  ]);

  const { paginatedItems, currentPage, totalPages, showPagination, setCurrentPage } =
    useXNGPagination<UserManagementHistoryCardType>(filteredCards);

  // console.log(filteredCards);
  return (
    <Box>
      <Box
        maxHeight={"1000px"}
        // bgcolor={"wheat"}
        pt={1}
        sx={{
          overflowY: "auto",
        }}
      >
        <Stack direction={"row"} gap={1} flexWrap={"wrap"}>
          {paginatedItems?.map((userManagementCard) => (
            <UserManagementHistoryCard
              key={userManagementCard.user?.id}
              userHistoryCard={userManagementCard}
            />
          ))}
        </Stack>
      </Box>
      <UserApprovalsPagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={(v) => setCurrentPage(v)}
        showPagination={showPagination}
      />
    </Box>
  );
};

export default UserHistoryCardsGrid;
