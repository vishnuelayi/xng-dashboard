import useUserApprovalsContext from "../context/useUserApprovalsContext";

const UseUserApprovalDenialHistoryTab = () => {
  const cardsApiResponse =
    useUserApprovalsContext().userManagementApiData.data?.approvalAndDenialHistory;
  const cardsFilter = useUserApprovalsContext().userApprovalsFilterData.users.history;
  // const setAllCards = useUserApprovalsContext().userApprovalsFilterData.users.approvals.setSelectAllCards;

  return {
    cardsApiResponse,
    cardsFilter,
  };
};

export default UseUserApprovalDenialHistoryTab;
