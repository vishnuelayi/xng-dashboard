import { Box, Stack } from "@mui/material";
import UserManagementCard from "../../components/user/cards/user_management_card";
import useUserApprovalsContext from "../../hooks/context/useUserApprovalsContext";
import UserApprovalsTabsEnum from "../../types/user_approvals_tabs_enum";
import UserApprovalsPagination from "../../components/common/user_approval_pagination";
import {
  DistrictAccessRequestRef,
  RespondToRequestForDistrictAccessRequest,
  UserManagementCard as UserManagementCardType,
  UserServiceProviderRef,
  XLogsRole,
} from "../../../../../../profile-sdk";

import React from "react";
import useUsersTab from "../../hooks/tabsData/useUsersTab";
import { ConstructRoleAssignmentsFromXLogsRoleEnumOrString } from "../../../../../../utils/xlogs_role_mapper";
import UserCardRequest from "../../types/user_card_request";
import useUserManagementContext from "../../../../hooks/context/use_user_management_context";

const UserCardsGrid = () => {
  const user = useUserManagementContext().store.userManagementData.user;
  const selectedTabIndex = useUserApprovalsContext().approvalsTabIndex.selectedTabIndex;

  const userDenialsTab = useUsersTab(UserApprovalsTabsEnum.user_denials);
  const userApprovalsTab = useUsersTab(UserApprovalsTabsEnum.user_approvals);
  const actionLoading = useUserApprovalsContext().userApprovalsActions.actionLoading;

  const selectedUserTabData = React.useMemo(() => {
    switch (selectedTabIndex) {
      case UserApprovalsTabsEnum.user_approvals:
        return userApprovalsTab;
      case UserApprovalsTabsEnum.user_denials:
        return userDenialsTab;
      default:
        return userApprovalsTab;
    }
  }, [selectedTabIndex, userApprovalsTab, userDenialsTab]);

  const cardRequestBodyMapper = (
    selectedDistricts: { id: string; label: string }[],
    selectedServiceProviderType: XLogsRole,
    requestingUser: UserServiceProviderRef | undefined,
    districtAccessRequests: DistrictAccessRequestRef[],
    clientId: string,
  ) => {
    // A user could request access to multiple disctrict therefore a single user may create multiple request for each district
    const reqBodyArray: RespondToRequestForDistrictAccessRequest[] = [];
    selectedDistricts.forEach((district) => {
      const districtRef = districtAccessRequests?.find(
        (request) => request.district?.id === district.id,
      );
      // console.log(ConstructRoleAssignmentsFromXLogsRole(selectedServiceProviderType as XLogsRole), "HA", XLogsRole.NUMBER_3, selectedServiceProviderType)
      const body: RespondToRequestForDistrictAccessRequest = {
        clientId: clientId,
        districtId: districtRef?.district?.id,
        message: districtRef?.district?.name, //Passing in district name for now here so we can store it as a varable and utilize it for the message to be passed in here
        notificationId: districtRef?.notificationId,
        respondingUser: user || {},
        responseType: 0,
        roleAssignments: ConstructRoleAssignmentsFromXLogsRoleEnumOrString(
          selectedServiceProviderType,
        ),
      };
      reqBodyArray.push(body);
    });
    // props.onAddCardData(reqBodyArray);
    const userCardRequest: UserCardRequest = {
      id: requestingUser?.id || "",
      requestBodyArray: reqBodyArray,
    };
    return userCardRequest;
  };

  // map the card data to the request body schema which is an object with a unique id and request body array
  const cardRequestSchemaMapper = (card: UserManagementCardType) => {
    return {
      id: card.user?.id,
      requestBodyArray: card.districtAccessRequests?.map((_) =>
        cardRequestBodyMapper(
          card.districtAccessRequests?.map((r) => ({
            id: r.district?.id || "",
            label: r.district?.name || "",
          })) || [],
          XLogsRole.NUMBER_3,
          card.user,
          card.districtAccessRequests || [],
          card.client?.id || "",
        ),
      ),
    } as UserCardRequest;
  };

  // strictly for updating the card data when the user clicks on the select all checkbox
  React.useEffect(() => {
    // console.log("BOOM")
    if (selectedUserTabData.contextFilterData.selectedAllCards.triggerUpdate) {
      if (selectedUserTabData.contextFilterData.selectedAllCards.value) {
        selectedUserTabData.contextFilterData.addAllCards(
          selectedUserTabData.filteredCards?.map((card) => cardRequestSchemaMapper(card)) || [],
        );
      } else {
        selectedUserTabData.contextFilterData.removeAllCards();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserTabData.contextFilterData.selectedAllCards]);

  // strictly for updating the select all checkbox as a side effect of the cards selected or cards filtered changing
  React.useEffect(() => {
    // remove cards not in the filtered cards
    selectedUserTabData.contextFilterData.cleanupSelectedCards(
      selectedUserTabData.filteredCards?.map((card) => cardRequestSchemaMapper(card)) || [],
    );

    //if all cards are not selected then set the select all checkbox to false
    if (
      (selectedUserTabData.contextFilterData.userCards.length <
        (selectedUserTabData.filteredCards?.length || [].length) &&
        selectedUserTabData.contextFilterData.selectedAllCards.value) ||
      (selectedUserTabData.filteredCards || []).length <= 0
    ) {
      // console.log("set select all to false")
      selectedUserTabData.contextFilterData.setSelectAllCards(false, false);
    }
    // if all cards are selected then set the select all checkbox to true
    else if (
      selectedUserTabData.contextFilterData.userCards.length ===
        (selectedUserTabData.filteredCards?.length || [].length) &&
      !selectedUserTabData.contextFilterData.selectedAllCards.value &&
      (selectedUserTabData.filteredCards || []).length > 0
    ) {
      // console.log("set select all to true")
      //TODO: Edge case: If the filtered card is not selected but the length of selected cards is equal to the length of filtered cards then we need to set the select all checkbox to false and cleanup the selected cards

      selectedUserTabData.contextFilterData.setSelectAllCards(false, true);
    }
    // accomodate for when length of filters change
    // else if((selectedUserTabData.contextFilterData.userCards.length > (selectedUserTabData.filteredCards?.length || [].length))){
    //   // remove cards not in the filtered cards
    //   console.log("cleanup")
    //   selectedUserTabData.contextFilterData.cleanupSelectedCards(selectedUserTabData.filteredCards?.map(card => cardRequestSchemaMapper(card)) || [])
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserTabData.contextFilterData.userCards.length, selectedUserTabData.filteredCards]);

  // console.log("filter", selectedUserTabData.filteredCards);
  // console.log("paginated", selectedUserTabData.paginatedData);

  return (
    <Box
      maxHeight={"1000px"}
      // bgcolor={"wheat"}

      pt={1}
      sx={{
        overflowY: "auto",
        opacity: actionLoading ? 0.5 : 1,
      }}
    >
      <Stack
        direction={"row"}
        gap={1}
        flexWrap={"wrap"}
        sx={{
          justifyContent: {
            xs: "center",
            sm: "flex-start",
          },
        }}
      >
        {selectedUserTabData.paginatedData.paginatedItems?.map((userManagementCard) => (
          <UserManagementCard
            key={userManagementCard.user?.id}
            districtOptions={
              userManagementCard.districtAccessRequests?.map((request) => ({
                id: request.district?.id || "",
                label: request.district?.name || "",
              })) || []
            }
            // selectAll={userManagementCardFilter.selectedAllCards}
            userCard={userManagementCard}
            user={user}
            cardResponseType={0} //TODO: REMEMBER TO SET IN THE FINAL REQUEST BODY MAP THIS BASED NO IF USER CLICKS ON THE DENIED OR APPROVED BUTTON
            hasCard={selectedUserTabData.contextFilterData.hasCard}
            onAddCardData={(data) => selectedUserTabData.contextFilterData.addCard(data)}
            onRemoveCardData={(id) => selectedUserTabData.contextFilterData.removeCard(id)}
            onUpdatedCardData={(data) => selectedUserTabData.contextFilterData.updateCard(data)}
            cardRequestBodyMapper={cardRequestBodyMapper}
          />
        ))}
      </Stack>
      <UserApprovalsPagination
        totalPages={selectedUserTabData.paginatedData.totalPages}
        currentPage={selectedUserTabData.paginatedData.currentPage}
        setCurrentPage={selectedUserTabData.paginatedData.setCurrentPage}
        showPagination={selectedUserTabData.paginatedData.showPagination}
      />
    </Box>
  );
};

export default UserCardsGrid;
